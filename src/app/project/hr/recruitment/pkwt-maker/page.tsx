import React from 'react';

const PKWTMakerPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">PKWT Maker</h1>
        <p className="text-gray-600 mt-2">Create and manage Perjanjian Kerja Waktu Tertentu (Fixed-term Work Agreements)</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PKWT Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New PKWT</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter employee name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter employee ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter position title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select department</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Duration (months)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter duration in months"
                min="1"
                max="24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Salary
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter base salary amount"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project/Assignment Details
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project or assignment details"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate PKWT
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Save as Template
              </button>
            </div>
          </form>
        </div>
        
        {/* PKWT Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">PKWT Preview</h2>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px]">
            <div className="text-sm text-gray-700 space-y-3">
              <p className="font-semibold text-center text-lg">PERJANJIAN KERJA WAKTU TERTENTU</p>
              <p className="font-semibold text-center">(PKWT)</p>
              <br />
              <p>Yang bertanda tangan di bawah ini:</p>
              <br />
              <p className="font-semibold">1. Nama: [Company Representative Name]</p>
              <p>Jabatan: [Company Representative Position]</p>
              <p>Alamat: [Company Address]</p>
              <p>Selanjutnya disebut sebagai "Pihak Pertama"</p>
              <br />
              <p className="font-semibold">2. Nama: [Employee Name]</p>
              <p>NIK: [Employee ID]</p>
              <p>Jabatan: [Position]</p>
              <p>Alamat: [Employee Address]</p>
              <p>Selanjutnya disebut sebagai "Pihak Kedua"</p>
              <br />
              <p>Kedua belah pihak telah sepakat untuk mengadakan Perjanjian Kerja Waktu Tertentu dengan ketentuan sebagai berikut:</p>
              <br />
              <p className="font-semibold">Pasal 1</p>
              <p>JANGKA WAKTU</p>
              <p>Perjanjian kerja ini berlaku mulai tanggal [Start Date] sampai dengan [End Date] atau selama [Duration] bulan.</p>
              <br />
              <p className="font-semibold">Pasal 2</p>
              <p>GAJI DAN TUNJANGAN</p>
              <p>Gaji pokok sebesar [Base Salary] per bulan.</p>
              <br />
              <p className="font-semibold">Pasal 3</p>
              <p>PROYEK/PENUGASAN</p>
              <p>[Project/Assignment Details]</p>
            </div>
          </div>
          
          <div className="mt-4 flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Download PDF
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Send for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PKWTMakerPage;
