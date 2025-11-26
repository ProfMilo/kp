'use client';
import React, { useState } from 'react';

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  expectedSalary: string;
  startDate: string;
  education: string;
  experience: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  appliedDate: string;
  resume: string;
  ktp: string;
  photo?: string;
  notes: string;
  interviewer?: string;
  interviewDate?: string;
}

const CandidatePoolPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '08123456789',
      position: 'Software Engineer',
      department: 'IT',
      expectedSalary: 'Rp 8,000,000',
      startDate: '2024-02-01',
      education: 'S1',
      experience: '2',
      status: 'new',
      appliedDate: '2024-01-15',
      resume: '#',
      ktp: '#',
      notes: 'Offline application'
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '08987654321',
      position: 'Project Manager',
      department: 'Operations',
      expectedSalary: 'Rp 12,000,000',
      startDate: '2024-03-01',
      education: 'S2',
      experience: '5',
      status: 'shortlisted',
      appliedDate: '2024-01-14',
      resume: '#',
      ktp: '#',
      notes: 'Referral'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const initialNewCandidate: Omit<Candidate, 'id' | 'appliedDate' | 'status'> = {
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    expectedSalary: '',
    startDate: '',
    education: '',
    experience: '',
    resume: '',
    ktp: '',
    notes: ''
  };

  const [newCandidate, setNewCandidate] = useState(initialNewCandidate);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddCandidate = () => {
    const candidate: Candidate = {
      ...newCandidate,
      id: Math.random().toString(36).substr(2, 9),
      status: 'new',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setCandidates([...candidates, candidate]);
    setShowAddModal(false);
    setNewCandidate(initialNewCandidate);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData = JSON.parse(content);
          if (Array.isArray(importedData)) {
            const newCandidates = importedData.map((c: any) => ({
              ...c,
              id: c.id || Math.random().toString(36).substr(2, 9),
              status: c.status || 'new',
              appliedDate: c.appliedDate || new Date().toISOString().split('T')[0]
            }));
            setCandidates(prev => [...prev, ...newCandidates]);
            alert(`Successfully imported ${newCandidates.length} candidates.`);
          } else {
            alert('Invalid file format. Expected a JSON array.');
          }
        } catch (error) {
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    if (event.target) event.target.value = '';
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      setCandidates(candidates.filter(c => c.id !== id));
    }
  };

  const updateCandidateStatus = (id: string, newStatus: Candidate['status']) => {
    setCandidates(prev => prev.map(candidate =>
      candidate.id === id ? { ...candidate, status: newStatus } : candidate
    ));
  };

  const getStatusColor = (status: Candidate['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      reviewing: 'bg-yellow-100 text-yellow-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      interviewed: 'bg-indigo-100 text-indigo-800',
      offered: 'bg-green-100 text-green-800',
      hired: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: Candidate['status']) => {
    const labels = {
      new: 'New',
      reviewing: 'Under Review',
      shortlisted: 'Shortlisted',
      interviewed: 'Interviewed',
      offered: 'Offer Sent',
      hired: 'Hired',
      rejected: 'Rejected'
    };
    return labels[status];
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'IT': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-green-100 text-green-800',
      'Operations': 'bg-purple-100 text-purple-800',
      'HR': 'bg-pink-100 text-pink-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Sales': 'bg-orange-100 text-orange-800',
      'Engineering': 'bg-indigo-100 text-indigo-800'
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Pool</h1>
          <p className="text-gray-600">Manage and view all recruitment candidates (Offline/External)</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Candidate List</h2>
            <div className="flex gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Candidate
              </button>
              <button
                onClick={handleImportClick}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Import Candidates
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {candidate.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.fullName}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                          <div className="text-sm text-gray-500">{candidate.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.position}</div>
                      <div className="text-sm text-gray-500">{candidate.expectedSalary}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(candidate.department)}`}>
                        {candidate.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                        {getStatusLabel(candidate.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowViewModal(true);
                          }}
                          className="px-3 py-1 border border-gray-400 bg-gray-50 rounded text-sm font-medium text-gray-900 hover:bg-gray-100"
                        >
                          View
                        </button>
                        <select
                          value={candidate.status}
                          onChange={(e) => updateCandidateStatus(candidate.id, e.target.value as Candidate['status'])}
                          className="text-sm border border-gray-400 bg-gray-50 rounded px-2 py-1 text-gray-900"
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="offered">Offer Sent</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => handleDelete(candidate.id)}
                          className="text-red-600 hover:text-red-900 px-2"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Candidate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newCandidate.fullName}
                onChange={e => setNewCandidate({ ...newCandidate, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCandidate.email}
                onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newCandidate.phone}
                onChange={e => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Position"
                value={newCandidate.position}
                onChange={e => setNewCandidate({ ...newCandidate, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <select
                value={newCandidate.department}
                onChange={e => setNewCandidate({ ...newCandidate, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900"
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
              </select>
              <input
                type="text"
                placeholder="Expected Salary"
                value={newCandidate.expectedSalary}
                onChange={e => setNewCandidate({ ...newCandidate, expectedSalary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newCandidate.startDate}
                onChange={e => setNewCandidate({ ...newCandidate, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900"
              />
              <input
                type="text"
                placeholder="Education"
                value={newCandidate.education}
                onChange={e => setNewCandidate({ ...newCandidate, education: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Experience (years)"
                value={newCandidate.experience}
                onChange={e => setNewCandidate({ ...newCandidate, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <textarea
                placeholder="Notes"
                value={newCandidate.notes}
                onChange={e => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500 md:col-span-2"
                rows={3}
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCandidate}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Candidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Candidate Modal */}
      {showViewModal && selectedCandidate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Candidate Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-900">Name:</span> <span className="text-gray-700">{selectedCandidate.fullName}</span></p>
                  <p><span className="font-medium text-gray-900">Email:</span> <span className="text-gray-700">{selectedCandidate.email}</span></p>
                  <p><span className="font-medium text-gray-900">Phone:</span> <span className="text-gray-700">{selectedCandidate.phone}</span></p>
                  <p><span className="font-medium text-gray-900">Education:</span> <span className="text-gray-700">{selectedCandidate.education}</span></p>
                  <p><span className="font-medium text-gray-900">Experience:</span> <span className="text-gray-700">{selectedCandidate.experience} years</span></p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-900">Position:</span> <span className="text-gray-700">{selectedCandidate.position}</span></p>
                  <p><span className="font-medium text-gray-900">Department:</span> <span className="text-gray-700">{selectedCandidate.department}</span></p>
                  <p><span className="font-medium text-gray-900">Expected Salary:</span> <span className="text-gray-700">{selectedCandidate.expectedSalary}</span></p>
                  <p><span className="font-medium text-gray-900">Start Date:</span> <span className="text-gray-700">{selectedCandidate.startDate}</span></p>
                  <p><span className="font-medium text-gray-900">Applied:</span> <span className="text-gray-700">{new Date(selectedCandidate.appliedDate).toLocaleDateString()}</span></p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700 text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                {selectedCandidate.notes || 'No notes available.'}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatePoolPage;
