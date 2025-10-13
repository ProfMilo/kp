'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, FileText, Clock, CheckCircle, XCircle, ArrowLeft, Calendar, User, Building, MapPin, Mail, Check, Package, Plus } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DoDnData {
  id: string;
  siteId: string;
  siteName: string;
  subcon: string;
  region: string;
  city: string;
  siteStatus: 'On going' | 'Construction done' | 'ATP done' | 'Drop';
  doNumber: string;
  dnNumber: string;
  materialPickupDate: string;
  year: number;
  mover: string;
  carNumber: string;
  carType: string;
  pole7M5: number;
  pole7M3: number;
  pole7M4: number;
  pole9M: number;
  adss24C: number;
  adss36C: number;
  adss48C: number;
  adss144C: number;
  fdt48: number;
  fdt72: number;
  fdt144CoresUG: number;
  fat16: number;
  fat16CPedestal: number;
  splitter18: number;
  spliceTray12: number;
  jc144Core: number;
  hdpe4034: number;
  hdpe3228: number;
  precast80x80x130: number;
  precast40x40x60: number;
  precast34x34x40: number;
  precast20x20x20: number;
  olt: number;
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  createdAt: Date;
  uploadBy: string;
}

const DoDnReleasedPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<DoDnData | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [doDnData, setDoDnData] = useState<DoDnData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DoDnData | null>(null);
  const [formData, setFormData] = useState<Partial<DoDnData>>({
    siteId: '',
    siteName: '',
    subcon: '',
    region: '',
    city: '',
    siteStatus: 'On going',
    doNumber: '',
    dnNumber: '',
    materialPickupDate: '',
    year: new Date().getFullYear(),
    mover: '',
    carNumber: '',
    carType: '',
    pole7M5: 0,
    pole7M3: 0,
    pole7M4: 0,
    pole9M: 0,
    adss24C: 0,
    adss36C: 0,
    adss48C: 0,
    adss144C: 0,
    fdt48: 0,
    fdt72: 0,
    fdt144CoresUG: 0,
    fat16: 0,
    fat16CPedestal: 0,
    splitter18: 0,
    spliceTray12: 0,
    jc144Core: 0,
    hdpe4034: 0,
    hdpe3228: 0,
    precast80x80x130: 0,
    precast40x40x60: 0,
    precast34x34x40: 0,
    precast20x20x20: 0,
    olt: 0,
    status: 'pending',
    uploadBy: ''
  });

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doDnCollection = collection(db, 'doDnReleased');
        const querySnapshot = await getDocs(doDnCollection);
        
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data() as Partial<DoDnData> & { createdAt: any };
          
          // Convert Firestore Timestamp to JS Date if needed
          const createdAt = docData.createdAt?.toDate?.() || docData.createdAt || new Date();
          
          return {
            id: doc.id,
            siteId: docData.siteId || '',
            siteName: docData.siteName || '',
            subcon: docData.subcon || '',
            region: docData.region || '',
            city: docData.city || '',
            siteStatus: docData.siteStatus || 'On going',
            doNumber: docData.doNumber || '',
            dnNumber: docData.dnNumber || '',
            materialPickupDate: docData.materialPickupDate || '',
            year: docData.year || 0,
            mover: docData.mover || '',
            carNumber: docData.carNumber || '',
            carType: docData.carType || '',
            pole7M5: docData.pole7M5 || 0,
            pole7M3: docData.pole7M3 || 0,
            pole7M4: docData.pole7M4 || 0,
            pole9M: docData.pole9M || 0,
            adss24C: docData.adss24C || 0,
            adss36C: docData.adss36C || 0,
            adss48C: docData.adss48C || 0,
            adss144C: docData.adss144C || 0,
            fdt48: docData.fdt48 || 0,
            fdt72: docData.fdt72 || 0,
            fdt144CoresUG: docData.fdt144CoresUG || 0,
            fat16: docData.fat16 || 0,
            fat16CPedestal: docData.fat16CPedestal || 0,
            splitter18: docData.splitter18 || 0,
            spliceTray12: docData.spliceTray12 || 0,
            jc144Core: docData.jc144Core || 0,
            hdpe4034: docData.hdpe4034 || 0,
            hdpe3228: docData.hdpe3228 || 0,
            precast80x80x130: docData.precast80x80x130 || 0,
            precast40x40x60: docData.precast40x40x60 || 0,
            precast34x34x40: docData.precast34x34x40 || 0,
            precast20x20x20: docData.precast20x20x20 || 0,
            olt: docData.olt || 0,
            status: docData.status || 'pending',
            createdAt,
            uploadBy: docData.uploadBy || ''
          } as DoDnData;
        });
        
        setDoDnData(data);
      } catch (error) {
        console.error('Error fetching DO-DN data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredData = doDnData.filter(item => {
    const matchesSearch = 
      item.siteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subcon.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || item.siteStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'On going': 'bg-blue-100 text-blue-800',
      'Construction done': 'bg-green-100 text-green-800',
      'ATP done': 'bg-purple-100 text-purple-800',
      'Drop': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status}
      </span>
    );
  };

  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcessStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetail = (file: DoDnData) => {
    setSelectedFile(file);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setSelectedFile(null);
    setShowDetail(false);
  };

  // Handle checkbox selection
  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedFiles.length === filteredData.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredData.map(file => file.id));
    }
  };

  // Handle send email
  const handleSendEmail = () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one record to send via email.');
      return;
    }
    setShowEmailModal(true);
    
    // Pre-fill email data
    const selectedFilesList = doDnData.filter(file => selectedFiles.includes(file.id));
    
    const subjectLines = selectedFilesList.map((file, index) => 
      `(${index + 1}) ${file.city} - ${file.doNumber}/${file.dnNumber} - ${file.siteId} - ${file.siteName}`
    );
    const subject = `DO-DN Released Report - ${subjectLines.join('.\n')}`;
    
    setEmailData({
      to: '',
      subject: subject,
      message: `Please find the DO-DN Released information for the following sites:\n\n${selectedFilesList.map(file => 
        `- Site ID: ${file.siteId}\n  Site Name: ${file.siteName}\n  City: ${file.city}\n  DO Number: ${file.doNumber}\n  DN Number: ${file.dnNumber}\n  Material Pickup Date: ${file.materialPickupDate}\n`
      ).join('\n')}\n\nBest regards,`
    });
  };

  // Handle email submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Sending email:', emailData);
    console.log('Selected files:', selectedFiles);
    
    alert(`Email sent successfully to ${emailData.to} with ${selectedFiles.length} DO-DN records.`);
    
    setShowEmailModal(false);
    setSelectedFiles([]);
    setEmailData({ to: '', subject: '', message: '' });
  };

  const exportToCSV = () => {
    console.log('Exporting to CSV...');
    alert('CSV export functionality will be implemented soon.');
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  // Form helper functions
  const handleFormInputChange = (field: keyof DoDnData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditItem = (item: DoDnData) => {
    setEditingItem(item);
    setFormData({
      siteId: item.siteId,
      siteName: item.siteName,
      subcon: item.subcon,
      region: item.region,
      city: item.city,
      siteStatus: item.siteStatus,
      doNumber: item.doNumber,
      dnNumber: item.dnNumber,
      materialPickupDate: item.materialPickupDate,
      year: item.year,
      mover: item.mover,
      carNumber: item.carNumber,
      carType: item.carType,
      pole7M5: item.pole7M5,
      pole7M3: item.pole7M3,
      pole7M4: item.pole7M4,
      pole9M: item.pole9M,
      adss24C: item.adss24C,
      adss36C: item.adss36C,
      adss48C: item.adss48C,
      adss144C: item.adss144C,
      fdt48: item.fdt48,
      fdt72: item.fdt72,
      fdt144CoresUG: item.fdt144CoresUG,
      fat16: item.fat16,
      fat16CPedestal: item.fat16CPedestal,
      splitter18: item.splitter18,
      spliceTray12: item.spliceTray12,
      jc144Core: item.jc144Core,
      hdpe4034: item.hdpe4034,
      hdpe3228: item.hdpe3228,
      precast80x80x130: item.precast80x80x130,
      precast40x40x60: item.precast40x40x60,
      precast34x34x40: item.precast34x34x40,
      precast20x20x20: item.precast20x20x20,
      olt: item.olt,
      status: item.status || 'pending',
      uploadBy: item.uploadBy
    });
    setShowForm(true);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setFormData({
      siteId: '',
      siteName: '',
      subcon: '',
      region: '',
      city: '',
      siteStatus: 'On going',
      doNumber: '',
      dnNumber: '',
      materialPickupDate: '',
      year: new Date().getFullYear(),
      mover: '',
      carNumber: '',
      carType: '',
      pole7M5: 0,
      pole7M3: 0,
      pole7M4: 0,
      pole9M: 0,
      adss24C: 0,
      adss36C: 0,
      adss48C: 0,
      adss144C: 0,
      fdt48: 0,
      fdt72: 0,
      fdt144CoresUG: 0,
      fat16: 0,
      fat16CPedestal: 0,
      splitter18: 0,
      spliceTray12: 0,
      jc144Core: 0,
      hdpe4034: 0,
      hdpe3228: 0,
      precast80x80x130: 0,
      precast40x40x60: 0,
      precast34x34x40: 0,
      precast20x20x20: 0,
      olt: 0,
      status: 'pending',
      uploadBy: ''
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Update existing item
        console.log('Updating item:', formData);
        // TODO: Implement update logic
        alert('Update functionality will be implemented soon.');
      } else {
        // Create new item
        console.log('Creating new item:', formData);
        // TODO: Implement create logic
        alert('Create functionality will be implemented soon.');
      }
      
      setShowForm(false);
      setEditingItem(null);
      setFormData({
        siteId: '',
        siteName: '',
        subcon: '',
        region: '',
        city: '',
        siteStatus: 'On going',
        doNumber: '',
        dnNumber: '',
        materialPickupDate: '',
        year: new Date().getFullYear(),
        mover: '',
        carNumber: '',
        carType: '',
        pole7M5: 0,
        pole7M3: 0,
        pole7M4: 0,
        pole9M: 0,
        adss24C: 0,
        adss36C: 0,
        adss48C: 0,
        adss144C: 0,
        fdt48: 0,
        fdt72: 0,
        fdt144CoresUG: 0,
        fat16: 0,
        fat16CPedestal: 0,
        splitter18: 0,
        spliceTray12: 0,
        jc144Core: 0,
        hdpe4034: 0,
        hdpe3228: 0,
        precast80x80x130: 0,
        precast40x40x60: 0,
        precast34x34x40: 0,
        precast20x20x20: 0,
        olt: 0,
        status: 'pending',
        uploadBy: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      siteId: '',
      siteName: '',
      subcon: '',
      region: '',
      city: '',
      siteStatus: 'On going',
      doNumber: '',
      dnNumber: '',
      materialPickupDate: '',
      year: new Date().getFullYear(),
      mover: '',
      carNumber: '',
      carType: '',
      pole7M5: 0,
      pole7M3: 0,
      pole7M4: 0,
      pole9M: 0,
      adss24C: 0,
      adss36C: 0,
      adss48C: 0,
      adss144C: 0,
      fdt48: 0,
      fdt72: 0,
      fdt144CoresUG: 0,
      fat16: 0,
      fat16CPedestal: 0,
      splitter18: 0,
      spliceTray12: 0,
      jc144Core: 0,
      hdpe4034: 0,
      hdpe3228: 0,
      precast80x80x130: 0,
      precast40x40x60: 0,
      precast34x34x40: 0,
      precast20x20x20: 0,
      olt: 0,
      status: 'pending',
      uploadBy: ''
    });
  };

  // Detail View Component
  if (showDetail && selectedFile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToList}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to DO-DN Released
            </button>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">DO-DN Released Detail</h1>
                <p className="text-gray-600">{selectedFile.doNumber} / {selectedFile.dnNumber}</p>
              </div>
            </div>
          </div>

          {/* File Detail */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Status Bar */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getProcessStatusColor(selectedFile.status || 'pending')}`}>
                  {getProcessStatusIcon(selectedFile.status || 'pending')}
                  <span className="ml-2">{(selectedFile.status || 'pending').replace('_', ' ').charAt(0).toUpperCase() + (selectedFile.status || 'pending').replace('_', ' ').slice(1)}</span>
                </span>
                {getStatusBadge(selectedFile.siteStatus)}
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Site Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Site ID</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.siteId}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Site Name</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.siteName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">City / Region</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.city} / {selectedFile.region}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subcon</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.subcon}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - DO/DN Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">DO-DN Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">DO Number</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.doNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">DN Number</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.dnNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Material Pickup Date</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.materialPickupDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Mover</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.mover}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Package className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Car Number / Type</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.carNumber} / {selectedFile.carType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Material Details Table */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr><td className="px-3 py-2 text-sm">Pole 7M 5"</td><td className="px-3 py-2 text-sm">{selectedFile.pole7M5}</td><td className="px-3 py-2 text-sm">ADSS 24C</td><td className="px-3 py-2 text-sm">{selectedFile.adss24C}</td></tr>
                      <tr><td className="px-3 py-2 text-sm">Pole 7M 3"</td><td className="px-3 py-2 text-sm">{selectedFile.pole7M3}</td><td className="px-3 py-2 text-sm">ADSS 36C</td><td className="px-3 py-2 text-sm">{selectedFile.adss36C}</td></tr>
                      <tr><td className="px-3 py-2 text-sm">Pole 7M 4"</td><td className="px-3 py-2 text-sm">{selectedFile.pole7M4}</td><td className="px-3 py-2 text-sm">ADSS 48C</td><td className="px-3 py-2 text-sm">{selectedFile.adss48C}</td></tr>
                      <tr><td className="px-3 py-2 text-sm">Pole 9M</td><td className="px-3 py-2 text-sm">{selectedFile.pole9M}</td><td className="px-3 py-2 text-sm">ADSS 144C</td><td className="px-3 py-2 text-sm">{selectedFile.adss144C}</td></tr>
                      <tr><td className="px-3 py-2 text-sm">FDT-48</td><td className="px-3 py-2 text-sm">{selectedFile.fdt48}</td><td className="px-3 py-2 text-sm">HDPE 40/34mm</td><td className="px-3 py-2 text-sm">{selectedFile.hdpe4034}</td></tr>
                      <tr><td className="px-3 py-2 text-sm">FDT-72</td><td className="px-3 py-2 text-sm">{selectedFile.fdt72}</td><td className="px-3 py-2 text-sm">HDPE 32/28mm</td><td className="px-3 py-2 text-sm">{selectedFile.hdpe3228}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex gap-3">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Download Report
                  </button>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Send Email
                  </button>
                  <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main List View
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
              <h1 className="text-3xl font-bold text-gray-900">DO-DN Released</h1>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Site ID, Site Name, DO/DN Number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px] text-black"
                >
                  <option value="all">All Status</option>
                  <option value="On going">On going</option>
                  <option value="Construction done">Construction done</option>
                  <option value="ATP done">ATP done</option>
                  <option value="Drop">Drop</option>
                </select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleNewItem}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              {selectedFiles.length > 0 && (
                <>
                  <button 
                    onClick={handleSendEmail}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Send Email ({selectedFiles.length})
                  </button>
                  <button 
                    onClick={() => setSelectedFiles([])}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Selection
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">Send DO-DN Released Report via Email</h3>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Email Address</label>
                  <input 
                    type="email"
                    value={emailData.to}
                    onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="recipient@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    rows={6}
                    value={emailData.message}
                    onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter your message here..."
                  />
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Records ({selectedFiles.length}):</p>
                  <div className="max-h-32 overflow-y-auto">
                    {doDnData.filter(file => selectedFiles.includes(file.id)).map(file => (
                      <div key={file.id} className="text-sm text-gray-600 mb-1">
                        • {file.siteName} ({file.siteId}) - {file.doNumber}/{file.dnNumber}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="text-black px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-black">
                  {editingItem ? 'Edit DO-DN Released Record' : 'Add New DO-DN Released Record'}
                </h3>
                <button 
                  onClick={handleCancelForm}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site ID *</label>
                    <input 
                      type="text"
                      value={formData.siteId}
                      onChange={(e) => handleFormInputChange('siteId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter Site ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name *</label>
                    <input 
                      type="text"
                      value={formData.siteName}
                      onChange={(e) => handleFormInputChange('siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter Site Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcon *</label>
                    <input 
                      type="text"
                      value={formData.subcon}
                      onChange={(e) => handleFormInputChange('subcon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter Subcon"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
                    <input 
                      type="text"
                      value={formData.region}
                      onChange={(e) => handleFormInputChange('region', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter Region"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input 
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleFormInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Status *</label>
                    <select
                      value={formData.siteStatus}
                      onChange={(e) => handleFormInputChange('siteStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    >
                      <option value="On going">On going</option>
                      <option value="Construction done">Construction done</option>
                      <option value="ATP done">ATP done</option>
                      <option value="Drop">Drop</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DO Number *</label>
                    <input 
                      type="text"
                      value={formData.doNumber}
                      onChange={(e) => handleFormInputChange('doNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter DO Number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DN Number *</label>
                    <input 
                      type="text"
                      value={formData.dnNumber}
                      onChange={(e) => handleFormInputChange('dnNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter DN Number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material Pickup Date *</label>
                    <input 
                      type="date"
                      value={formData.materialPickupDate}
                      onChange={(e) => handleFormInputChange('materialPickupDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                    <input 
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleFormInputChange('year', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter Year"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mover</label>
                    <input 
                      type="text"
                      value={formData.mover}
                      onChange={(e) => handleFormInputChange('mover', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter Mover"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Number</label>
                    <input 
                      type="text"
                      value={formData.carNumber}
                      onChange={(e) => handleFormInputChange('carNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter Car Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
                    <input 
                      type="text"
                      value={formData.carType}
                      onChange={(e) => handleFormInputChange('carType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter Car Type"
                    />
                  </div>
                </div>

                {/* Material Quantities */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Material Quantities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pole 7M 5"</label>
                      <input 
                        type="number"
                        value={formData.pole7M5}
                        onChange={(e) => handleFormInputChange('pole7M5', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pole 7M 3"</label>
                      <input 
                        type="number"
                        value={formData.pole7M3}
                        onChange={(e) => handleFormInputChange('pole7M3', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pole 7M 4"</label>
                      <input 
                        type="number"
                        value={formData.pole7M4}
                        onChange={(e) => handleFormInputChange('pole7M4', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pole 9M</label>
                      <input 
                        type="number"
                        value={formData.pole9M}
                        onChange={(e) => handleFormInputChange('pole9M', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ADSS 24C</label>
                      <input 
                        type="number"
                        value={formData.adss24C}
                        onChange={(e) => handleFormInputChange('adss24C', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ADSS 36C</label>
                      <input 
                        type="number"
                        value={formData.adss36C}
                        onChange={(e) => handleFormInputChange('adss36C', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ADSS 48C</label>
                      <input 
                        type="number"
                        value={formData.adss48C}
                        onChange={(e) => handleFormInputChange('adss48C', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ADSS 144C</label>
                      <input 
                        type="number"
                        value={formData.adss144C}
                        onChange={(e) => handleFormInputChange('adss144C', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">FDT-48</label>
                      <input 
                        type="number"
                        value={formData.fdt48}
                        onChange={(e) => handleFormInputChange('fdt48', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">FDT-72</label>
                      <input 
                        type="number"
                        value={formData.fdt72}
                        onChange={(e) => handleFormInputChange('fdt72', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">FDT-144 Cores UG</label>
                      <input 
                        type="number"
                        value={formData.fdt144CoresUG}
                        onChange={(e) => handleFormInputChange('fdt144CoresUG', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">FAT-16</label>
                      <input 
                        type="number"
                        value={formData.fat16}
                        onChange={(e) => handleFormInputChange('fat16', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">FAT-16 C Pedestal</label>
                      <input 
                        type="number"
                        value={formData.fat16CPedestal}
                        onChange={(e) => handleFormInputChange('fat16CPedestal', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Splitter 1:8</label>
                      <input 
                        type="number"
                        value={formData.splitter18}
                        onChange={(e) => handleFormInputChange('splitter18', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Splice Tray 1:2</label>
                      <input 
                        type="number"
                        value={formData.spliceTray12}
                        onChange={(e) => handleFormInputChange('spliceTray12', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">JC 144 Core</label>
                      <input 
                        type="number"
                        value={formData.jc144Core}
                        onChange={(e) => handleFormInputChange('jc144Core', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">HDPE 40/34mm</label>
                      <input 
                        type="number"
                        value={formData.hdpe4034}
                        onChange={(e) => handleFormInputChange('hdpe4034', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">HDPE 32/28mm</label>
                      <input 
                        type="number"
                        value={formData.hdpe3228}
                        onChange={(e) => handleFormInputChange('hdpe3228', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Precast 80x80x130</label>
                      <input 
                        type="number"
                        value={formData.precast80x80x130}
                        onChange={(e) => handleFormInputChange('precast80x80x130', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Precast 40x40x60</label>
                      <input 
                        type="number"
                        value={formData.precast40x40x60}
                        onChange={(e) => handleFormInputChange('precast40x40x60', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Precast 34x34x40</label>
                      <input 
                        type="number"
                        value={formData.precast34x34x40}
                        onChange={(e) => handleFormInputChange('precast34x34x40', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Precast 20x20x20</label>
                      <input 
                        type="number"
                        value={formData.precast20x20x20}
                        onChange={(e) => handleFormInputChange('precast20x20x20', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OLT</label>
                      <input 
                        type="number"
                        value={formData.olt}
                        onChange={(e) => handleFormInputChange('olt', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button 
                    type="button"
                    onClick={handleCancelForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingItem ? 'Update Record' : 'Create Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={filteredData.length > 0 && selectedFiles.length === filteredData.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DO Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DN Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No DO-DN records found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(item.id)}
                          onChange={() => handleSelectFile(item.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.siteId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.siteName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.subcon}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.siteStatus)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.doNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.dnNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.materialPickupDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getProcessStatusColor(item.status || 'pending')}`}>
                          {getProcessStatusIcon(item.status || 'pending')}
                          <span className="ml-1">{(item.status || 'pending').replace('_', ' ').charAt(0).toUpperCase() + (item.status || 'pending').replace('_', ' ').slice(1)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetail(item)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Edit
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-3">Download</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{doDnData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doDnData.filter(f => f.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doDnData.filter(f => f.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doDnData.filter(f => f.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doDnData.filter(f => f.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoDnReleasedPage;