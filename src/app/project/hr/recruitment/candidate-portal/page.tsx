'use client';
import React, { useState } from 'react';

const CandidatePortalPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Get position from URL parameters
  const [formData, setFormData] = useState(() => {
    let position = '';
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      position = urlParams.get('position') || '';
    }
    
    return {
      // Personal Information
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      maritalStatus: '',
      religion: '',
      
      // Contact Information
      address: '',
      city: '',
      province: '',
      postalCode: '',
      
      // Professional Information
      position: position,
      department: '',
      expectedSalary: '',
      startDate: '',
      
      // Education & Experience
      education: '',
      institution: '',
      graduationYear: '',
      experience: '',
      currentCompany: '',
      currentPosition: '',
      
      // Documents
      resume: null as File | null,
      photo: null as File | null,
      ktp: null as File | null,
      
      // Additional Information
      skills: '',
      languages: '',
      certifications: '',
      references: '',
      
      // Emergency Contact
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelationship: ''
    };
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Please select your gender';
    }

    if (step === 2) {
      if (!formData.position) newErrors.position = 'Please select a position';
      if (!formData.department) newErrors.department = 'Please select a department';
      if (!formData.expectedSalary) newErrors.expectedSalary = 'Expected salary is required';
      if (!formData.startDate) newErrors.startDate = 'Preferred start date is required';
    }

    if (step === 3) {
      if (!formData.education) newErrors.education = 'Education level is required';
      if (!formData.institution) newErrors.institution = 'Institution name is required';
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    }

    if (step === 4) {
      if (!formData.resume) newErrors.resume = 'Resume is required';
      if (!formData.ktp) newErrors.ktp = 'KTP is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect or show success message
      alert('Application submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        fullName: '', email: '', phone: '', dateOfBirth: '', placeOfBirth: '',
        gender: '', maritalStatus: '', religion: '', address: '', city: '',
        province: '', postalCode: '', position: '', department: '',
        expectedSalary: '', startDate: '', education: '', institution: '',
        graduationYear: '', experience: '', currentCompany: '', currentPosition: '',
        skills: '', languages: '', certifications: '', references: '',
        emergencyName: '', emergencyPhone: '', emergencyRelationship: '',
        resume: null, photo: null, ktp: null
      });
      setCurrentStep(1);
      
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, index) => (
          <React.Fragment key={index}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              index + 1 < currentStep
                ? 'bg-green-500 border-green-500 text-white'
                : index + 1 === currentStep
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`w-16 h-1 ${
                index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="08123456789"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select gender</option>
            <option value="L">Male (Laki-laki)</option>
            <option value="P">Female (Perempuan)</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status
          </label>
          <select
            value={formData.maritalStatus}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select status</option>
            <option value="Belum Menikah">Single</option>
            <option value="Menikah">Married</option>
            <option value="Cerai">Divorced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Place of Birth
          </label>
          <input
            type="text"
            value={formData.placeOfBirth}
            onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City of birth"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Religion
          </label>
          <select
            value={formData.religion}
            onChange={(e) => handleInputChange('religion', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select religion</option>
            <option value="Islam">Islam</option>
            <option value="Kristen">Christianity</option>
            <option value="Katolik">Catholicism</option>
            <option value="Hindu">Hinduism</option>
            <option value="Buddha">Buddhism</option>
            <option value="Konghucu">Confucianism</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position Applied For *
          </label>
          <select
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.position ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a position</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Marketing Specialist">Marketing Specialist</option>
            <option value="HR Coordinator">HR Coordinator</option>
            <option value="Finance Analyst">Finance Analyst</option>
            <option value="Sales Representative">Sales Representative</option>
            <option value="Operations Manager">Operations Manager</option>
          </select>
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select department</option>
            <option value="IT">Information Technology</option>
            <option value="Operations">Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Engineering">Engineering</option>
          </select>
          {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Salary *
          </label>
          <input
            type="text"
            value={formData.expectedSalary}
            onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.expectedSalary ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Rp 8,000,000"
          />
          {errors.expectedSalary && <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <select
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select experience level</option>
            <option value="0-1">0-1 years (Fresh Graduate)</option>
            <option value="2-3">2-3 years</option>
            <option value="4-5">4-5 years</option>
            <option value="6-8">6-8 years</option>
            <option value="9+">9+ years (Senior)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Company
          </label>
          <input
            type="text"
            value={formData.currentCompany}
            onChange={(e) => handleInputChange('currentCompany', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your current company name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Position
        </label>
        <input
          type="text"
          value={formData.currentPosition}
          onChange={(e) => handleInputChange('currentPosition', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your current job title"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Education & Skills</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highest Education Level *
          </label>
          <select
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.education ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select education level</option>
            <option value="SMA/SMK">High School (SMA/SMK)</option>
            <option value="D1">Diploma 1 (D1)</option>
            <option value="D2">Diploma 2 (D2)</option>
            <option value="D3">Diploma 3 (D3)</option>
            <option value="D4/S1">Bachelor's Degree (S1)</option>
            <option value="S2">Master's Degree (S2)</option>
            <option value="S3">Doctorate (S3)</option>
          </select>
          {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution Name *
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.institution ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="University/College name"
          />
          {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Graduation Year *
          </label>
          <select
            value={formData.graduationYear}
            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.graduationYear ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select year</option>
            {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
          {errors.graduationYear && <p className="text-red-500 text-sm mt-1">{errors.graduationYear}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field of Study
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Computer Science, Business Administration"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Languages
          </label>
          <input
            type="text"
            value={formData.languages}
            onChange={(e) => handleInputChange('languages', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Indonesian (Native), English (Fluent)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications
          </label>
          <input
            type="text"
            value={formData.certifications}
            onChange={(e) => handleInputChange('certifications', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., PMP, AWS, Google Analytics"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          References
        </label>
        <textarea
          value={formData.references}
          onChange={(e) => handleInputChange('references', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Previous supervisors or colleagues who can provide references"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Documents & Final Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume/CV *
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            errors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
          }`}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange('resume', e.target.files?.[0] || null)}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <div className="text-gray-600">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium">
                  {formData.resume ? formData.resume.name : 'Click to upload resume'}
                </p>
                <p className="text-sm">PDF, DOC, or DOCX (max 5MB)</p>
              </div>
            </label>
          </div>
          {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            KTP (ID Card) *
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            errors.ktp ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
          }`}>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange('ktp', e.target.files?.[0] || null)}
              className="hidden"
              id="ktp-upload"
            />
            <label htmlFor="ktp-upload" className="cursor-pointer">
              <div className="text-gray-600">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium">
                  {formData.ktp ? formData.ktp.name : 'Click to upload KTP'}
                </p>
                <p className="text-sm">JPG, PNG, or PDF (max 5MB)</p>
              </div>
            </label>
          </div>
          {errors.ktp && <p className="text-red-500 text-sm mt-1">{errors.ktp}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="text-gray-600">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium">
                {formData.photo ? formData.photo.name : 'Click to upload photo'}
              </p>
              <p className="text-sm">JPG or PNG (max 2MB)</p>
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            value={formData.emergencyName}
            onChange={(e) => handleInputChange('emergencyName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Emergency contact person name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            value={formData.emergencyPhone}
            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Emergency contact phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relationship to Emergency Contact
        </label>
        <input
          type="text"
          value={formData.emergencyRelationship}
          onChange={(e) => handleInputChange('emergencyRelationship', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Spouse, Parent, Sibling"
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Company Branding */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg mx-auto mb-4 flex items-center justify-center">
              <img src="/logo.jpeg" alt="Company Logo" className="h-12 w-12 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Our Team</h1>
            <p className="text-xl text-gray-600">Complete your application below to start your journey with us</p>
          </div>
          
          {/* Application Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {renderStepIndicator()}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderCurrentStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex gap-3">
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                        isSubmitting
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8 text-gray-500">
            <p>Your information is secure and will only be used for recruitment purposes.</p>
            <p className="mt-2">Questions? Contact us at hr@ansinda.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePortalPage;
