"use client";

import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Download, Upload, Clock, CheckCircle, XCircle, ArrowLeft, FileText, Calendar, User, Building, MapPin, Mail, Check, RefreshCw } from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BOQItem {
  no: number;
  materialCode: string | number;
  materialName: string;
  beforeDrmBoq: number | string;
  afterDrmBoq: number | string;
  abdBoq: number | string;
  constDoneBoq: number | string;
}

interface BOQFile {
  id: string;
  siteId: string;
  siteName: string;
  city: string;
  drmHp: string;
  abdHp: string;
  uploadBy: string;
  createdAt: any; // Firebase timestamp
  boqType: string;
  excelUrl: string;
  items: BOQItem[];
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'email_sent';
  // Additional properties for Request Material Additional
  year?: string;
  region?: string;
  shipper?: string;
  driver?: string;
  noPoi?: string;
  siteIdDest?: string;
  siteNameDestination?: string;
  siteType?: string;
  pole7m?: number;
  poleHc7m?: number;
  pole9m?: number;
  foCableAdss24c?: number;
  foCableAdss36c?: number;
  foCableAdss48c?: number;
  foCableAdss144c?: number;
  foCableAdss288c?: number;
  fdt48?: number;
  fdt72?: number;
  fat?: number;
  splitter14?: number
  jc24?: number;
  jc36?: number;
  jc48?: number;
  jc144?: number;
  cableBlackFts?: number;
  slingWr?: number;
  plateBolt20m?: number;
  suspensionCl?: number;
  buildingO?: number;
  grip?: number;
  poleClampSi?: number;
  endClam?: number;
  steelClam?: number;
  stopping?: number;
  beritaAcaraFileName?: string;
  beritaAcaraFileUrl?: string; // Store the download URL from Firebase Storage
}

const MaterialRequest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'before' | 'after' | 'requestMaterialAdditional'>('before');
  const [selectedFile, setSelectedFile] = useState<BOQFile | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [boqFiles, setBOQFiles] = useState<BOQFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [doDnCount, setDoDnCount] = useState(0);
  const [accessoriesCount, setAccessoriesCount] = useState(0);

  // Fetch BOQ files from Firebase
    const fetchBOQFiles = async () => {
      try {
        setLoading(true);
        
        // Fetch only from boq_files collection (exclude material_request_additional)
        const boqQuery = query(collection(db, 'boq_files'), orderBy('createdAt', 'desc'));
        const boqSnapshot = await getDocs(boqQuery);
        
        const files: BOQFile[] = [];
        
        // Process boq_files only
        boqSnapshot.forEach((doc) => {
          const data = doc.data();
          files.push({
            id: doc.id,
            siteId: data.siteId || '',
            siteName: data.siteName || '',
            city: data.city || '',
            drmHp: data.drmHp || '',
            abdHp: data.abdHp || '',
            uploadBy: data.uploadBy || '',
            createdAt: data.createdAt,
            boqType: data.boqType || '',
            excelUrl: data.excelUrl || '',
            items: data.items || [],
            status: data.status || 'pending'
          });
        });
        
        setBOQFiles(files);
        setError(null);
      } catch (err) {
        console.error('Error fetching BOQ files:', err);
        setError('Failed to load BOQ files');
      } finally {
        setLoading(false);
      }
    };

  // Fetch DO-DN Released count
  const fetchDoDnCount = async () => {
    try {
      const doDnQuery = query(collection(db, 'doDnReleased'));
      const doDnSnapshot = await getDocs(doDnQuery);
      setDoDnCount(doDnSnapshot.size);
    } catch (err) {
      console.error('Error fetching DO-DN count:', err);
      setDoDnCount(0);
    }
  };

  // Fetch Accessories count
  const fetchAccessoriesCount = async () => {
    try {
      const accessoriesQuery = query(collection(db, 'accessories'));
      const accessoriesSnapshot = await getDocs(accessoriesQuery);
      setAccessoriesCount(accessoriesSnapshot.size);
    } catch (err) {
      console.error('Error fetching Accessories count:', err);
      setAccessoriesCount(0);
    }
  };

  useEffect(() => {
    fetchBOQFiles();
    fetchDoDnCount();
    fetchAccessoriesCount();
  }, []);

  // Helper function to determine BOQ type
  const getBOQTypeTab = (boqType: string): 'before' | 'after' => {
    if (boqType.toLowerCase().includes('before')) return 'before';
    if (boqType.toLowerCase().includes('after')) return 'after';
    return 'before'; // default
  };

  // Helper function to format date from Firebase timestamp
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredFiles = boqFiles.filter(file => {
    const matchesSearch = file.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.siteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.uploadBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For Request Material Additional tab, show files from material_request_additional collection
    if (selectedTab === 'requestMaterialAdditional') {
      // Check if this file has the material request additional properties (indicating it's from that collection)
      const isRequestMaterialAdditional = file.year || file.region || file.shipper || file.driver || file.noPoi || 
                                       file.pole7m !== undefined || file.foCableAdss24c !== undefined;
      return matchesSearch && isRequestMaterialAdditional && file.status === 'pending';
    }
    
    // For After DRM BOQ tab, only show pending files
    if (selectedTab === 'after') {
      return matchesSearch && getBOQTypeTab(file.boqType) === 'after' && file.status === 'pending';
    }
    
    // For Before DRM BOQ tab, only show non-email_sent files
    if (selectedTab === 'before') {
      return matchesSearch && getBOQTypeTab(file.boqType) === 'before' && file.status !== 'email_sent';
    }
    
    return matchesSearch && getBOQTypeTab(file.boqType) === selectedTab;
  });

  const getStatusColor = (status: string) => {
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
      case 'email_sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
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
      case 'email_sent':
        return <Mail className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetail = (file: BOQFile) => {
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
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  // Handle send email
  const handleSendEmail = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to send via email.');
      return;
    }
    
    // Check if any selected files have already been sent via email
    const selectedFilesList = boqFiles.filter(file => selectedFiles.includes(file.id));
    const alreadySentFiles = selectedFilesList.filter(file => file.status === 'email_sent');
    
    if (alreadySentFiles.length > 0) {
      const fileNames = alreadySentFiles.map(file => `${file.siteName} (${file.siteId})`).join(', ');
      alert(`The following files have already been sent via email: ${fileNames}. They will be skipped.`);
      
      // Remove already sent files from selection
      const newSelection = selectedFiles.filter(id => 
        !alreadySentFiles.some(file => file.id === id)
      );
      setSelectedFiles(newSelection);
      
      if (newSelection.length === 0) {
        return;
      }
    }
    
    setShowEmailModal(true);
    
    // Pre-fill email data
    const filesToSend = boqFiles.filter(file => selectedFiles.includes(file.id) && file.status !== 'email_sent');
    
    // Generate subject with new format
    const subjectLines = filesToSend.map((file, index) => 
      `(${index + 1}) ${file.city} - PT Ansinda Communication Indonesia - ${file.siteId} - ${file.siteName}`
    );
    const subject = `Material Request - ${subjectLines.join('.\n')}`;
    
    setEmailData({
      to: '',
      subject: subject,
      message: `Please find the attached Before DRM BOQ files for the following sites:\n\n${filesToSend.map(file => 
        `- Site ID: ${file.siteId}\n  Site Name: ${file.siteName}\n  City: ${file.city}\n  Upload Date: ${formatDate(file.createdAt)}\n`
      ).join('\n')}\n\nBest regards,`
    });
  };

  // Handle approve selected files
  const handleApproveSelected = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to approve.');
      return;
    }
    
    try {
      setIsApproving(true);
      
      // Check if any selected files have already been approved
      const selectedFilesList = boqFiles.filter(file => selectedFiles.includes(file.id));
      const alreadyApprovedFiles = selectedFilesList.filter(file => file.status === 'approved');
      
      if (alreadyApprovedFiles.length > 0) {
        const fileNames = alreadyApprovedFiles.map(file => `${file.siteName} (${file.siteId})`).join(', ');
        alert(`The following files have already been approved: ${fileNames}. They will be skipped.`);
        
        // Remove already approved files from selection
        const newSelection = selectedFiles.filter(id => 
          !alreadyApprovedFiles.some(file => file.id === id)
        );
        setSelectedFiles(newSelection);
        
        if (newSelection.length === 0) {
          return;
        }
      }
      
      // Get files to approve (filter out already approved ones)
      const filesToApprove = selectedFilesList.filter(file => file.status !== 'approved');
      
      if (filesToApprove.length === 0) {
        alert('No files to approve.');
        return;
      }
      
      // Update status to "approved" for selected files in Firestore
      const updatePromises = filesToApprove.map(async (file) => {
        if (file.boqType === 'requestMaterialAdditional') {
          // Update in material_request_additional collection
          const fileRef = doc(db, 'material_request_additional', file.id);
          await updateDoc(fileRef, {
            status: 'approved',
            approvedAt: serverTimestamp(),
            approvedBy: 'current_user',
            approvalNotes: 'Approved via Request Material page'
          });
        } else {
          // Update in boq_files collection
          const fileRef = doc(db, 'boq_files', file.id);
          await updateDoc(fileRef, {
            status: 'approved',
            approvedAt: serverTimestamp(),
            approvedBy: 'current_user',
            approvalNotes: 'Approved via Request Material page'
          });
        }
      });

      await Promise.all(updatePromises);

      // Move approved files to accessories collection
      const movePromises = filesToApprove.map(async (file) => {
        // Create accessories data structure
        const accessoriesData = {
          siteId: file.siteId,
          siteName: file.siteName,
          city: file.city,
          region: '', // Will be filled later
          subcon: '', // Will be filled later
          boqType: file.boqType,
          drmHp: file.drmHp,
          abdHp: file.abdHp,
          uploadBy: file.uploadBy,
          sourceBoqId: file.id, // Reference to original BOQ file
          status: 'active',
          category: file.boqType === 'requestMaterialAdditional' ? 'Request Material Additional' : 'After DRM BOQ',
          createdAt: serverTimestamp(),
          approvedAt: serverTimestamp(),
          approvedBy: 'current_user',
          // Accessories specific fields
          materialType: file.boqType === 'requestMaterialAdditional' ? 'Request Material' : 'BOQ',
          priority: 'medium',
          notes: `Approved from ${file.boqType}`,
          // Additional fields that might be needed for accessories
          location: file.city,
          projectPhase: file.boqType === 'requestMaterialAdditional' ? 'Request Material' : 'After DRM',
          lastUpdated: serverTimestamp()
        };

        await addDoc(collection(db, 'accessories'), accessoriesData);
      });

      await Promise.all(movePromises);

      // Show success message
      alert(`${filesToApprove.length} files have been approved successfully and moved to Accessories.`);
    
    setSelectedFiles([]);
      
      // Refresh data to show updated statuses
      await fetchBOQFiles();
      await fetchAccessoriesCount();
      
      // Show additional info about where files moved
      console.log(`${filesToApprove.length} files have been moved to Accessories collection`);
      
    } catch (error) {
      console.error('Error approving files:', error);
      alert('Error approving files. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmittingEmail(true);
      
      // Update status to "email_sent" for selected files in Firestore
      const updatePromises = selectedFiles.map(async (fileId) => {
        const fileRef = doc(db, 'boq_files', fileId);
        await updateDoc(fileRef, {
          status: 'email_sent',
          emailSentAt: serverTimestamp(),
          emailRecipient: emailData.to,
          emailSubject: emailData.subject
        });
      });

      await Promise.all(updatePromises);

      // Move files to doDnReleased collection
      const selectedFilesList = boqFiles.filter(file => selectedFiles.includes(file.id) && file.status !== 'email_sent');
      const movePromises = selectedFilesList.map(async (file) => {
        // Create DO-DN data structure
        const doDnData = {
          siteId: file.siteId,
          siteName: file.siteName,
          city: file.city,
          subcon: '', // Will be filled later
          region: '', // Will be filled later
          siteStatus: 'On going' as const,
          doNumber: '', // Will be generated later
          dnNumber: '', // Will be generated later
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
          status: 'pending' as const,
          createdAt: serverTimestamp(),
          uploadBy: file.uploadBy,
          sourceBoqId: file.id, // Reference to original BOQ file
          boqType: file.boqType,
          drmHp: file.drmHp,
          abdHp: file.abdHp
        };

        await addDoc(collection(db, 'doDnReleased'), doDnData);
      });

      await Promise.all(movePromises);

      // Show success message
      alert(`Email sent successfully to ${emailData.to} with ${selectedFiles.length} BOQ files. Files have been moved to DO-DN Released.`);
    
    setShowEmailModal(false);
    setSelectedFiles([]);
    setEmailData({ to: '', subject: '', message: '' });
      
      // Refresh data to show updated statuses
      await fetchBOQFiles();
      await fetchDoDnCount();
      
      // Show additional info about where files moved
      console.log(`${selectedFiles.length} files have been moved to DO-DN Released collection`);
      
    } catch (error) {
      console.error('Error sending email and updating files:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setIsSubmittingEmail(false);
    }
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
              Back to BOQ Files
            </button>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">BOQ File Detail</h1>
                <p className="text-gray-600">{selectedFile.boqType}</p>
              </div>
            </div>
          </div>

          {/* File Detail */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Status Bar */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedFile.status || 'pending')}`}>
                  {getStatusIcon(selectedFile.status || 'pending')}
                  <span className="ml-2">
                    {(selectedFile.status || 'pending') === 'email_sent' 
                      ? 'Email Sent' 
                      : (selectedFile.status || 'pending').replace('_', ' ').charAt(0).toUpperCase() + (selectedFile.status || 'pending').replace('_', ' ').slice(1)
                    }
                  </span>
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  getBOQTypeTab(selectedFile.boqType) === 'before' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {selectedFile.boqType}
                </span>
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
                        <p className="text-sm font-medium text-gray-500">City</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.city}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">DRM HP</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.drmHp}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">ABD HP</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.abdHp}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Upload By</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.uploadBy}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - File Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">File Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">BOQ Type</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.boqType}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Upload Date</p>
                        <p className="text-lg font-semibold text-gray-900">{formatDate(selectedFile.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Package className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Items</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedFile.items?.length || 0}</p>
                      </div>
                    </div>
                    {selectedFile.boqType === 'requestMaterialAdditional' && selectedFile.excelUrl ? (
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Berita Acara File</p>
                          <button
                            onClick={() => {
                              // Handle file download using the stored URL
                              const fileUrl = selectedFile.beritaAcaraFileUrl || selectedFile.excelUrl || '';
                              if (fileUrl && (fileUrl.startsWith('http') || fileUrl.startsWith('blob:') || fileUrl.startsWith('data:'))) {
                                // Download the file using the stored URL
                                const link = document.createElement('a');
                                link.href = fileUrl;
                                link.download = selectedFile.beritaAcaraFileName || 'document.pdf';
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              } else {
                                // Fallback to filename if no URL is stored
                                const fileName = selectedFile.excelUrl || '';
                                if (fileName) {
                                  alert(`File: ${fileName}\n\nNote: This file was uploaded before the file storage system was implemented. Please re-upload the file to enable downloads.`);
                                }
                              }
                            }}
                            className="text-lg font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer flex items-center"
                          >
                            📎 {selectedFile.excelUrl}
                          </button>
                        </div>
                      </div>
                    ) : selectedFile.excelUrl && (
                      <div className="flex items-start">
                        <Download className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Excel File</p>
                          <a 
                            href={selectedFile.excelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Download Excel
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOQ Items Section */}
              {selectedFile.items && selectedFile.items.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">BOQ Items ({selectedFile.items.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material Code</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material Name</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedFile.items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm text-gray-900">{item.no}</td>
                            <td className="px-3 py-2 text-sm text-gray-900">{item.materialCode}</td>
                            <td className="px-3 py-2 text-sm text-gray-900">{item.materialName}</td>
                            <td className="px-3 py-2 text-sm text-gray-900">{item.beforeDrmBoq || item.afterDrmBoq || item.abdBoq || item.constDoneBoq || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex gap-3">
                  {(selectedFile.status || 'pending') === 'pending' && (
                    <>
                      <button 
                        onClick={async () => {
                          try {
                            setIsApproving(true);
                            
                            // Update status to "approved" in Firestore
                            let fileRef;
                            if (selectedFile.boqType === 'requestMaterialAdditional') {
                              fileRef = doc(db, 'material_request_additional', selectedFile.id);
                            } else {
                              fileRef = doc(db, 'boq_files', selectedFile.id);
                            }
                            await updateDoc(fileRef, {
                              status: 'approved',
                              approvedAt: serverTimestamp(),
                              approvedBy: 'current_user',
                              approvalNotes: 'Approved via Request Material detail view'
                            });

                            // Move to accessories collection
                            const accessoriesData = {
                              siteId: selectedFile.siteId,
                              siteName: selectedFile.siteName,
                              city: selectedFile.city,
                              region: '',
                              subcon: '',
                              boqType: selectedFile.boqType,
                              drmHp: selectedFile.drmHp,
                              abdHp: selectedFile.abdHp,
                              uploadBy: selectedFile.uploadBy,
                              sourceBoqId: selectedFile.id,
                              status: 'active',
                              category: selectedFile.boqType === 'requestMaterialAdditional' ? 'Request Material Additional' : 'After DRM BOQ',
                              createdAt: serverTimestamp(),
                              approvedAt: serverTimestamp(),
                              approvedBy: 'current_user',
                              materialType: selectedFile.boqType === 'requestMaterialAdditional' ? 'Request Material' : 'BOQ',
                              priority: 'medium',
                              notes: `Approved from ${selectedFile.boqType}`,
                              location: selectedFile.city,
                              projectPhase: selectedFile.boqType === 'requestMaterialAdditional' ? 'Request Material' : 'After DRM',
                              lastUpdated: serverTimestamp()
                            };

                            await addDoc(collection(db, 'accessories'), accessoriesData);

                            // Show success message
                            alert('File has been approved successfully and moved to Accessories.');
                            
                            // Refresh data
                            await fetchBOQFiles();
                            await fetchAccessoriesCount();
                            
                            // Close detail view
                            setShowDetail(false);
                            setSelectedFile(null);
                            
                          } catch (error) {
                            console.error('Error approving file:', error);
                            alert('Error approving file. Please try again.');
                          } finally {
                            setIsApproving(false);
                          }
                        }}
                        disabled={isApproving}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApproving ? (
                          <>
                            <Clock className="w-5 h-5 mr-2 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve File
                          </>
                        )}
                      </button>
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                        <XCircle className="w-5 h-5 mr-2" />
                        Reject File
                      </button>
                    </>
                  )}
                  {(selectedFile.status || 'pending') === 'email_sent' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center text-blue-800">
                        <Mail className="w-5 h-5 mr-2" />
                        <span className="font-medium">Email has been sent. File is now in DO-DN Released.</span>
                      </div>
                    </div>
                  )}
                  {(selectedFile.status || 'pending') === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">File has been approved and moved to Accessories.</span>
                      </div>
                    </div>
                  )}
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Download File
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
              <h1 className="text-3xl font-bold text-gray-900">Request Material</h1>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <XCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-400 mr-2 animate-spin" />
              <p className="text-blue-800">Loading BOQ files...</p>
            </div>
          </div>
        )}

        {/* BOQ Type Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('before')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'before'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Before DRM BOQ ({boqFiles.filter(f => getBOQTypeTab(f.boqType) === 'before' && f.status !== 'email_sent').length})
              </button>
              <button
                onClick={() => setSelectedTab('after')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'after'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                After DRM BOQ ({boqFiles.filter(f => getBOQTypeTab(f.boqType) === 'after' && f.status === 'pending').length})
              </button>
              <button
                onClick={() => setSelectedTab('requestMaterialAdditional')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'requestMaterialAdditional'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Request Material Additional ({boqFiles.filter(f => {
                  const isRequestMaterialAdditional = f.year || f.region || f.shipper || f.driver || f.noPoi || 
                                                   f.pole7m !== undefined || f.foCableAdss24c !== undefined;
                  return isRequestMaterialAdditional && f.status === 'pending';
                }).length})
              </button>
            </nav>
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
                  placeholder="Search sites, files, or uploaders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
                <button
                  onClick={async () => {
                    await fetchBOQFiles();
                    await fetchDoDnCount();
                    await fetchAccessoriesCount();
                  }}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ display: 'none' }}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            {/* Action Buttons */}
            {selectedFiles.length > 0 && (
              <div className="flex gap-3">
                {selectedTab === 'before' && (
                  <button 
                    onClick={handleSendEmail}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Send Email ({selectedFiles.length})
                  </button>
                )}
                {(selectedTab === 'after' || selectedTab === 'requestMaterialAdditional') && (
                  <button 
                    onClick={handleApproveSelected}
                    disabled={isApproving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApproving ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                    <Check className="w-5 h-5 mr-2" />
                    Approve Selected ({selectedFiles.length})
                      </>
                    )}
                  </button>
                )}
                <button 
                  onClick={() => setSelectedFiles([])}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            )}
            
            {/* Info Note for Before DRM BOQ */}
            {selectedTab === 'before' && (
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Note:</span> Files with "Email Sent" status are automatically moved to DO-DN Released and hidden from this view.
          </div>
            )}
            
            {/* Info Note for After DRM BOQ */}
            {selectedTab === 'after' && (
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Note:</span> Approved files are automatically moved to Accessories and hidden from this view.
              </div>
            )}
            
            {/* Info Note for Request Material Additional */}
            {selectedTab === 'requestMaterialAdditional' && (
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Note:</span> Approved files are automatically moved to Accessories and hidden from this view.
              </div>
            )}

          </div>
        </div>

        {/* Upload BOQ Form Modal */}
        {showNewRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload BOQ File</h3>
                <button 
                  onClick={() => setShowNewRequestForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site ID</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DRM HP</label>
                    <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+62" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">BOQ Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="before">Before BOQ</option>
                      <option value="after">After BOQ</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">BOQ File</label>
                    <input 
                      type="file" 
                      accept=".xlsx,.xls,.csv"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supported formats: .xlsx, .xls, .csv</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Additional notes or comments..."></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowNewRequestForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upload BOQ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">Send BOQ Files via Email</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-black">Subject</label>
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
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Files ({selectedFiles.length}):</p>
                  <div className="max-h-32 overflow-y-auto">
                    {boqFiles.filter(file => selectedFiles.includes(file.id)).map(file => (
                      <div key={file.id} className="text-sm text-gray-600 mb-1">
                        • {file.siteName} ({file.siteId}) - {file.city}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="  text-black px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmittingEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingEmail ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                    Send Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {selectedTab === 'requestMaterialAdditional' ? (
              // Request Material Additional Table (same as RPM page)
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={filteredFiles.length > 0 && selectedFiles.length === filteredFiles.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-xs font-medium text-gray-500 uppercase tracking-wider">Splitter 1:4</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JC 24</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JC 36</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JC 48</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JC 144</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cable/Black Fts</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sling WR</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Bolt 20m</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Suspension Cl</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Building O</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grip</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pole Clamp Si</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">End / Clam</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Steel Clam</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stopping</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Berita Acara File</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.length === 0 ? (
                    <tr>
                      <td colSpan={37} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <FileText className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No Request Material Additional files found</p>
                          <p className="text-gray-400 text-sm">
                            {loading ? 'Loading...' : 'Try adjusting your search or filter criteria'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleSelectFile(file.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.year || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.region || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.shipper || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.driver || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.noPoi || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.siteIdDest || file.siteId || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.siteNameDestination || file.siteName || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.siteType || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.pole7m || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.poleHc7m || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.pole9m || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.foCableAdss24c || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.foCableAdss36c || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.foCableAdss48c || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.foCableAdss144c || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.foCableAdss288c || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.fdt48 || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.fdt72 || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.fat || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.splitter14 || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.jc24 || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.jc36 || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.jc48 || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.jc144 || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.cableBlackFts || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.slingWr || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.plateBolt20m || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.suspensionCl || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.buildingO || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.grip || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.poleClampSi || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.endClam || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.steelClam || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{file.stopping || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {file.beritaAcaraFileName || file.excelUrl ? (
                            <button
                              onClick={() => {
                                // Handle file download using the stored URL
                                const fileUrl = file.beritaAcaraFileUrl || file.excelUrl || '';
                                if (fileUrl && (fileUrl.startsWith('http') || fileUrl.startsWith('blob:') || fileUrl.startsWith('data:'))) {
                                  // Download the file using the stored URL
                                  const link = document.createElement('a');
                                  link.href = fileUrl;
                                  link.download = file.beritaAcaraFileName || 'document.pdf';
                                  link.target = '_blank';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } else {
                                  // Fallback to filename if no URL is stored
                                  const fileName = file.beritaAcaraFileName || file.excelUrl || '';
                                  if (fileName) {
                                    alert(`File: ${fileName}\n\nNote: This file was uploaded before the file storage system was implemented. Please re-upload the file to enable downloads.`);
                                  }
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800 underline cursor-pointer flex items-center justify-center"
                            >
                              📎 {file.beritaAcaraFileName || file.excelUrl}
                            </button>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status || 'pending')}`}>
                            {getStatusIcon(file.status || 'pending')}
                            <span className="ml-1">
                              {(file.status || 'pending') === 'email_sent' 
                                ? 'Email Sent' 
                                : (file.status || 'pending').replace('_', ' ').charAt(0).toUpperCase() + (file.status || 'pending').replace('_', ' ').slice(1)
                              }
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleViewDetail(file)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              // Original BOQ Table for Before/After DRM BOQ
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={filteredFiles.length > 0 && selectedFiles.length === filteredFiles.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DRM HP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BOQ Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <FileText className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No BOQ files found</p>
                          <p className="text-gray-400 text-sm">
                            {loading ? 'Loading...' : 'Try adjusting your search or filter criteria'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleSelectFile(file.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {file.siteId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{file.siteName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.drmHp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.uploadBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(file.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.boqType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status || 'pending')}`}>
                            {getStatusIcon(file.status || 'pending')}
                            <span className="ml-1">
                              {(file.status || 'pending') === 'email_sent' 
                                ? 'Email Sent' 
                                : (file.status || 'pending').replace('_', ' ').charAt(0).toUpperCase() + (file.status || 'pending').replace('_', ' ').slice(1)
                              }
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleViewDetail(file)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          {file.boqType === 'requestMaterialAdditional' && file.excelUrl ? (
                            <span className="text-green-600 mr-3">
                              📎 {file.excelUrl}
                            </span>
                          ) : file.excelUrl && (
                            <a 
                              href={file.excelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Download
                            </a>
                          )}
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Summary Cards - Updated to show current tab */}
        <div className={`grid grid-cols-1 md:grid-cols-${selectedTab === 'before' ? '3' : selectedTab === 'after' ? '3' : selectedTab === 'requestMaterialAdditional' ? '3' : '4'} gap-6 mt-6`}>
          {/* Total BOQ Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total {selectedTab === 'before' ? 'Before' : selectedTab === 'after' ? 'After' : 'Request Material Additional'} BOQ
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedTab === 'after' 
                    ? boqFiles.filter(f => getBOQTypeTab(f.boqType) === selectedTab && f.status === 'pending').length
                    : selectedTab === 'before'
                    ? boqFiles.filter(f => getBOQTypeTab(f.boqType) === selectedTab && f.status !== 'email_sent').length
                    : selectedTab === 'requestMaterialAdditional'
                    ? boqFiles.filter(f => {
                        const isRequestMaterialAdditional = f.year || f.region || f.shipper || f.driver || f.noPoi || 
                                                         f.pole7m !== undefined || f.foCableAdss24c !== undefined;
                        return isRequestMaterialAdditional && f.status === 'pending';
                      }).length
                    : boqFiles.filter(f => getBOQTypeTab(f.boqType) === selectedTab).length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedTab === 'requestMaterialAdditional'
                    ? boqFiles.filter(f => {
                        const isRequestMaterialAdditional = f.year || f.region || f.shipper || f.driver || f.noPoi || 
                                                         f.pole7m !== undefined || f.foCableAdss24c !== undefined;
                        return f.status === 'pending' && isRequestMaterialAdditional;
                      }).length
                    : boqFiles.filter(f => f.status === 'pending' && getBOQTypeTab(f.boqType) === selectedTab).length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Third Card - Email Sent for Before, Approved for After and Request Material Additional */}
          {selectedTab === 'before' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Email Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                    {doDnCount}
                </p>
              </div>
            </div>
          </div>
          ) : selectedTab === 'after' ? (
          // Hide the Approved card for After DRM BOQ tab since Total Approved already shows the count
          null
          ) : selectedTab === 'requestMaterialAdditional' ? (
          // Hide the Approved card for Request Material Additional tab since Total Approved already shows the count
          null
          ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                    {boqFiles.filter(f => f.status === 'approved' && getBOQTypeTab(f.boqType) === selectedTab).length}
                </p>
              </div>
            </div>
          </div>
          )}

                    {/* Fourth Card - Only shown for After DRM BOQ and Request Material Additional */}
          {(selectedTab === 'after' || selectedTab === 'requestMaterialAdditional') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                    {accessoriesCount}
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialRequest;