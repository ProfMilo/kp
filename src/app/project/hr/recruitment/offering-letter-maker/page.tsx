"use client";

import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OfferingLetterMakerPage: React.FC = () => {
  const initialFormData = {
    candidateName: '',
    position: '',
    department: '',
    startDate: '',
    basicSalary: '',
    overtimeAllowance: '',
    mealAllowance: '',
    transportationAllowance: '',
    communicationAllowance: '',
    laptopAllowance: '',
    grossSalary: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const formatNumber = (value: string) => {
    // Remove non-digit characters
    const number = value.replace(/\D/g, '');
    // Format with dots
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // List of fields that contribute to gross salary
    const salaryComponents = [
      'basicSalary',
      'overtimeAllowance',
      'mealAllowance',
      'transportationAllowance',
      'communicationAllowance',
      'laptopAllowance'
    ];

    // List of all money fields including gross salary for formatting
    const moneyFields = [...salaryComponents, 'grossSalary'];

    let newValue = value;
    if (moneyFields.includes(name)) {
      newValue = formatNumber(value);
    }

    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: newValue
      };

      // Calculate gross salary if a component changed
      if (salaryComponents.includes(name)) {
        const total = salaryComponents.reduce((sum, component) => {
          const val = component === name ? newValue : prev[component as keyof typeof prev];
          // Remove dots and convert to number
          const num = parseInt(val.replace(/\./g, '') || '0', 10);
          return sum + num;
        }, 0);

        updatedData.grossSalary = formatNumber(total.toString());
      }

      return updatedData;
    });
  };

  const handleClear = () => {
    setFormData(initialFormData);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('letter-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`offering-letter-${formData.candidateName || 'candidate'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSendEmail = () => {
    const subject = `Offering Letter - ${formData.candidateName || 'Candidate'}`;

    const body = `
Dear ${formData.candidateName || 'Candidate'},

We are delighted to inform you that you have successfully passed all our recruitment process. Congratulations and welcome to PT. Ansinda Telecommunications Indonesia and become part of our company on ${formData.startDate || '[Start Date]'}.

Please find below terms and conditions of your employment.

1. Positions
Through thorough screening and assessment, our company would like to offer the position of ${formData.position || '[Position]'} to you. This position and your regular weekly schedule will be from Monday to Friday, start from 09:00 AM until 18:00 PM.

2. Benefit and salary package which we offer
   a. Basic salary: ${formData.basicSalary || '[Basic Salary]'}
   b. Overtime allowance: ${formData.overtimeAllowance || '[Overtime Allowance]'}
   c. Meal allowance: ${formData.mealAllowance || '[Meal Allowance]'}
   d. Transportation allowance: ${formData.transportationAllowance || '[Transportation Allowance]'}
   e. Communication Allowance: ${formData.communicationAllowance || '[Communication Allowance]'}
   f. Laptop Allowance: ${formData.laptopAllowance || '[Laptop Allowance]'}
   
   Gross Salary: ${formData.grossSalary || '[Gross Salary]'} (*before BPJS and Tax)

3. Documents needed
   a. Copy of ID Card
   b. Copy of NPWP
   c. Copy of BPJS Card
   d. Copy of Kartu Keluarga
   e. Copy of Akte Lahir
   f. Copy of Akte Pernikahan
   g. Two (2x3cm) Photos
   h. Copy of Academic Certificate / Degree Certificate
   i. Copy of Reference Letter from previous company
   j. Original SKCK from Police Office

After receiving this offer letter, please confirm the acceptance and inform us the commencement date within 2 working days. Please bring the specified documents as mentioned above to our company. We look forward to the opportunity to work with you in an atmosphere that is successful and mutually challenging and rewarding.

Best Regards,

Diah Ratnasari
HR Manager
    `.trim();

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Offering Letter Maker</h1>
        <p className="text-gray-600 mt-2">Create and manage job offering letters for candidates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Letter Template Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Offering Letter</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Name
              </label>
              <input
                type="text"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                placeholder="Enter candidate name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                placeholder="Enter position title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Salary & Allowances</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary</label>
                  <input
                    type="text"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g. Rp 5.000.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Allowance</label>
                  <input
                    type="text"
                    name="overtimeAllowance"
                    value={formData.overtimeAllowance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g. Rp 1.000.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Allowance</label>
                  <input
                    type="text"
                    name="mealAllowance"
                    value={formData.mealAllowance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g. Rp 500.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transportation Allowance</label>
                  <input
                    type="text"
                    name="transportationAllowance"
                    value={formData.transportationAllowance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g. Rp 500.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Communication Allowance</label>
                  <input
                    type="text"
                    name="communicationAllowance"
                    value={formData.communicationAllowance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g. Rp 200.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Laptop Allowance</label>
                  <input
                    type="text"
                    name="laptopAllowance"
                    value={formData.laptopAllowance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g. Rp 300.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gross Salary</label>
                  <input
                    type="text"
                    name="grossSalary"
                    value={formData.grossSalary}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600 bg-gray-100 cursor-not-allowed"
                    placeholder="Auto-calculated"
                  />
                </div>
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

        {/* Letter Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Letter Preview</h2>

          <div id="letter-preview" className="border border-[#e5e7eb] rounded-lg p-8 bg-[#ffffff] min-h-[800px] text-[#000000] font-serif text-sm leading-relaxed">
            {/* Logo Placeholder */}
            <div className="mb-6">
              <div className="w-32 h-12 flex items-center justify-center">
                <img
                  src="/ansinda-logo.png"
                  alt="Ansinda Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <div className="text-center font-bold underline mb-6">
              Offering Letter
            </div>

            <div className="mb-4">
              Dear {formData.candidateName || '{{Full Name}}'},
            </div>

            <div className="mb-4 text-justify">
              We are delighted to inform you that you have successfully passed all our recruitment process. Congratulations and welcome to PT. Ansinda Telecommunications Indonesia and become part of our company on {formData.startDate || '{{Start Date}}'}.
            </div>

            <div className="mb-4">
              Please find below terms and conditions of your employment.
            </div>

            <div className="ml-4 mb-4">
              <div className="flex mb-2">
                <span className="mr-2">1.</span>
                <div>
                  <span className="font-bold">Positions</span>
                  <p className="text-justify mt-1">
                    Through thorough screening and assessment, our company would like to offer the position of {formData.position || '{{Position}}'} to you. This position and your regular weekly schedule will be from Monday to Friday, start from 09:00 AM until 18:00 PM.
                  </p>
                </div>
              </div>

              <div className="flex mb-2">
                <span className="mr-2">2.</span>
                <div className="w-full">
                  <span className="font-bold">Benefit and salary package which we offer</span>
                  <div className="ml-4 mt-1 grid grid-cols-[20px_auto_1fr] gap-x-2">
                    <span>a.</span>
                    <span>Basic salary</span>
                    <span>: {formData.basicSalary || '{{Basic Salary}}'}</span>

                    <span>b.</span>
                    <span>Overtime allowance</span>
                    <span>: {formData.overtimeAllowance || '{{Overtime Allowance}}'}</span>

                    <span>c.</span>
                    <span>Meal allowance</span>
                    <span>: {formData.mealAllowance || '{{Meal Allowance}}'}</span>

                    <span>d.</span>
                    <span>Transportation allowance</span>
                    <span>: {formData.transportationAllowance || '{{Transportation Allowance}}'}</span>

                    <span>e.</span>
                    <span>Communication Allowance</span>
                    <span>: {formData.communicationAllowance || '{{Communication Allowance}}'}</span>

                    <span>f.</span>
                    <span>Laptop Allowance</span>
                    <span>: {formData.laptopAllowance || '{{Laptop Allowance}}'}</span>

                    <span className="col-start-2 font-bold">Gross Salary</span>
                    <span className="font-bold">: {formData.grossSalary || '{{Gross Salary}}'}</span>
                    <span className="col-start-2 text-xs italic">*before BPJS and Tax</span>
                  </div>
                </div>
              </div>

              <div className="flex mb-2">
                <span className="mr-2">3.</span>
                <div>
                  <span className="font-bold">Documents needed</span>
                  <div className="ml-4 mt-1 grid grid-cols-[20px_1fr] gap-x-2">
                    <span>a.</span><span>Copy of ID Card</span>
                    <span>b.</span><span>Copy of NPWP</span>
                    <span>c.</span><span>Copy of BPJS Card</span>
                    <span>d.</span><span>Copy of Kartu Keluarga</span>
                    <span>e.</span><span>Copy of Akte Lahir</span>
                    <span>f.</span><span>Copy of Akte Pernikahan</span>
                    <span>g.</span><span>Two (2x3cm) Photos</span>
                    <span>h.</span><span>Copy of Academic Certificate / Degree Certificate</span>
                    <span>i.</span><span>Copy of Reference Letter from previous company</span>
                    <span>j.</span><span>Original SKCK from Police Office</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 text-justify">
              After receiving this offer letter, please confirm the acceptance and inform us the commencement date within 2 working days. Please bring the specified documents as mentioned above to our company. We look forward to the opportunity to work with you in an atmosphere that is successful and mutually challenging and rewarding.
            </div>

            <div className="mb-12">
              Best Regards,
            </div>

            <div className="mb-12">
              <div className="font-bold underline">Diah Ratnasari</div>
              <div>HR Manager</div>
            </div>

            <div className="border-t border-[#000000] pt-4">
              I accept the offer as stated above
            </div>

            <div className="mt-12 grid grid-cols-[60px_1fr] gap-y-2">
              <span>Name</span>
              <span>: </span>
              <span>Date</span>
              <span>: </span>
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

export default OfferingLetterMakerPage;
