import React, { useState, useMemo, useEffect } from 'react';

import { Home, MapPin, BarChart3, User, Settings, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, FileText, Package, Users, Briefcase } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { usePendingOpsRequests } from '@/app/hooks/usePendingOpsRequests';
import NotificationDot from './NotificationDot';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const { pendingCount } = usePendingOpsRequests();

  // Halaman yang tidak menampilkan sidebar
  const hideSidebar = pathname === "/" || pathname === "/menu" || pathname === "/login" || pathname.startsWith("/menu");
  
  // Jika di halaman yang tidak menampilkan sidebar, return null
  if (hideSidebar) {
    return null;
  }

  // State to manage which submenus are open
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    menu: false,
    site: false,
    ops: false,
    task: false,
    recruitment: false,
    employeeManagement: false,
    personal: false,
    settings: false,
  });

  // Toggle submenu visibility
  const toggleSubmenu = (menu: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    if (!user) return; // Guard clause if user data is not available yet

    const role = user.role.toLowerCase();
    const isInOperationsSection = pathname.includes('/project/ops/ops/');
    const isInMaterialSection = pathname.includes('/project/material/');

    // Map roles to their corresponding path segments for URLs
    const rolePathSegment = {
      'top management': 'top',
      'rpm': 'rpm',
      'pic': 'pic',
      'pic manager': 'picm',
      'picm': 'picm',
      'qc': 'qc',
      'ops': 'ops',
      'hr': 'hr',
      'material': 'material'
    }[role] || 'top'; // Default to 'top' if the role is unknown or doesn't match

    let destination = '';

    // Construct the destination URL based on the clicked menu item (path)
    switch (path) {
      case 'dashboard':
        // Material dashboard is shared across roles
        if (role === 'material' || isInMaterialSection) {
          destination = '/project/material/dashboard';
        } else {
          // top_management has a different dashboard route structure
          destination = (role === 'top management')
            ? '/project/top/dashboard'
            : `/project/${rolePathSegment}/dashboard`;
        }
        break;
      case 'siteDetail':
        destination = `/project/${rolePathSegment}/site/details`;
        break;
      case 'sitePreview':
        destination = `/project/${rolePathSegment}/site/preview`;
        break;
      case 'boqDetails':
        destination = `/project/${rolePathSegment}/site/boq`;
        break;
      case 'opsDetails':
        destination = isInOperationsSection 
          ? '/project/ops/ops/details'
          : `/project/${rolePathSegment}/ops/details`;
        break;
      case 'transferList':
        destination = isInOperationsSection 
          ? '/project/ops/ops/transfer'
          : `/project/${rolePathSegment}/ops/transfer`;
        break;
      case 'opsHistory':
        destination = isInOperationsSection 
          ? '/project/ops/ops/history'
          : `/project/${rolePathSegment}/ops/history`;
        break;
      case 'approvalRequest':
        destination = isInOperationsSection 
          ? '/project/ops/ops/approval'
          : `/project/${rolePathSegment}/ops/approval`;
        break;
      case 'requestOps':
        destination = isInOperationsSection 
          ? '/project/ops/ops/request'
          : `/project/${rolePathSegment}/ops/request`;
        break;
      case 'importTask':
        destination = `/project/${rolePathSegment}/task/import`;
        break;
      case 'taskHistory':
        destination = `/project/${rolePathSegment}/task/history`;
        break;
      case 'employeeData':
        destination = `/project/${rolePathSegment}/personal/employee-data`;
        break;
      case 'resignation':
        destination = `/project/${rolePathSegment}/personal/resignation`;
        break;
      case 'adjustmentSalary':
        destination = `/project/${rolePathSegment}/personal/salary`;
        break;
      case 'ticketRequest':
        destination = `/project/${rolePathSegment}/personal/ticket`;
        break;
      case 'candidatePool':
        destination = `/project/${rolePathSegment}/recruitment/candidate-pool`;
        break;
      case 'candidatePortal':
        destination = `/project/${rolePathSegment}/recruitment/candidate-portal`;
        break;
      case 'applicationsDashboard':
        destination = `/project/${rolePathSegment}/recruitment/applications-dashboard`;
        break;
      case 'offeringLetterMaker':
        destination = `/project/${rolePathSegment}/recruitment/offering-letter-maker`;
        break;
      case 'pkwtMaker':
        destination = `/project/${rolePathSegment}/recruitment/pkwt-maker`;
        break;
      case 'employeeList':
        destination = `/project/${rolePathSegment}/employee-management/employee-list`;
        break;
      case 'salaryList':
        destination = `/project/${rolePathSegment}/employee-management/salary-list`;
        break;
      case 'requestMaterial':
        // Material pages always live under /project/material regardless of viewer role
        destination = `/project/material/menu/request-material`;
        break;
      case 'inbound':
        destination = `/project/material/menu/inbound`;
        break;
      case 'outbound':
        destination = `/project/material/menu/outbound`;
        break;
      case 'requestMaterialAdditional':
        destination = `/project/material/menu/request-material-additional`;
        break;
      case 'doDnReleased':
        destination = `/project/material/menu/do-dn-released`;
        break;
      case 'accessories':
        destination = `/project/material/menu/accessories`;
        break;
      case 'profile':
        destination = `/project/${rolePathSegment}/settings/profile`;
        break;
      default:
        // Do not navigate if the path is not recognized
        return;
    }
    
    router.push(destination);
  };

  // Menu structure
  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5 mr-3" />,
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: <Package className="w-5 h-5 mr-3" />,
      subItems: [
        { id: 'requestMaterial', label: 'Request Material' },
        { id: 'doDnReleased', label: 'DO-DN Released' },
        { id: 'accessories', label: 'Accessories' },
        { id: 'inbound', label: 'Inbound' },
        { id: 'outbound', label: 'Outbound' },
        { id: 'requestMaterialAdditional', label: 'Request Material Additional' },
      ],
    },
    {
      id: 'site',
      label: 'Site',
      icon: <MapPin className="w-5 h-5 mr-3" />,
      subItems: [
        { id: 'siteDetail', label: 'Site Detail' },
        { id: 'sitePreview', label: 'Site Preview' },
        { id: 'boqDetails', label: 'BOQ Details' },
      ],
    },
    {
      id: 'ops',
      label: 'OPS',
      icon: <BarChart3 className="w-5 h-5 mr-3" />,
      subItems: [
        { id: 'opsDetails', label: 'Ops Details' },
        { id: 'approvalRequest', label: 'Approval Request' },
        { id: 'requestOps', label: 'Request OPS' },
      ],
    },
    {
      id: 'task',
      label: 'Task',
      icon: <FileText className="w-5 h-5 mr-3" />,
      subItems: [
        { id: 'importTask', label: 'Import Task' },
        { id: 'taskHistory', label: 'Task History' },
      ],
    },
    {
      id: 'recruitment',
      label: 'Recruitment',
      icon: <Users className="w-5 h-5 mr-3" />,
      subItems: [
        { id: 'candidatePortal', label: 'Candidate Portal' },
        { id: 'applicationsDashboard', label: 'Applications Dashboard' },
        { id: 'candidatePool', label: 'Candidate Pool' },
        { id: 'offeringLetterMaker', label: 'Offering Letter Maker' },
        { id: 'pkwtMaker', label: 'PKWT Maker' },
      ],
    },
    {
      id: 'employeeManagement',
      label: 'Employee Management',
      icon: <Briefcase className="w-5 h-5 mr-3" />,
      subItems: [
        { id: 'employeeList', label: 'Employee List' },
        { id: 'salaryList', label: 'Salary List' },
      ],
    },
    {
      id: 'personal',
      label: 'Personal',
      icon: <User className="w-5 h-5 mr-3" />,
      subItems: [
        { id: 'employeeData', label: 'Employee Data' },
        { id: 'resignation', label: 'Resignation' },
        { id: 'adjustmentSalary', label: 'Adjustment Salary' },
        { id: 'ticketRequest', label: 'Ticket Request' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5 mr-3" />,
      subItems: [{ id: 'profile', label: 'Profile' }],
    },
  ];

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    if (loading || !user) {
      return []; // Tampilkan menu kosong selama loading
    }

    const userRole = user.role.toLowerCase();
    const isInOperationsSection = pathname.includes('/project/ops/ops/');
    const isInHRSection = pathname.includes('/project/hr/');
    const isInMaterialSection = pathname.includes('/project/material/');

    // Aturan untuk role 'rpm'
    if (userRole === 'rpm') {
      // Jika di section operations, gunakan menu structure ops
      if (isInOperationsSection) {
        return allMenuItems
          .filter(item => ['ops', 'settings'].includes(item.id))
          .map(item => {
            if (item.id === 'ops' && item.subItems) {
              return {
                ...item,
                subItems: [
                  { id: 'opsDetails', label: 'Ops Details' },
                  { id: 'transferList', label: 'Transfer List' },
                  { id: 'opsHistory', label: 'Ops History' },
                ],
              };
            }
            return item;
          });
      }
      // Jika di section material, tampilkan menu material + settings
      if (isInMaterialSection) {
        // In material section, RPM can only access Dashboard, and Menu with Inbound/Outbound
        return allMenuItems
          .filter(item => ['dashboard', 'menu'].includes(item.id))
          .map(item => {
            if (item.id === 'menu' && item.subItems) {
              return {
                ...item,
                subItems: item.subItems.filter(sub => ['inbound', 'outbound', 'requestMaterialAdditional'].includes(sub.id)),
              };
            }
            return item;
          });
      }
      // Jika tidak di operations/material, gunakan menu structure normal rpm (tanpa menu material)
      return allMenuItems
        .filter(item => item.id !== 'menu') // Sembunyikan menu material
        .map(item => {
          if (item.id === 'personal' && item.subItems) {
            return {
              ...item,
              subItems: item.subItems.filter(sub => sub.id !== 'employeeData'),
            };
          }
          return item;
        });
    }

    // Aturan untuk role 'pic'
    if (userRole === 'pic') {
      // 1. Sembunyikan menu 'Task' dan 'Menu' (material)
      const filteredItems = allMenuItems.filter(item => item.id !== 'task' && item.id !== 'menu');
      // 2. Sembunyikan 'Approval Request' dari submenu 'OPS' dan 'Employee Data' dari Personal
      return filteredItems.map(item => {
        if (item.id === 'ops' && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(sub => sub.id !== 'approvalRequest'),
          };
        }
        if (item.id === 'personal' && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(sub => sub.id !== 'employeeData'),
          };
        }
        return item;
      });
    }

    // Aturan untuk role 'picm' (berbeda dengan pic - memiliki akses ke Task)
    if (userRole === 'picm') {
      // 1. Sembunyikan menu 'Menu' (material) tapi biarkan Task
      const filteredItems = allMenuItems.filter(item => item.id !== 'menu');
      // 2. Sembunyikan 'Approval Request' dari submenu 'OPS' dan 'Employee Data' dari Personal
      return filteredItems.map(item => {
        if (item.id === 'ops' && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(sub => sub.id !== 'approvalRequest'),
          };
        }
        if (item.id === 'personal' && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(sub => sub.id !== 'employeeData'),
          };
        }
        return item;
      });
    }

    // Aturan untuk role 'qc'
    if (userRole === 'qc') {
      // Hanya tampilkan menu 'site' dan 'settings', sembunyikan menu material
      return allMenuItems
        .filter(item => ['site', 'settings'].includes(item.id))
        .map(item => {
          if (item.id === 'site' && item.subItems) {
            return {
              ...item,
              subItems: item.subItems.filter(sub => sub.id !== 'boqDetails'),
            };
          }
          return item;
        });
    }

    // Aturan untuk role 'ops'
    if (userRole === 'ops') {
      // Sembunyikan menu material, hanya tampilkan ops dan settings
      return allMenuItems
        .filter(item => ['ops', 'settings'].includes(item.id))
        .map(item => {
          if (item.id === 'ops' && item.subItems) {
            return {
              ...item,
              subItems: [
                { id: 'opsDetails', label: 'Ops Details' },
                { id: 'transferList', label: 'Transfer List' },
                { id: 'opsHistory', label: 'Ops History' },
              ],
            };
          }
          return item;
        });
    }

    // Aturan untuk role 'hr'
    if (userRole === 'hr') {
      // HR bisa mengakses menu 'recruitment', 'employee management', 'personal', dan 'settings'
      return allMenuItems
        .filter(item => ['recruitment', 'employeeManagement', 'personal', 'settings'].includes(item.id))
        .map(item => {
          if (item.id === 'personal' && item.subItems) {
            return {
              ...item,
              subItems: [
                { id: 'employeeData', label: 'Employee Data' },
                { id: 'resignation', label: 'Resignation' },
                { id: 'adjustmentSalary', label: 'Adjustment Salary' },
                { id: 'ticketRequest', label: 'Ticket Request' },
              ],
            };
          }
          return item;
        });
    }

    // Aturan untuk role 'material'
    if (userRole === 'material') {
      // Material hanya bisa mengakses menu 'dashboard', 'menu', dan 'settings'
      return allMenuItems
        .filter(item => ['dashboard', 'menu', 'settings'].includes(item.id))
        .map(item => {
          if (item.id === 'menu' && item.subItems) {
            return {
              ...item,
              subItems: [
                { id: 'requestMaterial', label: 'Request Material' },
                { id: 'doDnReleased', label: 'DO-DN Released' },
                { id: 'accessories', label: 'Accessories' },
                { id: 'inbound', label: 'Inbound' },
                { id: 'outbound', label: 'Outbound' },
              ],
            };
          }
          return item;
        });
    }

    // Jika role lain (misal: top_management), tampilkan semua menu
    // Kecuali: hide 'BOQ Details' untuk top management
    if (userRole === 'top management') {
      // Jika di section HR, gunakan menu structure HR
      if (isInHRSection) {
        return allMenuItems
          .filter(item => ['recruitment', 'employeeManagement', 'personal', 'settings'].includes(item.id))
          .map(item => {
            if (item.id === 'personal' && item.subItems) {
              return {
                ...item,
                subItems: [
                  { id: 'employeeData', label: 'Employee Data' },
                  { id: 'resignation', label: 'Resignation' },
                  { id: 'adjustmentSalary', label: 'Adjustment Salary' },
                  { id: 'ticketRequest', label: 'Ticket Request' },
                ],
              };
            }
            return item;
          });
      }
      // Jika di section operations, gunakan menu structure ops
      if (isInOperationsSection) {
        return allMenuItems
          .filter(item => ['ops', 'settings'].includes(item.id))
          .map(item => {
            if (item.id === 'ops' && item.subItems) {
              return {
                ...item,
                subItems: [
                  { id: 'opsDetails', label: 'Ops Details' },
                  { id: 'transferList', label: 'Transfer List' },
                  { id: 'opsHistory', label: 'Ops History' },
                ],
              };
            }
            return item;
          });
      }
      // Jika di section material, gunakan menu structure material
      if (isInMaterialSection) {
        // Top management viewing material section: allow Dashboard + full material Menu
        return allMenuItems
          .filter(item => ['dashboard', 'menu'].includes(item.id))
          .map(item => item);
      }
      // Jika tidak di operations, gunakan menu structure normal top management (tanpa menu material)
      return allMenuItems
        .filter(item => item.id !== 'menu') // Sembunyikan menu material
        .map(item => {
          if (item.id === 'site' && item.subItems) {
            return {
              ...item,
              subItems: item.subItems.filter(sub => sub.id !== 'boqDetails'),
            };
          }
          if (item.id === 'ops' && item.subItems) {
            return {
              ...item,
              subItems: item.subItems.filter(sub => sub.id !== 'requestOps'),
            };
          }
          return item;
        });
    }
    
    // Untuk role lainnya, sembunyikan menu material
    return allMenuItems.filter(item => item.id !== 'menu');
  }, [user, loading, pathname]);

  // This useEffect will now only run when the page path changes.
  // It sets the initial state of the sidebar for the current page
  // but will not interfere with manual opening/closing by the user.
  useEffect(() => {
    const path = pathname.toLowerCase();
    
    const findTabIdFromPath = (p: string): string => {
      // This is a reverse map from URL path segments to tab IDs
      if (p.endsWith('/dashboard')) return 'dashboard';
      if (p.endsWith('/site/details')) return 'siteDetail';
      if (p.endsWith('/site/preview')) return 'sitePreview';
      if (p.endsWith('/site/boq')) return 'boqDetails';
      if (p.endsWith('/ops/details')) return 'opsDetails';
      if (p.endsWith('/ops/approval')) return 'approvalRequest';
      if (p.endsWith('/ops/transfer')) return 'transferList';
      if (p.endsWith('/ops/history')) return 'opsHistory';
      if (p.endsWith('/ops/request')) return 'requestOps';
      if (p.endsWith('/task/import')) return 'importTask';
      if (p.endsWith('/task/history')) return 'taskHistory';
      if (p.endsWith('/recruitment/candidate-pool')) return 'candidatePool';
      if (p.endsWith('/recruitment/offering-letter-maker')) return 'offeringLetterMaker';
      if (p.endsWith('/recruitment/pkwt-maker')) return 'pkwtMaker';
      if (p.endsWith('/employee-management/employee-list')) return 'employeeList';
      if (p.endsWith('/employee-management/salary-list')) return 'salaryList';
      if (p.endsWith('/personal/employee-data')) return 'employeeData';
      if (p.endsWith('/personal/resignation')) return 'resignation';
      if (p.endsWith('/personal/salary')) return 'adjustmentSalary';
      if (p.endsWith('/personal/ticket')) return 'ticketRequest';
      if (p.endsWith('/settings/profile')) return 'profile';
      if (p.endsWith('/menu/do-dn-released')) return 'doDnReleased';
      if (p.endsWith('/menu/accessories')) return 'accessories';
      if (p.endsWith('/menu/inbound')) return 'inbound';
      if (p.endsWith('/menu/outbound')) return 'outbound';
      if (p.endsWith('/menu/request-material')) return 'requestMaterial';
      if (p.includes('/project/top/dashboard')) return 'dashboard';
      return ''; // Return empty if no match
    };

    const currentTabId = findTabIdFromPath(path);
    
    if (currentTabId) {
      setActiveTab(currentTabId);
    }

    const parentMenu = allMenuItems.find(item =>
      item.subItems?.some(sub => sub.id === currentTabId)
    );

    if (parentMenu) {
      setOpenSubmenus(prev => ({
        ...prev,
        [parentMenu.id]: true,
      }));
    }
  }, [pathname]);


  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} fixed top-0 left-0 h-screen bg-blue-900 text-white p-4 transition-all duration-300 z-20 flex flex-col`}> 
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute -right-3 top-9 bg-blue-900 rounded-full p-1 text-white hover:bg-blue-800 transition-colors"
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-white rounded mr-3 flex items-center justify-center">
            <img 
              src="/logo.jpeg" 
              alt="Ansinda Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-xl font-bold">PROJECT</h1>
              <p className="text-sm text-blue-200">ACI System</p>
            </div>
          )}
        </div>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {/* Parent menu item */}
            <button
              onClick={() => {
                if (item.subItems) {
                  toggleSubmenu(item.id);
                } else {
                  setActiveTab(item.id);
                  handleNavigation(item.id);
                }
              }}
              className={`w-full flex items-center p-3 rounded-lg transition-colors relative ${
                activeTab === item.id || (item.subItems && item.subItems.some((sub) => sub.id === activeTab))
                  ? 'bg-blue-800'
                  : 'hover:bg-blue-800'
              }`}
            >
              {item.icon}
              {isSidebarOpen && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span>{item.label}</span>
                    {/* Show notification dot on OPS menu */}
                    {item.id === 'ops' && pendingCount > 0 && (['/project/rpm', '/project/top'].some(prefix => pathname.startsWith(prefix))) && (
                      <NotificationDot 
                        count={pendingCount} 
                        size="sm" 
                        className="ml-2"
                      />
                    )}
                  </div>
                  {item.subItems && (openSubmenus[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </div>
              )}
              {/* Show notification dot on OPS menu when sidebar is collapsed */}
              {!isSidebarOpen && item.id === 'ops' && pendingCount > 0 && (['/project/rpm', '/project/top'].some(prefix => pathname.startsWith(prefix))) && (
                <NotificationDot 
                  count={pendingCount} 
                  size="sm" 
                  className="absolute -top-1 -right-1"
                />
              )}
            </button>

            {/* Submenu items */}
            {item.subItems && isSidebarOpen && openSubmenus[item.id] && (
              <div className="ml-6 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => {
                      setActiveTab(subItem.id);
                      handleNavigation(subItem.id);
                    }}
                    className={`w-full flex items-center p-2 pl-4 rounded-lg transition-colors text-sm ${
                      activeTab === subItem.id ? 'bg-blue-700' : 'hover:bg-blue-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{subItem.label}</span>
                      {/* Show notification dot on Approval Request submenu */}
                      {subItem.id === 'approvalRequest' && pendingCount > 0 && (['/project/rpm', '/project/top'].some(prefix => pathname.startsWith(prefix))) && (
                        <NotificationDot 
                          count={pendingCount} 
                          size="sm" 
                          className="ml-2"
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="flex-shrink-0 h-4"></div>
    </div>
  );
};

export default Sidebar;