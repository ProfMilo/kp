"use client";

import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Download } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface OutboundData {
  id: string;
  year: string;
  region: string;
  shipper: string;
  driver: string;
  noPoi: string;
  siteIdDest: string;
  siteNameDestination: string;
  siteType: string;
  pole7m: number;
  poleHc7m: number;
  pole9m: number;
  foCableAdss24c: number;
  foCableAdss36c: number;
  foCableAdss48c: number;
  foCableAdss144c: number;
  foCableAdss288c: number;
  fdt48: number;
  fdt72: number;
  fat: number;
  splitter14: number;
  jc24: number;
  jc36: number;
  jc48: number;
  jc144: number;
  cableBlackFts: number;
  slingWr: number;
  plateBolt20m: number;
  suspensionCl: number;
  buildingO: number;
  grip: number;
  poleClampSi: number;
  endClam: number;
  steelClam: number;
  stopping: number;
  fotoPod: string;
  fotoMater: string;
}

const OutboundPage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<OutboundData[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    year: '',
    region: '',
    shipper: '',
    driver: '',
    noPoi: '',
    siteIdDest: '',
    siteNameDestination: '',
    siteType: '',
    pole7m: { min: '', max: '' },
    poleHc7m: { min: '', max: '' },
    pole9m: { min: '', max: '' },
    foCableAdss24c: { min: '', max: '' },
    foCableAdss36c: { min: '', max: '' },
    foCableAdss48c: { min: '', max: '' },
    foCableAdss144c: { min: '', max: '' },
    foCableAdss288c: { min: '', max: '' },
    fdt48: { min: '', max: '' },
    fdt72: { min: '', max: '' },
    fat: { min: '', max: '' },
    splitter14: { min: '', max: '' },
    jc24: { min: '', max: '' },
    jc36: { min: '', max: '' },
    jc48: { min: '', max: '' },
    jc144: { min: '', max: '' },
    cableBlackFts: { min: '', max: '' },
    slingWr: { min: '', max: '' },
    plateBolt20m: { min: '', max: '' },
    suspensionCl: { min: '', max: '' },
    buildingO: { min: '', max: '' },
    grip: { min: '', max: '' },
    poleClampSi: { min: '', max: '' },
    endClam: { min: '', max: '' },
    steelClam: { min: '', max: '' },
    stopping: { min: '', max: '' },
    fotoPod: '',
    fotoMater: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [outboundRecords, setOutboundRecords] = useState<OutboundData[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) setUserData(userDoc.data());
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'material_outbound'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const records: OutboundData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OutboundData[];
      setOutboundRecords(records);
    });
    return () => unsub();
  }, []);

  // Fetch site data for dropdowns
  useEffect(() => {
    const q = query(collection(db, 'site'));
    const unsub = onSnapshot(q, (snapshot) => {
      const sites = snapshot.docs.map(doc => doc.data());
      setSiteOptions(sites);
      
      // Extract unique values for dropdowns
      const regions = [...new Set(sites.map(site => site.region).filter(Boolean))];
      const siteTypes = [...new Set(sites.map(site => site.siteType).filter(Boolean))];
      
      setUniqueRegions(regions.sort());
      setUniqueSiteTypes(siteTypes.sort());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let filtered = outboundRecords;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.siteIdDest.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.siteNameDestination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.shipper.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply additional filters
    filtered = applyFilters(filtered);
    
    setFilteredData(filtered);
  }, [searchTerm, outboundRecords, filters]);

  const [formData, setFormData] = useState<Omit<OutboundData, 'id'>>({
    year: '', region: '', shipper: '', driver: '', noPoi: '',
    siteIdDest: '', siteNameDestination: '', siteType: '',
    pole7m: 0, poleHc7m: 0, pole9m: 0,
    foCableAdss24c: 0, foCableAdss36c: 0, foCableAdss48c: 0, foCableAdss144c: 0, foCableAdss288c: 0,
    fdt48: 0, fdt72: 0, fat: 0,
    splitter14: 0, jc24: 0, jc36: 0, jc48: 0, jc144: 0,
    cableBlackFts: 0, slingWr: 0, plateBolt20m: 0, suspensionCl: 0, buildingO: 0, grip: 0, poleClampSi: 0, endClam: 0, steelClam: 0, stopping: 0,
    fotoPod: '', fotoMater: '',
  });

  // Dropdown options from Firestore
  const [siteOptions, setSiteOptions] = useState<Array<{
    region: string;
    siteId: string;
    siteName: string;
    siteType: string;
  }>>([]);
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([]);
  const [uniqueSiteTypes, setUniqueSiteTypes] = useState<string[]>([]);

  const numericKeys: Array<keyof Omit<OutboundData, 'id'>> = [
    'pole7m','poleHc7m','pole9m','foCableAdss24c','foCableAdss36c','foCableAdss48c','foCableAdss144c','foCableAdss288c','fdt48','fdt72','fat','splitter14','jc24','jc36','jc48','jc144','cableBlackFts','slingWr','plateBolt20m','suspensionCl','buildingO','grip','poleClampSi','endClam','steelClam','stopping'
  ];

  const handleFormChange = (key: keyof Omit<OutboundData, 'id'>, value: string) => {
    if (numericKeys.includes(key)) {
      setFormData(prev => ({ ...prev, [key]: Number(value || 0) as any }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value as any }));
    }
    
    // Handle cascading dropdowns and autocomplete
    if (key === 'region') {
      setFormData(prev => ({ ...prev, siteIdDest: '', siteNameDestination: '', siteType: '' }));
    } else if (key === 'siteNameDestination') {
      // Try to find exact match first
      let selectedSite = getSiteDetailsByName(value);
      
      // If no exact match, try partial match using enhanced helper
      if (!selectedSite && value.length > 0) {
        const matchingSites = findMatchingSites(value);
        if (matchingSites.length > 0) {
          // Prefer exact site name match, then site ID match
          selectedSite = matchingSites.find(site => site.siteName.toLowerCase() === value.toLowerCase()) ||
                        matchingSites.find(site => site.siteId.toLowerCase() === value.toLowerCase()) ||
                        matchingSites[0];
        }
      }
      
      if (selectedSite) {
        setFormData(prev => ({ 
          ...prev, 
          siteIdDest: selectedSite.siteId,
          siteType: selectedSite.siteType 
        }));
      }
    }
  };

  // Helper functions for dropdowns
  const getSiteIdsByRegion = (region: string) => {
    return siteOptions
      .filter(site => site.region === region)
      .map(site => site.siteId)
      .sort();
  };

  const getSiteNamesByRegion = (region: string) => {
    return siteOptions
      .filter(site => site.region === region)
      .map(site => site.siteName)
      .sort();
  };

  // Enhanced helper for autocomplete
  const findMatchingSites = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    return siteOptions.filter(site => 
      site.siteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Helper to get site details by site name
  const getSiteDetailsByName = (siteName: string) => {
    return siteOptions.find(site => site.siteName === siteName);
  };

  // Filter functions
  const applyFilters = (data: OutboundData[]) => {
    return data.filter(item => {
      // Text filters
      if (filters.year && !item.year.toLowerCase().includes(filters.year.toLowerCase())) return false;
      if (filters.region && !item.region.toLowerCase().includes(filters.region.toLowerCase())) return false;
      if (filters.shipper && !item.shipper.toLowerCase().includes(filters.shipper.toLowerCase())) return false;
      if (filters.driver && !item.driver.toLowerCase().includes(filters.driver.toLowerCase())) return false;
      if (filters.noPoi && !item.noPoi.toLowerCase().includes(filters.noPoi.toLowerCase())) return false;
      if (filters.siteIdDest && !item.siteIdDest.toLowerCase().includes(filters.siteIdDest.toLowerCase())) return false;
      if (filters.siteNameDestination && !item.siteNameDestination.toLowerCase().includes(filters.siteNameDestination.toLowerCase())) return false;
      if (filters.siteType && !item.siteType.toLowerCase().includes(filters.siteType.toLowerCase())) return false;
      if (filters.fotoPod && !item.fotoPod.toLowerCase().includes(filters.fotoPod.toLowerCase())) return false;
      if (filters.fotoMater && !item.fotoMater.toLowerCase().includes(filters.fotoMater.toLowerCase())) return false;

      // Numeric range filters
      if (filters.pole7m.min && item.pole7m < Number(filters.pole7m.min)) return false;
      if (filters.pole7m.max && item.pole7m > Number(filters.pole7m.max)) return false;
      if (filters.poleHc7m.min && item.poleHc7m < Number(filters.poleHc7m.min)) return false;
      if (filters.poleHc7m.max && item.poleHc7m > Number(filters.poleHc7m.max)) return false;
      if (filters.pole9m.min && item.pole9m < Number(filters.pole9m.min)) return false;
      if (filters.pole9m.max && item.pole9m > Number(filters.pole9m.max)) return false;
      if (filters.foCableAdss24c.min && item.foCableAdss24c < Number(filters.foCableAdss24c.min)) return false;
      if (filters.foCableAdss24c.max && item.foCableAdss24c > Number(filters.foCableAdss24c.max)) return false;
      if (filters.foCableAdss36c.min && item.foCableAdss36c < Number(filters.foCableAdss36c.min)) return false;
      if (filters.foCableAdss36c.max && item.foCableAdss36c > Number(filters.foCableAdss36c.max)) return false;
      if (filters.foCableAdss48c.min && item.foCableAdss48c < Number(filters.foCableAdss48c.min)) return false;
      if (filters.foCableAdss48c.max && item.foCableAdss48c > Number(filters.foCableAdss48c.max)) return false;
      if (filters.foCableAdss144c.min && item.foCableAdss144c < Number(filters.foCableAdss144c.min)) return false;
      if (filters.foCableAdss144c.max && item.foCableAdss144c > Number(filters.foCableAdss144c.max)) return false;
      if (filters.foCableAdss288c.min && item.foCableAdss288c < Number(filters.foCableAdss288c.min)) return false;
      if (filters.foCableAdss288c.max && item.foCableAdss288c > Number(filters.foCableAdss288c.max)) return false;
      if (filters.fdt48.min && item.fdt48 < Number(filters.fdt48.min)) return false;
      if (filters.fdt48.max && item.fdt48 > Number(filters.fdt48.max)) return false;
      if (filters.fdt72.min && item.fdt72 < Number(filters.fdt72.min)) return false;
      if (filters.fdt72.max && item.fdt72 > Number(filters.fdt72.max)) return false;
      if (filters.fat.min && item.fat < Number(filters.fat.min)) return false;
      if (filters.fat.max && item.fat > Number(filters.fat.max)) return false;
      if (filters.splitter14.min && item.splitter14 < Number(filters.splitter14.min)) return false;
      if (filters.splitter14.max && item.splitter14 > Number(filters.splitter14.max)) return false;
      if (filters.jc24.min && item.jc24 < Number(filters.jc24.min)) return false;
      if (filters.jc24.max && item.jc24 > Number(filters.jc24.max)) return false;
      if (filters.jc36.min && item.jc36 < Number(filters.jc36.min)) return false;
      if (filters.jc36.max && item.jc36 > Number(filters.jc36.max)) return false;
      if (filters.jc48.min && item.jc48 < Number(filters.jc48.min)) return false;
      if (filters.jc48.max && item.jc48 > Number(filters.jc48.max)) return false;
      if (filters.jc144.min && item.jc144 < Number(filters.jc144.min)) return false;
      if (filters.jc144.max && item.jc144 > Number(filters.jc144.max)) return false;
      if (filters.cableBlackFts.min && item.cableBlackFts < Number(filters.cableBlackFts.min)) return false;
      if (filters.cableBlackFts.max && item.cableBlackFts > Number(filters.cableBlackFts.max)) return false;
      if (filters.slingWr.min && item.slingWr < Number(filters.slingWr.min)) return false;
      if (filters.slingWr.max && item.slingWr > Number(filters.slingWr.max)) return false;
      if (filters.plateBolt20m.min && item.plateBolt20m < Number(filters.plateBolt20m.min)) return false;
      if (filters.plateBolt20m.max && item.plateBolt20m > Number(filters.plateBolt20m.max)) return false;
      if (filters.suspensionCl.min && item.suspensionCl < Number(filters.suspensionCl.min)) return false;
      if (filters.suspensionCl.max && item.suspensionCl > Number(filters.suspensionCl.max)) return false;
      if (filters.buildingO.min && item.buildingO < Number(filters.buildingO.min)) return false;
      if (filters.buildingO.max && item.buildingO > Number(filters.buildingO.max)) return false;
      if (filters.grip.min && item.grip < Number(filters.grip.min)) return false;
      if (filters.grip.max && item.grip > Number(filters.grip.max)) return false;
      if (filters.poleClampSi.min && item.poleClampSi < Number(filters.poleClampSi.min)) return false;
      if (filters.poleClampSi.max && item.poleClampSi > Number(filters.poleClampSi.max)) return false;
      if (filters.endClam.min && item.endClam < Number(filters.endClam.min)) return false;
      if (filters.endClam.max && item.endClam > Number(filters.endClam.max)) return false;
      if (filters.steelClam.min && item.steelClam < Number(filters.steelClam.min)) return false;
      if (filters.steelClam.max && item.steelClam > Number(filters.steelClam.max)) return false;
      if (filters.stopping.min && item.stopping < Number(filters.stopping.min)) return false;
      if (filters.stopping.max && item.stopping > Number(filters.stopping.max)) return false;

      return true;
    });
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      region: '',
      shipper: '',
      driver: '',
      noPoi: '',
      siteIdDest: '',
      siteNameDestination: '',
      siteType: '',
      pole7m: { min: '', max: '' },
      poleHc7m: { min: '', max: '' },
      pole9m: { min: '', max: '' },
      foCableAdss24c: { min: '', max: '' },
      foCableAdss36c: { min: '', max: '' },
      foCableAdss48c: { min: '', max: '' },
      foCableAdss144c: { min: '', max: '' },
      foCableAdss288c: { min: '', max: '' },
      fdt48: { min: '', max: '' },
      fdt72: { min: '', max: '' },
      fat: { min: '', max: '' },
      splitter14: { min: '', max: '' },
      jc24: { min: '', max: '' },
      jc36: { min: '', max: '' },
      jc48: { min: '', max: '' },
      jc144: { min: '', max: '' },
      cableBlackFts: { min: '', max: '' },
      slingWr: { min: '', max: '' },
      plateBolt20m: { min: '', max: '' },
      suspensionCl: { min: '', max: '' },
      buildingO: { min: '', max: '' },
      grip: { min: '', max: '' },
      poleClampSi: { min: '', max: '' },
      endClam: { min: '', max: '' },
      steelClam: { min: '', max: '' },
      stopping: { min: '', max: '' },
      fotoPod: '',
      fotoMater: ''
    });
  };

  // Export function
  const exportToCSV = () => {
    setExporting(true);
    try {
      const headers = [
        'Year', 'Region', 'Shipper', 'Driver', 'No POI', 'Site ID Destination', 'Site Name Destination', 'Site Type',
        'Pole 7m', 'Pole HC 7m', 'Pole 9m', 'FO Cable ADSS 24C', 'FO Cable ADSS 36C', 'FO Cable ADSS 48C',
        'FO Cable ADSS 144C', 'FO Cable ADSS 288C', 'FDT 48', 'FDT 72', 'FAT', 'Splitter 1:4',
        'JC 24', 'JC 36', 'JC 48', 'JC 144', 'Cable Black Fts', 'Sling WR', 'Plate Bolt 20m',
        'Suspension Cl', 'Building O', 'Grip', 'Pole Clamp Si', 'End Clam', 'Steel Clam', 'Stopping',
        'Foto PoD', 'Foto Mater'
      ];

      const csvContent = [
        headers.join(','),
        ...filteredData.map(item => [
          item.year, item.region, item.shipper, item.driver, item.noPoi, item.siteIdDest, item.siteNameDestination, item.siteType,
          item.pole7m, item.poleHc7m, item.pole9m, item.foCableAdss24c, item.foCableAdss36c, item.foCableAdss48c,
          item.foCableAdss144c, item.foCableAdss288c, item.fdt48, item.fdt72, item.fat, item.splitter14,
          item.jc24, item.jc36, item.jc48, item.jc144, item.cableBlackFts, item.slingWr, item.plateBolt20m,
          item.suspensionCl, item.buildingO, item.grip, item.poleClampSi, item.endClam, item.steelClam, item.stopping,
          item.fotoPod, item.fotoMater
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `outbound_material_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all required fields are filled
    const requiredFields = [
      'year', 'region', 'shipper', 'driver', 'noPoi', 
      'siteIdDest', 'siteNameDestination', 'siteType'
    ];
    
    const emptyFields = requiredFields.filter(field => {
      const value = formData[field as keyof Omit<OutboundData, 'id'>];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(field => {
        // Convert camelCase to readable names
        return field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .replace('Id Dest', ' ID Destination')
          .replace('Name Destination', ' Name Destination');
      }).join(', ');
      
      alert(`Please fill in all required fields: ${fieldNames}`);
      return;
    }
    
    try {
      setSubmitting(true);
      const docRef = await addDoc(collection(db, 'material_outbound'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      // Reset form
      setFormData({
        year: '', region: '', shipper: '', driver: '', noPoi: '',
        siteIdDest: '', siteNameDestination: '', siteType: '',
        pole7m: 0, poleHc7m: 0, pole9m: 0,
        foCableAdss24c: 0, foCableAdss36c: 0, foCableAdss48c: 0, foCableAdss144c: 0, foCableAdss288c: 0,
        fdt48: 0, fdt72: 0, fat: 0,
        splitter14: 0, jc24: 0, jc36: 0, jc48: 0, jc144: 0,
        cableBlackFts: 0, slingWr: 0, plateBolt20m: 0, suspensionCl: 0, buildingO: 0, grip: 0, poleClampSi: 0, endClam: 0, steelClam: 0, stopping: 0,
        fotoPod: '', fotoMater: '',
      });
      alert('Outbound record saved successfully.');
    } catch (err) {
      console.error('Failed to save outbound record', err);
      alert('Failed to save outbound record.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Outbound Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Outbound Material</h1>
              <p className="text-gray-600">Welcome back, {userData?.name || 'Material Manager'}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by Site ID, Site Name, Region, or Shipper..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    searchTerm ? 'text-black' : 'text-[#6a7282]'
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button 
                onClick={exportToCSV}
                disabled={exporting || filteredData.length === 0}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Advanced Filters</h4>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All Filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Text Filters */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Year</label>
                  <input
                    type="text"
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    className={`w-full border rounded px-3 py-2 text-sm ${
                      filters.year ? 'text-black' : 'text-[#6a7282]'
                    }`}
                    placeholder="Filter by year"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Region</label>
                  <input
                    type="text"
                    value={filters.region}
                    onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                    className={`w-full border rounded px-3 py-2 text-sm ${
                      filters.region ? 'text-black' : 'text-[#6a7282]'
                    }`}
                    placeholder="Filter by region"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Shipper</label>
                  <input
                    type="text"
                    value={filters.shipper}
                    onChange={(e) => setFilters(prev => ({ ...prev, shipper: e.target.value }))}
                    className={`w-full border rounded px-3 py-2 text-sm ${
                      filters.shipper ? 'text-black' : 'text-[#6a7282]'
                    }`}
                    placeholder="Filter by shipper"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Driver</label>
                  <input
                    type="text"
                    value={filters.driver}
                    onChange={(e) => setFilters(prev => ({ ...prev, driver: e.target.value }))}
                    className={`w-full border rounded px-3 py-2 text-sm ${
                      filters.driver ? 'text-black' : 'text-[#6a7282]'
                    }`}
                    placeholder="Filter by driver"
                  />
                </div>
              </div>

              {/* Numeric Range Filters */}
              <div className="mt-4">
                <h5 className="text-md font-medium text-gray-800 mb-3">Numeric Range Filters</h5>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  {/* Pole Filters */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Pole 7m</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.pole7m.min}
                        onChange={(e) => setFilters(prev => ({ ...prev, pole7m: { ...prev.pole7m, min: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.pole7m.min ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={filters.pole7m.max}
                        onChange={(e) => setFilters(prev => ({ ...prev, pole7m: { ...prev.pole7m, max: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.pole7m.max ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Pole HC 7m</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.poleHc7m.min}
                        onChange={(e) => setFilters(prev => ({ ...prev, poleHc7m: { ...prev.poleHc7m, min: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.poleHc7m.min ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={filters.poleHc7m.max}
                        onChange={(e) => setFilters(prev => ({ ...prev, poleHc7m: { ...prev.poleHc7m, max: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.poleHc7m.max ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Pole 9m</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.pole9m.min}
                        onChange={(e) => setFilters(prev => ({ ...prev, pole9m: { ...prev.pole9m, min: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.pole9m.min ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={filters.pole9m.max}
                        onChange={(e) => setFilters(prev => ({ ...prev, pole9m: { ...prev.pole9m, max: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.pole9m.max ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">FO Cable 24C</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.foCableAdss24c.min}
                        onChange={(e) => setFilters(prev => ({ ...prev, foCableAdss24c: { ...prev.foCableAdss24c, min: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.foCableAdss24c.min ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={filters.foCableAdss24c.max}
                        onChange={(e) => setFilters(prev => ({ ...prev, foCableAdss24c: { ...prev.foCableAdss24c, max: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.foCableAdss24c.max ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">FDT 48</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.fdt48.min}
                        onChange={(e) => setFilters(prev => ({ ...prev, fdt48: { ...prev.fdt48, min: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.fdt48.min ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={filters.fdt48.max}
                        onChange={(e) => setFilters(prev => ({ ...prev, fdt48: { ...prev.fdt48, max: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.fdt48.max ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">JC 24</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.jc24.min}
                        onChange={(e) => setFilters(prev => ({ ...prev, jc24: { ...prev.jc24, min: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.jc24.min ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={filters.jc24.max}
                        onChange={(e) => setFilters(prev => ({ ...prev, jc24: { ...prev.jc24, max: e.target.value } }))}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          filters.jc24.max ? 'text-black' : 'text-[#6a7282]'
                        }`}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Outbound Material Data</h3>
              <div className="text-sm text-gray-600">
                Showing {filteredData.length} of {outboundRecords.length} records
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No outbound records found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new outbound record using the form below.</p>
              </div>
            ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REGION</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SHIPPER</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DRIVER</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO POI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SITE ID / DEST</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SITE NAME / DESTINATION</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SITE TYPE</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pole 7m</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pole HC 7m</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pole 9m</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FO Cable ADSS 24C</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FO Cable ADSS 36C</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FO Cable ADSS 48C</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FO Cable ADSS 144C</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FO Cable ADSS 288C</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FDT 48</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FDT 72</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FAT</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Splitter 1:4</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JC 24</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JC 36</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JC 48</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JC 144</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ble/Black Fts</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sling WR</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Bolt 20m</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Suspension Cl</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Building O</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grip</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pole Clamp Si</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">End / Clam</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Steel Clam</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stopping</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Foto PoD</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Foto Mater</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.shipper}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.driver}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.noPoi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.siteIdDest}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.siteNameDestination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.siteType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.pole7m}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.poleHc7m}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.pole9m}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.foCableAdss24c}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.foCableAdss36c}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.foCableAdss48c}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.foCableAdss144c}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.foCableAdss288c}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.fdt48}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.fdt72}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.fat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.splitter14}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.jc24}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.jc36}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.jc48}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.jc144}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.cableBlackFts}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.slingWr}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.plateBolt20m}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.suspensionCl}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.buildingO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.grip}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.poleClampSi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.endClam}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.steelClam}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.stopping}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.fotoPod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.fotoMater}</td>
                  </tr>) )}
              </tbody>
            </table>
            )}
          </div>
        </div>

        {/* Add New Outbound Record */}
        {userData?.role?.toLowerCase() === 'rpm' && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Outbound Record</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="o-year" className="block text-sm text-gray-600 mb-1">Year</label>
                  <input id="o-year" value={formData.year} onChange={e=>handleFormChange('year', e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
              </div>
                <div>
                  <label htmlFor="o-region" className="block text-sm text-gray-600 mb-1">Region</label>
                  <div className="relative">
                    <input 
                      id="o-region" 
                      value={formData.region} 
                      onChange={e=>handleFormChange('region', e.target.value)} 
                      className="w-full border rounded px-3 py-2 text-black"
                      placeholder="Type or select region"
                      list="region-options"
                    />
                    <datalist id="region-options">
                      {uniqueRegions.map(region => (
                        <option key={region} value={region} />
                      ))}
                    </datalist>
              </div>
            </div>
                <div>
                  <label htmlFor="o-shipper" className="block text-sm text-gray-600 mb-1">Shipper</label>
                  <input id="o-shipper" value={formData.shipper} onChange={e=>handleFormChange('shipper', e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
                </div>
                <div>
                  <label htmlFor="o-driver" className="block text-sm text-gray-600 mb-1">Driver</label>
                  <input id="o-driver" value={formData.driver} onChange={e=>handleFormChange('driver', e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
                </div>
                <div>
                  <label htmlFor="o-nopoi" className="block text-sm text-gray-600 mb-1">No POI</label>
                  <input id="o-nopoi" value={formData.noPoi} onChange={e=>handleFormChange('noPoi', e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
          </div>
                <div>
                  <label htmlFor="o-siteid" className="block text-sm text-gray-600 mb-1">Site ID / Dest</label>
                  <input 
                    id="o-siteid" 
                    value={formData.siteIdDest} 
                    onChange={e=>handleFormChange('siteIdDest', e.target.value)} 
                    className="w-full border rounded px-3 py-2 text-black bg-gray-100" 
                    readOnly
                  />
              </div>
                <div>
                  <label htmlFor="o-sitename" className="block text-sm text-gray-600 mb-1">Site Name / Destination</label>
                  <div className="relative">
                    <input 
                      id="o-sitename" 
                      value={formData.siteNameDestination} 
                      onChange={e=>handleFormChange('siteNameDestination', e.target.value)} 
                      className="w-full border rounded px-3 py-2 text-black"
                      placeholder="Type or select site name"
                      list="sitename-options"
                      disabled={!formData.region}
                    />
                    <datalist id="sitename-options">
                      {formData.region && getSiteNamesByRegion(formData.region).map(siteName => (
                        <option key={siteName} value={siteName} />
                      ))}
                    </datalist>
                    {formData.siteNameDestination && formData.siteNameDestination.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        💡 Type to search or use dropdown for suggestions
              </div>
                    )}
            </div>
          </div>
                <div>
                  <label htmlFor="o-sitetype" className="block text-sm text-gray-600 mb-1">Site Type</label>
                  <input 
                    id="o-sitetype" 
                    value={formData.siteType} 
                    onChange={e=>handleFormChange('siteType', e.target.value)} 
                    className="w-full border rounded px-3 py-2 text-black bg-gray-100" 
                    readOnly
                  />
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {numericKeys.map((key) => (
                  <div key={String(key)}>
                    <label className="block text-sm text-gray-600 mb-1">{String(key)}</label>
                    <input type="number" value={(formData as any)[key]} onChange={e=>handleFormChange(key, e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
          </div>
                ))}
                <div>
                  <label htmlFor="o-fotopod" className="block text-sm text-gray-600 mb-1">Foto PoD</label>
                  <input id="o-fotopod" value={formData.fotoPod} onChange={e=>handleFormChange('fotoPod', e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
              </div>
                <div>
                  <label htmlFor="o-fotomater" className="block text-sm text-gray-600 mb-1">Foto Mater</label>
                  <input id="o-fotomater" value={formData.fotoMater} onChange={e=>handleFormChange('fotoMater', e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
              </div>
            </div>

              <div className="flex justify-end">
                <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                  {submitting ? 'Saving...' : 'Save Outbound'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Role-based message for material users */}
        {userData?.role?.toLowerCase() === 'material' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">View Only Access</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>As a Material role user, you can view and filter outbound material data, but cannot add new records. Only RPM users have permission to create new outbound entries.</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default OutboundPage; 