"use client";

import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PKWTMakerPage: React.FC = () => {
  const initialFormData = {
    // Company Info
    companyName: 'PT. Ansinda Telecommunications Indonesia',
    companyAddress: 'Jl. Jend. Sudirman No. Kav 52-53, RT.5/RW.3, Senayan, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12190',
    hrdName: 'Diah Ratnasari',

    // Employee Info
    employeeName: '',
    employeeId: '', // NIK/KTP
    birthPlaceDate: '',
    address: '',
    position: '',
    department: '',

    // Contract Details
    startDate: '',
    endDate: '',
    duration: '',

    // Salary & Allowances
    baseSalary: '',
    positionAllowance: '',
    overtimeAllowance: '',
    mealAllowance: '',
    transportAllowance: '',
    communicationAllowance: '',
    motorcycleAllowance: '',
    laptopAllowance: '',

    // Bank Details
    bankName: '',
    accountNumber: '',
    accountHolderName: '',

    // Project Details
    projectDetails: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));
  }, []);

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const moneyFields = [
      'baseSalary', 'positionAllowance', 'overtimeAllowance',
      'mealAllowance', 'transportAllowance', 'communicationAllowance',
      'motorcycleAllowance', 'laptopAllowance'
    ];

    let newValue = value;
    if (moneyFields.includes(name)) {
      newValue = formatNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleClear = () => {
    setFormData(initialFormData);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('pkwt-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If content is longer than one page, we might need multi-page support
      // For now, we'll scale it to fit or let it span if needed (basic implementation)
      // Given the length, it likely needs multiple pages or a very long single page PDF
      // But standard jsPDF addImage puts it on one page. 
      // Let's try to fit it or just add it. If it's too long, it might look small.
      // Better approach for long content: split into pages. 
      // However, for this specific request, let's stick to the standard implementation 
      // and maybe adjust height. If the user wants multi-page, we can refine.
      // Actually, let's just add it. If it's really long, we might need to handle paging.
      // For this iteration, basic addImage.

      if (imgHeight > 297) {
        // Simple multi-page handling
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= 297;
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      pdf.save(`PKWT-${formData.employeeName || 'Employee'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSendEmail = () => {
    const subject = `PKWT - ${formData.employeeName || 'Employee'}`;
    // Constructing a simplified plain text body
    const body = `
PERJANJIAN KERJA WAKTU TERTENTU (PKWT)

Yang bertanda tangan di bawah ini:

1. Nama: ${formData.hrdName}
   Jabatan: HRD MANAGER
   Alamat: ${formData.companyAddress}
   Selanjutnya disebut "PIHAK PERTAMA"

2. Nama: ${formData.employeeName}
   Tempat/Tgl. Lahir: ${formData.birthPlaceDate}
   No. KTP: ${formData.employeeId}
   Alamat: ${formData.address}
   Selanjutnya disebut "PIHAK KEDUA"

Pasal 1: JANGKA WAKTU PERJANJIAN
Mulai tanggal ${formData.startDate} sampai dengan ${formData.endDate} (${formData.duration} Bulan).

Pasal 2: TUGAS DAN PENEMPATAN
Posisi: ${formData.position}
Departemen: ${formData.department}

Pasal 3: UPAH POKOK DAN TUNJANGAN-TUNJANGAN
Gaji Pokok: Rp ${formData.baseSalary}
Tunjangan Jabatan: Rp ${formData.positionAllowance}
Tunjangan Makan: Rp ${formData.mealAllowance}
Tunjangan Transport: Rp ${formData.transportAllowance}
Tunjangan Komunikasi: Rp ${formData.communicationAllowance}
Tunjangan Lembur: Rp ${formData.overtimeAllowance}
Tunjangan Sewa Motor: Rp ${formData.motorcycleAllowance}
Tunjangan Laptop: Rp ${formData.laptopAllowance}

Pembayaran melalui rekening:
Bank: ${formData.bankName}
No. Rekening: ${formData.accountNumber}
A.n: ${formData.accountHolderName}

(See attached PDF for full contract details)
    `.trim();

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">PKWT Maker</h1>
        <p className="text-gray-600 mt-2">Create and manage Perjanjian Kerja Waktu Tertentu (Fixed-term Work Agreements)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PKWT Form */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New PKWT</h2>

          <div className="space-y-4">
            {/* Employee Info */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Employee Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Employee Name"
                />
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="No. KTP / NIK"
                />
                <input
                  type="text"
                  name="birthPlaceDate"
                  value={formData.birthPlaceDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Place, Date of Birth (e.g. Jakarta, 01 Jan 1990)"
                />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Address"
                />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Position"
                />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Department"
                />
              </div>
            </div>

            {/* Contract Details */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Contract Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                />
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Duration (Months)"
                />
              </div>
            </div>

            {/* Salary & Allowances */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Salary & Allowances</h3>
              <div className="grid grid-cols-1 gap-3">
                <input type="text" name="baseSalary" value={formData.baseSalary} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Base Salary (Gaji Pokok)" />
                <input type="text" name="positionAllowance" value={formData.positionAllowance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Position Allowance (Tunjangan Jabatan)" />
                <input type="text" name="overtimeAllowance" value={formData.overtimeAllowance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Overtime Allowance (Tunjangan Lembur)" />
                <input type="text" name="mealAllowance" value={formData.mealAllowance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Meal Allowance (Tunjangan Makan)" />
                <input type="text" name="transportAllowance" value={formData.transportAllowance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Transport Allowance (Tunjangan Transport)" />
                <input type="text" name="communicationAllowance" value={formData.communicationAllowance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Communication Allowance (Tunjangan Komunikasi)" />
                <input type="text" name="motorcycleAllowance" value={formData.motorcycleAllowance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Motorcycle Rent Allowance (Sewa Motor)" />
                <input type="text" name="laptopAllowance" value={formData.laptopAllowance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Laptop Allowance (Tunjangan Laptop)" />
              </div>
            </div>

            {/* Bank Details */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Bank Details</h3>
              <div className="grid grid-cols-1 gap-3">
                <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Bank Name" />
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Account Number" />
                <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" placeholder="Account Holder Name" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Save as Template
              </button>
            </div>
          </div>
        </div>

        {/* PKWT Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">PKWT Preview</h2>

          <div id="pkwt-preview" className="border border-[#e5e7eb] rounded-lg p-8 bg-[#ffffff] min-h-[800px] text-[#000000] font-serif text-sm leading-relaxed">
            {/* Logo */}
            <div className="mb-6">
              <div className="w-32 h-12 flex items-center justify-center">
                <img
                  src="/ansinda-logo.png"
                  alt="Ansinda Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <div className="text-sm space-y-4 text-justify">
              <p>Yang bertanda tangan dibawah ini :</p>

              <div className="grid grid-cols-[20px_100px_10px_1fr]">
                <span>1.</span>
                <span>Nama</span>
                <span>:</span>
                <span className="font-bold">{formData.hrdName}</span>

                <span className="col-start-2">Jabatan</span>
                <span>:</span>
                <span>HRD MANAGER</span>

                <span className="col-start-2">Alamat</span>
                <span>:</span>
                <span>{formData.companyAddress}</span>
              </div>

              <p>
                Dalam hal ini bertindak dalam jabatannya, dari dan dengan demikian untuk dan atas nama {formData.companyName},
                berkedudukan di {formData.companyAddress}, untuk selanjutnya disebut "PIHAK PERTAMA".
              </p>

              <div className="grid grid-cols-[20px_100px_10px_1fr]">
                <span>2.</span>
                <span>Nama</span>
                <span>:</span>
                <span className="font-bold">{formData.employeeName || '{{Full Name}}'}</span>

                <span className="col-start-2">Tempat/Tgl. Lahir</span>
                <span>:</span>
                <span>{formData.birthPlaceDate || '{{Date of Birth}}'}</span>

                <span className="col-start-2">No. KTP</span>
                <span>:</span>
                <span>{formData.employeeId || '{{ID Number}}'}</span>

                <span className="col-start-2">Alamat</span>
                <span>:</span>
                <span>{formData.address || '{{Address}}'}</span>
              </div>

              <p>
                Dalam hal ini bertindak untuk dan atas nama dirinya sendiri, untuk selanjutnya disebut "PIHAK KEDUA".
              </p>

              <p>
                Ke dua belah pihak sepakat dan berjanji untuk saling mengikatkan diri dalam suatu hubungan kerja dengan syarat-syarat sebagai berikut :
              </p>

              {/* Pasal 1 */}
              <div className="text-center font-bold mt-4">
                Pasal 1<br />
                JANGKA WAKTU PERJANJIAN
              </div>
              <p>
                PIHAK PERTAMA menyatakan menerima PIHAK KEDUA sebagai karyawan dengan Perjanjian Kerja Waktu tertentu di {formData.companyName} dan PIHAK KEDUA menyatakan kesediaannya untuk bekerja di {formData.companyName}. Jangka waktu perjanjian kerja ini adalah untuk {formData.duration || '1'} Bulan, dimulai tanggal {formData.startDate || '{{Start Date}}'} sampai dengan tanggal {formData.endDate || '{{End Date}}'}. Kontrak akan di evaluasi setelah {formData.duration || '1'} Bulan.
              </p>

              {/* Pasal 2 */}
              <div className="text-center font-bold mt-4">
                Pasal 2<br />
                TUGAS DAN PENEMPATAN
              </div>
              <p>
                PIHAK KEDUA akan bekerja sebagai {formData.position || '{{Position}}'} dan berkewajiban untuk melaksanakan pekerjaan serta tugas-tugas yang diberikan oleh PIHAK PERTAMA dengan sebaik-baiknya.
                PIHAK PERTAMA berhak untuk mengatur penempatan dan penugasan karyawan di seluruh wilayah Indonesia baik dalam lingkup internal {formData.companyName} maupun unit usaha lain yang masih termasuk dalam kelompok usaha PT. ANSINDA COMMUNICATION INDONESIA, berdasarkan pertimbangan kemampuan kerja PIHAK KEDUA serta kepentingan operasional Perusahaan.
              </p>

              {/* Pasal 3 */}
              <div className="text-center font-bold mt-4">
                Pasal 3<br />
                UPAH POKOK DAN TUNJANGAN-TUNJANGAN
              </div>
              <p>1. Adapun imbalan/gaji yang diterima oleh PIHAK KEDUA ialah :</p>
              <div className="ml-4 grid grid-cols-[180px_10px_1fr]">
                <span>Gaji Pokok</span><span>:</span><span className="font-bold">Rp {formData.baseSalary || '{{Base Salary}}'}</span>
                <span>Tunjangan Jabatan</span><span>:</span><span className="font-bold">Rp {formData.positionAllowance || '{{Position Allowance}}'}</span>
                <span>Tunjangan Makan</span><span>:</span><span className="font-bold">Rp {formData.mealAllowance || '{{Meal Allowance}}'}</span>
                <span>Tunjangan Transport</span><span>:</span><span className="font-bold">Rp {formData.transportAllowance || '{{Transport Allowance}}'}</span>
                <span>Tunjangan Komunikasi</span><span>:</span><span className="font-bold">Rp {formData.communicationAllowance || '{{Communication Allowance}}'}</span>
                <span>Tunjangan Lembur</span><span>:</span><span className="font-bold">Rp {formData.overtimeAllowance || '{{Overtime Allowance}}'}</span>
                <span>Tunjangan Sewa Motor</span><span>:</span><span className="font-bold">Rp {formData.motorcycleAllowance || '{{Motorcycle Rent Allowance}}'}</span>
                <span>Tunjangan Laptop</span><span>:</span><span className="font-bold">Rp {formData.laptopAllowance || '{{Laptop Allowance}}'}</span>
              </div>
              <div className="mt-2">
                <p>2. Pajak Penghasilan (PPH 21) akan dipotong dari gaji karyawan.</p>
                <p>3. BPJS ketenagakerjaan akan dipotong dari gaji karyawan sesuai ketentuan yg berlaku</p>
                <p>4. Pembayaran gaji akan dilakukan sesuai dengan periode pembayaran gaji yang berlaku di Perusahaan.</p>
                <p>5. Tunjangan Hari Raya (THR) akan dibayarkan pada Hari Raya Idul Fitri sesuai dengan ketentuan yang berlaku.</p>
                <p>6. Pembayaran upah/gaji dibayarkan melalui {formData.bankName || '{{Bank Name}}'} Pihak Kedua dengan nomer rekening {formData.accountNumber || '{{Account Number}}'} a.n {formData.accountHolderName || '{{Account Holder}}'}</p>
              </div>

              {/* Pasal 4 */}
              <div className="text-center font-bold mt-4">
                Pasal 4<br />
                WAKTU KERJA
              </div>
              <p>
                Waktu kerja di tentukan sesuai dengan ketentuan perundang-undangan yaitu 40 jam / minggu. PIHAK PERTAMA berhak mengatur dan merubah hari kerja / jam kerja sesuai dengan kebutuhan operasional pekerjaan dengan tetap mengacu kepada ketentuan perundang-undangan yang berlaku.
              </p>

              {/* Pasal 5 */}
              <div className="text-center font-bold mt-4">
                Pasal 5<br />
                CUTI
              </div>
              <p>
                PIHAK KEDUA akan memperoleh hak cuti setelah bekerja selama 12 bulan (1 tahun) yang dapat diambil pada tahun berikutnya. Permohonan cuti harus diajukan 2 minggu sebelumnya dan mendapat persetujuan dari atasan yang bersangkutan.
              </p>

              {/* Pasal 6 */}
              <div className="text-center font-bold mt-4">
                Pasal 6<br />
                KETIDAKHADIRAN
              </div>
              <p>
                Kedua belah pihak sepakat menentukan bahwa yang dimaksud dengan ketidakhadiran kerja adalah apabila karyawan tidak berada di lokasi kerja, dibase camp atau di lokasi tempat penugasan yang ditentukan oleh PIHAK PERTAMA, apabila PIHAK KEDUA tidak berada di lokasi kerja, di base camp atau di lokasi yang ditugaskan bukan karena hal-hal yg diijinkan oleh UU, maka PIHAK KEDUA dianggap tidak hadir dan gajinya akan dipotong sesuai jumlah ketidakhadirannya.
              </p>
              <p className="mt-2">
                Apabila PIHAK KEDUA tidak dapat masuk kerja karena sakit atau karena hal lain , maka harus memberitahu atasannya pada hari yang sama dan apabila ketidakhadiran tersebut lebih dari 1 (satu) hari maka PIHAK KEDUA harus memberikan Surat Keterangan yang sah dan dapat diterima oleh PIHAK PERTAMA pada hari pertama masuk bekerja kembali. Jika PIHAK KEDUA tidak memberikan surat keterangan maka ketidakhadiran tersebut akan dianggap sebagai mangkir dan PIHAK PERTAMA berhak untuk memotong gaji PIHAK KEDUA secara prorata.
              </p>

              {/* Pasal 7 */}
              <div className="text-center font-bold mt-4">
                Pasal 7<br />
                TATA TERTIB
              </div>
              <p>1. PIHAK KEDUA menyetujui untuk mematuhi Peraturan Perusahaan, prosedur kerja dan kebijakan-kebijakan yang dikeluarkan oleh manajemen Perusahaan dari waktu ke waktu. Peraturan Perusahaan, prosedur kerja dan kebijakan-kebijakan tersebut merupakan bagian yang tidak terpisahkan dari perjanjian kerja ini.</p>
              <p className="mt-2">2. PIHAK PERTAMA berhak untuk memberikan tindakan disipliner kepada karyawan yang melanggar Peraturan Perusahaan, Prosedur kerja dan kebijakan-kebijakan Perusahaan.</p>
              <p className="mt-2">3. PIHAK KEDUA berjanji untuk memelihara dan menjaga barang-barang / alat-alat kerja yang dipinjamkan oleh PIHAK PERTAMA dengan baik. Apabila PIHAK KEDUA karena sengaja atau karena kelalaiannya mengakibatkan kerusakan sebagian / keseluruhan sehingga membuat tidak berfungsi sebagaimana mestinya dan atau menghilangkan barang-barang /alat-alat yang dipinjamkan oleh PIHAK PERTAMA kepada PIHAK KEDUA, maka PIHAK KEDUA bersedia untuk memberikan ganti rugi baik dalam bentuk barang maupun uang dengan memotong langsung dari gaji PIHAK KEDUA sebesar nilai barang yang ditetapkan oleh PIHAK PERTAMA.</p>
              <p className="mt-2">4. PIHAK KEDUA berjanji akan mengundurkan diri secara sukarela dan tanpa syarat apapun juga, apabila PIHAK KEDUA melakukan pelanggaran terhadap Peraturan, prosedur, policy dan atau mengingkari terhadap salah satu butir dari perjanjian ini.</p>

              {/* Pasal 8 */}
              <div className="text-center font-bold mt-4">
                Pasal 8<br />
                MENJAGA KERAHASIAAN
              </div>
              <p>
                PIHAK KEDUA berjanji untuk tidak memberikan / menyebarkan / membicarakan informasi yang merupakan rahasia Perusahaan termasuk juga menyebarkan / memberitahukan gaji serta tunjangan-tunjangan yang diterima kepada pihak-pihak lain termasuk teman sekerja kecuali karena diperintahkan oleh Undang-Undang.
              </p>

              {/* Pasal 9 */}
              <div className="text-center font-bold mt-4">
                Pasal 9<br />
                BERAKHIRNYA PERJANJIAN
              </div>
              <p>
                Para Pihak mengerti dan menyadari bahwa perjanjian ini akan berakhir demi hukum sesuai dengan berakhirnya jangka waktu yang ditentukan dalam pasal 1 diatas, baik dengan pemberitahuan maupun tanpa pemberitahuan dari PIHAK PERTAMA. Apabila PIHAK PERTAMA akan memperpanjang perjanjian kerja ini maka PIHAK PERTAMA akan memberitahukan kepada PIHAK KEDUA paling lambat 1 minggu sebelum berakhirnya perjanjian ini.
              </p>
              <p className="mt-2">
                PIHAK PERTAMA dapat mengakhiri perjanjian kerja ini sebelum berakhirnya jangka waktu perjanjian kerja dengan tanpa membayar upah, tunjangan atau ganti rugi apapun apabila berdasarkan hasil evaluasi kinerja bulanan / tiga bulanan / tahunan, PIHAK KEDUA dinyatakan gagal atau tidak memenuhi target yang ditetapkan sesuai dengan standar kriteria penilaian kerja yang diatur dan dibuat oleh PIHAK PERTAMA.
              </p>
              <p className="mt-2">
                Para pihak sepakat bahwa jika PIHAK KEDUA mengajukan pengunduran diri yang disebabkan oleh kondisi genting atau penting sebelum waktu perjanjian kerja ini berakhir maka pengunduran diri PIHAK KEDUA dapat dilakukan yaitu minimal 30 hari setelah disetujui oleh PIHAK PERTAMA, apabila pengunduran diri PIHAK KEDUA kurang dari 30 hari maka PIHAK KEDUA setuju dan sepakat bahwa PIHAK PERTAMA tidak berkewajiban untuk membayar gaji, tunjangan atau ganti rugi apapun kepada PIHAK KEDUA
              </p>

              {/* Pasal 10 */}
              <div className="text-center font-bold mt-4">
                Pasal 10<br />
                PENUTUP
              </div>
              <p>
                Apabila terdapat perselisihan selama hubungan kerja, kedua belah pihak sepakat untuk menyelesaikan nya dengan cara kekeluargaan. Namun apabila tidak dapat diselesaikan maka kedua belah pihak sepakat untuk menyelesaikan masalah ini ke Departemen Tenaga Kerja dan Transmigrasi.
              </p>
              <p className="mt-2">
                Perjanjian ini dibuat dalam rangkap 2 (dua) dan ditandatangani oleh Para Pihak dalam keadaan sadar, sehat jasmani dan rohani serta tidak dibawah paksaan, ancaman maupun tekanan dari siapapun juga, agar selanjutnya dapat dipergunakan sebagai bukti kesepakatan tertulis bagi pihak yang berwenang dan berkepentingan.
              </p>

              <div className="mt-8 text-center">
                Dibuat bersama oleh,
              </div>
              <div className="mt-4 text-center font-bold">
                PARA PIHAK
              </div>

              <div className="mt-8 flex justify-between px-12">
                <div className="text-center">
                  <p>PIHAK PERTAMA,</p>
                  <br /><br /><br /><br />
                  <p className="font-bold underline">DIAH RATNASARI SUHAEMI</p>
                </div>
                <div className="text-center">
                  <p>PIHAK KEDUA,</p>
                  <br /><br /><br /><br />
                  <p className="font-bold underline">{formData.employeeName || '{{Account Holder Name}}'}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={handleSendEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PKWTMakerPage;
