"use client";

import React, { useEffect, useState } from 'react';
import { Package, Search, Filter, Download } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface MaterialDashboardProps {}

interface MaterialItem {
  id: string;
  name: string;
  stock: number;
  gap: number;
  return: number;
  inbound: number;
  outbound: number;
}

const MaterialDashboard: React.FC<MaterialDashboardProps> = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('2024');
  const [cityFilter, setCityFilter] = useState('all');
  const [mandorFilter, setMandorFilter] = useState('all');
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialItem[]>([]);

  // Predefined material items as requested
  const materialItems: MaterialItem[] = [
    { id: '1', name: 'Pole 7m 4"', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '2', name: 'Pole HC 7m 3"', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '3', name: 'Pole 9m 4"', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '4', name: 'FO Cable ADSS 24C', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '5', name: 'FO Cable ADSS 36C', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '6', name: 'FO Cable ADSS 48C', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '7', name: 'FO Cable ADSS 144C', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '8', name: 'FO Cable ADSS 288C', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '9', name: 'FDT 48', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '10', name: 'FDT 72', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '11', name: 'FAT Splitter1:8', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '12', name: 'JC 24', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '13', name: 'JC 36', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '14', name: 'JC 48', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '15', name: 'JC 144', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '16', name: 'Cable/Slack Hanger', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '17', name: 'Sling Wire 6mm', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '18', name: 'Plate Belt 20mm', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '19', name: 'Suspension Clamp', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '20', name: 'Buldog Grip', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '21', name: 'Pole Clamp Single', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '22', name: 'Dead End / Clamp Buaya', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
    { id: '23', name: 'Steel Clamp Stopping', stock: 0, gap: 0, return: 0, inbound: 0, outbound: 0 },
  ];

  // Sample cities and mandors for the filters
  const cities = ['all', 'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Yogyakarta', 'Palembang', 'Makassar'];
  const mandors = ['all', 'Mandor A', 'Mandor B', 'Mandor C', 'Mandor D', 'Mandor E'];
  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter materials based on selected filters
  useEffect(() => {
    let filtered = materialItems;

    // In a real application, you would filter based on the selected year, city, and mandor
    // For now, we'll just show all materials
    setFilteredMaterials(filtered);
  }, [yearFilter, cityFilter, mandorFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Material Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Material Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userData?.name || 'Material Manager'}</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Mandor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mandor
              </label>
              <select
                value={mandorFilter}
                onChange={(e) => setMandorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {mandors.map(mandor => (
                  <option key={mandor} value={mandor}>
                    {mandor === 'all' ? 'All Mandors' : mandor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredMaterials.length} materials for {yearFilter} - {cityFilter !== 'all' ? cityFilter : 'All Cities'} - {mandorFilter !== 'all' ? mandorFilter : 'All Mandors'}
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Material Inventory</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Material Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Gap
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Return
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Inbound
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Outbound
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{material.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{material.gap}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{material.return}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{material.inbound}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{material.outbound}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDashboard;
