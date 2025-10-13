'use client';
import React from 'react';
import Link from 'next/link';

const RecruitmentLandingPage: React.FC = () => {
  const recruitmentFeatures = [
    {
      id: 'candidatePortal',
      title: 'Candidate Portal',
      description: 'Professional application portal for candidates to submit their applications',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      href: '/project/hr/recruitment/candidate-portal',
      features: ['Multi-step application form', 'File upload support', 'Real-time validation', 'Mobile responsive']
    },
    {
      id: 'applicationsDashboard',
      title: 'Applications Dashboard',
      description: 'Comprehensive dashboard to manage and track all candidate applications',
      icon: '📊',
      color: 'from-green-500 to-green-600',
      href: '/project/hr/recruitment/applications-dashboard',
      features: ['Application tracking', 'Status management', 'Advanced filtering', 'Notes and ratings']
    },
    {
      id: 'candidatePool',
      title: 'Candidate Pool',
      description: 'Manage and organize your talent pool for future opportunities',
      icon: '🏊',
      color: 'from-purple-500 to-purple-600',
      href: '/project/hr/recruitment/candidate-pool',
      features: ['Talent database', 'Skill matching', 'Communication tools', 'Pipeline management']
    },
    {
      id: 'offeringLetterMaker',
      title: 'Offering Letter Maker',
      description: 'Create professional offering letters with customizable templates',
      icon: '📝',
      color: 'from-orange-500 to-orange-600',
      href: '/project/hr/recruitment/offering-letter-maker',
      features: ['Template library', 'Custom fields', 'PDF generation', 'Email integration']
    },
    {
      id: 'pkwtMaker',
      title: 'PKWT Maker',
      description: 'Generate Perjanjian Kerja Waktu Tertentu (Fixed-term work agreements)',
      icon: '📋',
      color: 'from-red-500 to-red-600',
      href: '/project/hr/recruitment/pkwt-maker',
      features: ['Legal compliance', 'Contract templates', 'Digital signatures', 'Document management']
    }
  ];

  const stats = [
    { label: 'Total Applications', value: '156', change: '+12%', changeType: 'increase' },
    { label: 'Shortlisted', value: '23', change: '+8%', changeType: 'increase' },
    { label: 'Interviews Scheduled', value: '18', change: '+15%', changeType: 'increase' },
    { label: 'Offers Sent', value: '7', change: '+3%', changeType: 'increase' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white rounded-full shadow-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Recruitment Management</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your hiring process with our comprehensive recruitment management system. 
            From candidate applications to final hiring decisions, everything you need in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/project/hr/recruitment/candidate-portal"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">➕</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Application</h3>
                <p className="text-sm text-gray-600">Access candidate portal</p>
              </div>
            </Link>

            <Link
              href="/project/hr/recruitment/applications-dashboard"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Applications</h3>
                <p className="text-sm text-gray-600">View all submissions</p>
              </div>
            </Link>

            <Link
              href="/project/hr/recruitment/offering-letter-maker"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Offer Letter</h3>
                <p className="text-sm text-gray-600">Generate offers</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Recruitment Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recruitmentFeatures.map((feature) => (
              <Link
                key={feature.id}
                href={feature.href}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 h-full border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((feat, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-500">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Our System?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Faster Hiring</h3>
              <p className="text-gray-600">Reduce time-to-hire by 40% with streamlined workflows and automated processes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Candidates</h3>
              <p className="text-gray-600">Professional application experience attracts higher quality candidates</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Insights</h3>
              <p className="text-gray-600">Track recruitment metrics and optimize your hiring strategy</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
            <p className="text-xl mb-6 opacity-90">
              Start using our recruitment system today and experience the difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/project/hr/recruitment/candidate-portal"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Try Candidate Portal
              </Link>
              <Link
                href="/project/hr/recruitment/applications-dashboard"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentLandingPage;
