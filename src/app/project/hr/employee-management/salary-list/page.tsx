'use client';
import React, { useState, useRef } from 'react';

interface SalaryRecord {
  id: number;
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  level: string;
  baseSalary: number;
  allowances: number;
  lastUpdated: string;
  initials: string;
  color: string;
}

const SalaryListPage: React.FC = () => {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      level: 'Senior',
      baseSalary: 15000000,
      allowances: 3500000,
      lastUpdated: '2024-01-15',
      initials: 'JD',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      position: 'Project Manager',
      department: 'Engineering',
      level: 'Manager',
      baseSalary: 20000000,
      allowances: 5000000,
      lastUpdated: '2024-01-10',
      initials: 'JS',
      color: 'bg-green-500'
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      position: 'Marketing Specialist',
      department: 'Marketing',
      level: 'Junior',
      baseSalary: 12000000,
      allowances: 2500000,
      lastUpdated: '2024-01-05',
      initials: 'MJ',
      color: 'bg-yellow-500'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const initialNewSalary = {
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    level: '',
    baseSalary: '',
    allowances: '',
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  const [newSalary, setNewSalary] = useState(initialNewSalary);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter Logic
  const filteredSalaries = salaries.filter(salary => {
    const matchesSearch =
      salary.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salary.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salary.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = selectedDepartment ? salary.department === selectedDepartment : true;
    const matchesLevel = selectedLevel ? salary.level === selectedLevel : true;

    return matchesSearch && matchesDepartment && matchesLevel;
  });

  const handleAddSalary = () => {
    const salaryRecord: SalaryRecord = {
      id: salaries.length + 1,
      employeeName: newSalary.employeeName,
      employeeId: newSalary.employeeId,
      position: newSalary.position,
      department: newSalary.department,
      level: newSalary.level,
      baseSalary: Number(newSalary.baseSalary.replace(/[^0-9]/g, '')),
      allowances: Number(newSalary.allowances.replace(/[^0-9]/g, '')),
      lastUpdated: newSalary.lastUpdated,
      initials: newSalary.employeeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      color: 'bg-blue-500' // Default color
    };

    setSalaries([...salaries, salaryRecord]);
    setShowAddModal(false);
    setNewSalary(initialNewSalary);
    setImportMessage('New salary record added successfully!');
  };

  const handleView = (salary: any) => {
    setSelectedSalary(salary);
    setShowViewModal(true);
  };

  const handleEdit = (salary: any) => {
    setSelectedSalary({ ...salary });
    setShowEditModal(true);
  };

  const handleUpdateSalary = () => {
    const updatedSalaries = salaries.map(s =>
      s.id === selectedSalary.id ? {
        ...selectedSalary,
        baseSalary: Number(String(selectedSalary.baseSalary).replace(/[^0-9]/g, '')),
        allowances: Number(String(selectedSalary.allowances).replace(/[^0-9]/g, ''))
      } : s
    );
    setSalaries(updatedSalaries);
    setShowEditModal(false);
    setImportMessage('Salary record updated successfully!');
  };

  const handleDeleteSalary = (id: number) => {
    if (confirm('Are you sure you want to delete this salary record?')) {
      const newSalaries = salaries.filter(s => s.id !== id);
      setSalaries(newSalaries);
      setImportMessage('Salary record deleted successfully!');
    }
  };

  const handleBulkUpdateClick = () => {
    fileInputRef.current?.click();
  };

  const handleBulkUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');

        if (rows.length < 2) {
          setImportMessage('CSV file must have at least headers and one data row');
          return;
        }

        const headers = rows[0].split(',').map(h => h.trim());
        const requiredHeaders = ['employeeName', 'employeeId', 'position', 'baseSalary', 'allowances', 'lastUpdated'];

        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setImportMessage(`Missing required headers: ${missingHeaders.join(', ')}`);
          return;
        }

        const newRecords = rows.slice(1).map((row, index) => {
          const values = row.split(',').map(v => v.trim());
          const record: any = {};

          headers.forEach((header, i) => {
            record[header] = values[i];
          });

          return {
            id: salaries.length + index + 1,
            employeeName: record.employeeName,
            employeeId: record.employeeId,
            position: record.position,
            department: record.department || 'Unassigned',
            level: record.level || 'Unassigned',
            baseSalary: Number(record.baseSalary),
            allowances: Number(record.allowances),
            lastUpdated: record.lastUpdated || new Date().toISOString().split('T')[0],
            initials: record.employeeName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
            color: 'bg-gray-500'
          } as SalaryRecord;
        });

        setSalaries([...salaries, ...newRecords]);
        setImportMessage(`Successfully imported ${newRecords.length} salary records!`);
        event.target.value = ''; // Reset input
      } catch (error) {
        setImportMessage('Error parsing CSV file.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const headers = ['employeeName', 'employeeId', 'position', 'department', 'level', 'baseSalary', 'allowances', 'totalSalary', 'lastUpdated'];
    const csvContent = [
      headers.join(','),
      ...salaries.map(s => [
        `"${s.employeeName}"`,
        s.employeeId,
        `"${s.position}"`,
        `"${s.department}"`,
        `"${s.level}"`,
        s.baseSalary,
        s.allowances,
        s.baseSalary + s.allowances,
        s.lastUpdated
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'payroll_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPayroll = salaries.reduce((acc, curr) => acc + curr.baseSalary + curr.allowances, 0);
  const averageSalary = totalPayroll / (salaries.length || 1);

  // Get unique departments and levels for filter options
  const departments = Array.from(new Set(salaries.map(s => s.department))).filter(Boolean).sort();
  const levels = Array.from(new Set(salaries.map(s => s.level))).filter(Boolean).sort();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Salary List</h1>
        <p className="text-gray-600 mt-2">Manage and view employee salary information</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Salary Management</h2>

          {importMessage && (
            <div className={`mb-4 p-3 rounded-lg ${importMessage.includes('Successfully') || importMessage.includes('added') || importMessage.includes('updated') || importMessage.includes('deleted')
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
              {importMessage}
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Salary Record
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleBulkUpdate}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={handleBulkUpdateClick}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Bulk Update
            </button>

            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export Payroll
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search employees (Name, ID, Position)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-400 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-400 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Levels</option>
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Base Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Allowances
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Total Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSalaries.length > 0 ? (
                filteredSalaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${salary.color} flex items-center justify-center text-white font-semibold mr-3`}>
                          {salary.initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{salary.employeeName}</div>
                          <div className="text-sm text-gray-500">{salary.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {salary.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(salary.baseSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(salary.allowances)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(salary.baseSalary + salary.allowances)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {salary.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(salary)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(salary)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSalary(salary.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No salary records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">Total Employees</h3>
            <p className="text-2xl font-bold text-blue-900">{salaries.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800">Total Payroll</h3>
            <p className="text-2xl font-bold text-green-900">
              {new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(totalPayroll)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-800">Average Salary</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(averageSalary)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-sm font-medium text-purple-800">Last Updated</h3>
            <p className="text-2xl font-bold text-purple-900">Today</p>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1 to {filteredSalaries.length} of {filteredSalaries.length} results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Salary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Salary Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={newSalary.employeeName}
                  onChange={e => setNewSalary({ ...newSalary, employeeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={newSalary.employeeId}
                  onChange={e => setNewSalary({ ...newSalary, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={newSalary.position}
                  onChange={e => setNewSalary({ ...newSalary, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={newSalary.department}
                  onChange={e => setNewSalary({ ...newSalary, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                <input
                  type="text"
                  value={newSalary.level}
                  onChange={e => setNewSalary({ ...newSalary, level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Base Salary</label>
                <input
                  type="number"
                  value={newSalary.baseSalary}
                  onChange={e => setNewSalary({ ...newSalary, baseSalary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Allowances</label>
                <input
                  type="number"
                  value={newSalary.allowances}
                  onChange={e => setNewSalary({ ...newSalary, allowances: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Updated</label>
                <input
                  type="date"
                  value={newSalary.lastUpdated}
                  onChange={e => setNewSalary({ ...newSalary, lastUpdated: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSalary}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Salary Modal */}
      {showViewModal && selectedSalary && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">View Salary Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Employee Name</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                  {selectedSalary.employeeName}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                  {selectedSalary.employeeId}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                  {selectedSalary.position}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                  {selectedSalary.department}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                  {selectedSalary.level}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Base Salary</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                  {formatCurrency(selectedSalary.baseSalary)}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Allowances</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                  {formatCurrency(selectedSalary.allowances)}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Total Salary</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm font-semibold">
                  {formatCurrency(selectedSalary.baseSalary + selectedSalary.allowances)}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Updated</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                  {selectedSalary.lastUpdated}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Salary Modal */}
      {showEditModal && selectedSalary && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Salary Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={selectedSalary.employeeName}
                  onChange={e => setSelectedSalary({ ...selectedSalary, employeeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={selectedSalary.employeeId}
                  onChange={e => setSelectedSalary({ ...selectedSalary, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={selectedSalary.position}
                  onChange={e => setSelectedSalary({ ...selectedSalary, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={selectedSalary.department}
                  onChange={e => setSelectedSalary({ ...selectedSalary, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                <input
                  type="text"
                  value={selectedSalary.level}
                  onChange={e => setSelectedSalary({ ...selectedSalary, level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Base Salary</label>
                <input
                  type="number"
                  value={selectedSalary.baseSalary}
                  onChange={e => setSelectedSalary({ ...selectedSalary, baseSalary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Allowances</label>
                <input
                  type="number"
                  value={selectedSalary.allowances}
                  onChange={e => setSelectedSalary({ ...selectedSalary, allowances: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Updated</label>
                <input
                  type="date"
                  value={selectedSalary.lastUpdated}
                  onChange={e => setSelectedSalary({ ...selectedSalary, lastUpdated: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSalary}
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryListPage;
