'use client';
import React, { useState } from 'react';

const EmployeeListPage: React.FC = () => {
  // Sample data structure
  const [employees, setEmployees] = useState([
    {
      id: 1,
      PERUSAHAAN: 'PT Ansinda',
      'EMPLOYEE ID': 'EMP-001',
      NAMA: 'John Doe',
      'TANGGAL MASUK': '2023-01-15',
      POSISI: 'Software Engineer',
      'NO TELP': '08123456789',
      'NO KTP': '1234567890123456',
      EMAIL: 'john.doe@ansinda.com',
      DEPARTEMEN: 'IT',
      PROJECT: 'Project A',
      WILAYAH: 'Jakarta',
      'TEMPAT LAHIR': 'Jakarta',
      'TANGGAL LAHIR': '1990-05-15',
      'NAMA IBU KANDUNG': 'Siti Aminah',
      NPWP: '12.345.678.9-123.000',
      ALAMAT: 'Jl. Sudirman No. 123',
      BANK: 'BCA',
      'NO REK': '1234567890',
      'KONTRAK PERTAMA': 'PKWT',
      'START CONTRACT': '2023-01-15',
      'END CONTRACT': '2025-01-15',
      'MARITAL STATUS': 'Menikah',
      'JENIS KELAMIN': 'L',
      'PENDIDIKAN TERAKHIR': 'S1',
      AGAMA: 'Islam'
    },
    {
      id: 2,
      PERUSAHAAN: 'PT Ansinda',
      'EMPLOYEE ID': 'EMP-002',
      NAMA: 'Jane Smith',
      'TANGGAL MASUK': '2023-03-20',
      POSISI: 'Project Manager',
      'NO TELP': '08987654321',
      'NO KTP': '2345678901234567',
      EMAIL: 'jane.smith@ansinda.com',
      DEPARTEMEN: 'Operations',
      PROJECT: 'Project B',
      WILAYAH: 'Bandung',
      'TEMPAT LAHIR': 'Bandung',
      'TANGGAL LAHIR': '1988-08-20',
      'NAMA IBU KANDUNG': 'Mariam Sari',
      NPWP: '23.456.789.0-234.000',
      ALAMAT: 'Jl. Asia Afrika No. 456',
      BANK: 'Mandiri',
      'NO REK': '0987654321',
      'KONTRAK PERTAMA': 'PKWT',
      'START CONTRACT': '2023-03-20',
      'END CONTRACT': '2025-03-20',
      'MARITAL STATUS': 'Menikah',
      'JENIS KELAMIN': 'P',
      'PENDIDIKAN TERAKHIR': 'S1',
      AGAMA: 'Kristen'
    },
    {
      id: 3,
      PERUSAHAAN: 'PT Ansinda',
      'EMPLOYEE ID': 'EMP-003',
      NAMA: 'Mike Johnson',
      'TANGGAL MASUK': '2024-01-10',
      POSISI: 'Marketing Specialist',
      'NO TELP': '08765432109',
      'NO KTP': '3456789012345678',
      EMAIL: 'mike.johnson@ansinda.com',
      DEPARTEMEN: 'Marketing',
      PROJECT: 'Project C',
      WILAYAH: 'Surabaya',
      'TEMPAT LAHIR': 'Surabaya',
      'TANGGAL LAHIR': '1992-12-10',
      'NAMA IBU KANDUNG': 'Siti Fatimah',
      NPWP: '34.567.890.1-345.000',
      ALAMAT: 'Jl. Tunjungan No. 789',
      BANK: 'BNI',
      'NO REK': '1122334455',
      'KONTRAK PERTAMA': 'PKWT',
      'START CONTRACT': '2024-01-10',
      'END CONTRACT': '2026-01-10',
      'MARITAL STATUS': 'Belum Menikah',
      'JENIS KELAMIN': 'L',
      'PENDIDIKAN TERAKHIR': 'D3',
      AGAMA: 'Islam'
    }
  ]);

  const [importMessage, setImportMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  const initialNewEmployee = {
    PERUSAHAAN: '',
    'EMPLOYEE ID': '',
    NAMA: '',
    'TANGGAL MASUK': '',
    POSISI: '',
    'NO TELP': '',
    'NO KTP': '',
    EMAIL: '',
    DEPARTEMEN: '',
    PROJECT: '',
    WILAYAH: '',
    'TEMPAT LAHIR': '',
    'TANGGAL LAHIR': '',
    'NAMA IBU KANDUNG': '',
    NPWP: '',
    ALAMAT: '',
    BANK: '',
    'NO REK': '',
    'KONTRAK PERTAMA': '',
    'START CONTRACT': '',
    'END CONTRACT': '',
    'MARITAL STATUS': '',
    'JENIS KELAMIN': '',
    'PENDIDIKAN TERAKHIR': '',
    AGAMA: ''
  };

  const [newEmployee, setNewEmployee] = useState(initialNewEmployee);

  const rowsPerPage = 25;

  // Filter Logic
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      employee.NAMA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee['EMPLOYEE ID'].toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.EMAIL.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = selectedDepartment ? employee.DEPARTEMEN === selectedDepartment : true;
    const matchesProject = selectedProject ? employee.PROJECT === selectedProject : true;

    return matchesSearch && matchesDepartment && matchesProject;
  });

  // Calculate pagination based on filtered results
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Handle CSV import
  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        // Validate headers match expected structure
        const expectedHeaders = [
          'PERUSAHAAN', 'EMPLOYEE ID', 'NAMA', 'TANGGAL MASUK', 'POSISI', 'NO TELP', 'NO KTP', 'EMAIL',
          'DEPARTEMEN', 'PROJECT', 'WILAYAH', 'TEMPAT LAHIR', 'TANGGAL LAHIR', 'NAMA IBU KANDUNG',
          'NPWP', 'ALAMAT', 'BANK', 'NO REK', 'KONTRAK PERTAMA', 'START CONTRACT', 'END CONTRACT',
          'MARITAL STATUS', 'JENIS KELAMIN', 'PENDIDIKAN TERAKHIR', 'AGAMA'
        ];

        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setImportMessage(`Missing required headers: ${missingHeaders.join(', ')}`);
          return;
        }

        // Parse data rows
        const newEmployees = rows.slice(1).map((row, index) => {
          const values = row.split(',').map(v => v.trim());
          const employee: any = { id: employees.length + index + 1 };

          headers.forEach((header, headerIndex) => {
            employee[header] = values[headerIndex] || '';
          });

          return employee;
        });

        // Replace existing data with imported data
        setEmployees(newEmployees);
        setCurrentPage(1); // Reset to first page after import
        setImportMessage(`Successfully imported ${newEmployees.length} employees!`);

        // Clear the file input
        event.target.value = '';

      } catch (error) {
        setImportMessage('Error parsing CSV file. Please check the format.');
        console.error('CSV parsing error:', error);
      }
    };

    reader.onerror = () => {
      setImportMessage('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  };

  const handleExport = () => {
    // Define headers
    const headers = [
      'PERUSAHAAN', 'EMPLOYEE ID', 'NAMA', 'TANGGAL MASUK', 'POSISI', 'NO TELP', 'NO KTP', 'EMAIL',
      'DEPARTEMEN', 'PROJECT', 'WILAYAH', 'TEMPAT LAHIR', 'TANGGAL LAHIR', 'NAMA IBU KANDUNG',
      'NPWP', 'ALAMAT', 'BANK', 'NO REK', 'KONTRAK PERTAMA', 'START CONTRACT', 'END CONTRACT',
      'MARITAL STATUS', 'JENIS KELAMIN', 'PENDIDIKAN TERAKHIR', 'AGAMA'
    ];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...employees.map(emp => headers.map(header =>
        // Handle values that might contain commas
        `"${(emp as any)[header] || ''}"`
      ).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employees_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddEmployee = () => {
    const employee = {
      ...newEmployee,
      id: employees.length + 1
    };
    setEmployees([...employees, employee]);
    setShowAddModal(false);
    setNewEmployee(initialNewEmployee);
    setImportMessage('New employee added successfully!');
  };

  const handleView = (employee: any) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEdit = (employee: any) => {
    setSelectedEmployee({ ...employee });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = () => {
    const updatedEmployees = employees.map(emp =>
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    );
    setEmployees(updatedEmployees);
    setShowEditModal(false);
    setImportMessage('Employee updated successfully!');
  };

  // Handle employee deletion
  const handleDeleteEmployee = (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      const newEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(newEmployees);

      // Adjust current page if needed
      const newTotalPages = Math.ceil(newEmployees.length / rowsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      setImportMessage('Employee deleted successfully!');
    }
  };

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Get unique departments and projects for filter options
  const departments = Array.from(new Set(employees.map(e => e.DEPARTEMEN))).filter(Boolean).sort();
  const projects = Array.from(new Set(employees.map(e => e.PROJECT))).filter(Boolean).sort();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Employee List</h1>
        <p className="text-gray-600 mt-2">Manage and view all company employees with comprehensive information</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Directory</h2>

          {/* Import Message */}
          {importMessage && (
            <div className={`mb-4 p-3 rounded-lg ${importMessage.includes('Successfully') || importMessage.includes('deleted') || importMessage.includes('added') || importMessage.includes('updated')
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
              Add New Employee
            </button>

            {/* CSV Import */}
            <label className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export Data
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search employees (Name, ID, Email)..."
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
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 border border-gray-400 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Projects</option>
              {projects.map(proj => (
                <option key={proj} value={proj}>{proj}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(employees[0]).filter(key => key !== 'id').map((key) => (
                  <th key={key} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b whitespace-nowrap">
                    {key}
                  </th>
                ))}
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b whitespace-nowrap">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.PERUSAHAAN}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee['EMPLOYEE ID']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{employee.NAMA}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['TANGGAL MASUK']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.POSISI}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['NO TELP']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['NO KTP']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.EMAIL}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee.DEPARTEMEN}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee.PROJECT}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee.WILAYAH}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['TEMPAT LAHIR']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['TANGGAL LAHIR']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['NAMA IBU KANDUNG']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee.NPWP}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee.ALAMAT}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee.BANK}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['NO REK']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['KONTRAK PERTAMA']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['START CONTRACT']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['END CONTRACT']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['MARITAL STATUS']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['JENIS KELAMIN']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee['PENDIDIKAN TERAKHIR']}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">{employee.AGAMA}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs font-medium">
                      <button
                        onClick={() => handleView(employee)}
                        className="text-blue-600 hover:text-blue-900 mr-1"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-green-600 hover:text-green-900 mr-1"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        Del
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(employees[0]).length} className="px-6 py-4 text-center text-gray-500">
                    No employees found matching your search.
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
            <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800">Active Contracts</h3>
            <p className="text-2xl font-bold text-green-900">{employees.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-800">Projects</h3>
            <p className="text-2xl font-bold text-yellow-900">{new Set(employees.map(emp => emp.PROJECT)).size}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-sm font-medium text-purple-800">Departments</h3>
            <p className="text-2xl font-bold text-purple-900">{new Set(employees.map(emp => emp.DEPARTEMEN)).size}</p>
          </div>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} results
              <span className="ml-2 text-gray-500">(Page {currentPage} of {totalPages})</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Rows per page info */}
              <div className="text-sm text-gray-500 mr-4">
                {rowsPerPage} rows per page
              </div>

              {/* Previous button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-2 border rounded-md text-sm transition-colors ${currentPage === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? goToPage(page) : null}
                    disabled={page === '...'}
                    className={`px-3 py-2 border rounded-md text-sm transition-colors ${page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : page === '...'
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 border rounded-md text-sm transition-colors ${currentPage === totalPages
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Employee</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(initialNewEmployee).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
                  <input
                    type="text"
                    value={(newEmployee as any)[key]}
                    onChange={(e) => setNewEmployee({ ...newEmployee, [key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">View Employee Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(selectedEmployee).filter(key => key !== 'id').map((key) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
                  <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-900 text-sm">
                    {selectedEmployee[key] || '-'}
                  </div>
                </div>
              ))}
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

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Employee</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(selectedEmployee).filter(key => key !== 'id').map((key) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
                  <input
                    type="text"
                    value={selectedEmployee[key]}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, [key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 bg-gray-50 rounded-lg text-gray-900 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEmployee}
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

export default EmployeeListPage;
