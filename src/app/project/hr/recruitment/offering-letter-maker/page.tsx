import React from 'react';

const OfferingLetterMakerPage: React.FC = () => {
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
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter candidate name"
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
                Salary
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter salary amount"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Benefits
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter additional benefits and perks"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Letter
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
        
        {/* Letter Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Letter Preview</h2>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px]">
            <div className="text-sm text-gray-700 space-y-3">
              <p className="font-semibold">[Company Logo]</p>
              <p className="font-semibold">[Company Name]</p>
              <p className="font-semibold">[Company Address]</p>
              <br />
              <p className="font-semibold">Date: [Current Date]</p>
              <br />
              <p className="font-semibold">Dear [Candidate Name],</p>
              <br />
              <p>We are pleased to offer you the position of <strong>[Position]</strong> in our <strong>[Department]</strong> department.</p>
              <br />
              <p>Your employment will commence on <strong>[Start Date]</strong> with a starting salary of <strong>[Salary]</strong>.</p>
              <br />
              <p>Additional benefits include:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Health insurance</li>
                <li>Annual leave</li>
                <li>Professional development opportunities</li>
              </ul>
              <br />
              <p>Please review the terms and conditions attached to this letter.</p>
              <br />
              <p>We look forward to welcoming you to our team!</p>
              <br />
              <p>Sincerely,</p>
              <p>[HR Manager Name]</p>
              <p>Human Resources Department</p>
            </div>
          </div>
          
          <div className="mt-4 flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Download PDF
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferingLetterMakerPage;
