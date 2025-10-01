import React, { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  User,
  X,
  Briefcase,
  User2,
  PieChart,
  ChevronDown,
  ChevronUp,
  Building,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAdminAuth from "../../context/AdminAuthContext";
import Logo from '../../assets/logo.png';

interface SidebarProps {
  isOpen?: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  isDropdown?: boolean;
  children?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  // Auto-open dropdowns based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const gdpPages = [
      "/admin/dashboard/gdp-current-price",
      "/admin/dashboard/GDPSharesData",
       "/admin/dashboard/gdp-growth-by-sector",
    ];
    const nationalFiguresPages = [
      "/admin/dashboard/national-figures-management",
      ...gdpPages,
    ];

    const SDG = [
      "/admin/dashboard/nopoverty-management"
    ]

    const newOpenDropdowns = new Set<string>();
    if (gdpPages.includes(currentPath)) {
      newOpenDropdowns.add("nationalFigures");
      newOpenDropdowns.add("gdp");
    } else if (nationalFiguresPages.includes(currentPath)) {
      newOpenDropdowns.add("nationalFigures");
    }
    else if(SDG.includes(currentPath)){
      newOpenDropdowns.add('SDG')
    }

    setOpenDropdowns(newOpenDropdowns);
  }, [location.pathname]);

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dropdownId)) {
        newSet.delete(dropdownId);
      } else {
        newSet.add(dropdownId);
      }
      return newSet;
    });
  };

  const navlinks: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard Overview",
      icon: TrendingUp,
      path: "/admin/dashboard",
    },
    {
      id: "nationalFigures",
      label: "National Figures Management",
      icon: PieChart,
      isDropdown: true,
      children: [
          {
      id: "departments",
      label: "National Figures Management",
      icon: Building,
      path: "/admin/dashboard/national-figures-management",
    },
        {
          id: "gdp",
          label: "GDP",
          icon: TrendingUp,
          isDropdown: true,
          children: [
            {
              id: "gdp-current-price",
              label: "GDP in Billons at Current Market Price",
              icon: Briefcase,
              path: "/admin/dashboard/gdp-current-price",
            },
            {
              id: "GDPSharesData",
              label: "GDP Shares By Sector In Percentages",
              icon: User2,
              path: "/admin/dashboard/GDPSharesData",
            },
            {
              id: "GDPGrowthData",
              label: "GDP Growth By Sectors at Constant Price",
              icon: User2,
              path: "/admin/dashboard/gdp-growth-by-sector",
            },
          ],
        },
      ],
    },
  
    {
      id: "SDG",
      label: "Rwanda SDG's",
      icon: Users,
      isDropdown:true,
      children:[
         {
      id: "noPoverty",
      label: "No Poverty Management",
      icon: Users,
      path: "/admin/dashboard/nopoverty-management",
    },
    
      ]
    },
  ];

  const checkIfActive = (item: NavItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some((child) => checkIfActive(child));
    }
    return false;
  };

  const renderMenuItem = (item: NavItem, level: number = 0) => {
    const Icon = item.icon;
    const isActive = item.path ? location.pathname === item.path : false;
    const hasActiveChild = checkIfActive(item);

    if (item.isDropdown) {
      const isOpen = openDropdowns.has(item.id);

      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleDropdown(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 group ${
              level === 0 
                ? hasActiveChild
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                : hasActiveChild
                  ? "bg-primary-100 text-primary-700 border-l-2 border-primary-600"
                  : "text-gray-600 hover:bg-primary-50 hover:text-primary-600 border-l-2 border-transparent hover:border-primary-300"
            }`}
            style={{ marginLeft: level > 0 ? `${level * 12}px` : '0' }}
          >
            <div className="flex items-center space-x-3">
              <Icon
                className={`w-4 h-4 ${
                  level === 0
                    ? hasActiveChild ? "text-white" : "text-gray-500 group-hover:text-primary-600"
                    : hasActiveChild ? "text-primary-700" : "text-gray-500 group-hover:text-primary-600"
                }`}
              />
              <span className={`text-sm font-medium ${level > 0 ? 'text-xs' : ''}`}>{item.label}</span>
            </div>
            <div className="transition-transform duration-200">
              {isOpen ? (
                <ChevronUp
                  className={`w-4 h-4 ${
                    level === 0
                      ? hasActiveChild ? "text-white" : "text-gray-500 group-hover:text-primary-600"
                      : hasActiveChild ? "text-primary-700" : "text-gray-500 group-hover:text-primary-600"
                  }`}
                />
              ) : (
                <ChevronDown
                  className={`w-4 h-4 ${
                    level === 0
                      ? hasActiveChild ? "text-white" : "text-gray-500 group-hover:text-primary-600"
                      : hasActiveChild ? "text-primary-700" : "text-gray-500 group-hover:text-primary-600"
                  }`}
                />
              )}
            </div>
          </button>
          {isOpen && (
            <div className={`space-y-1 ${level === 0 ? 'mt-1' : 'ml-2'}`}>
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path!}
        end
        className={({ isActive }) =>
          `w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
            level === 0
              ? isActive
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
              : isActive
                ? "bg-primary-100 text-primary-700 border-l-3 border-primary-600 font-medium"
                : "text-gray-600 hover:bg-primary-50 hover:text-primary-600 border-l-2 border-transparent hover:border-primary-300"
          }`
        }
        style={{ marginLeft: level > 0 ? `${level * 12}px` : '0' }}
        onClick={() => {
          if (window.innerWidth < 1024) onToggle();
        }}
      >
        <Icon
          className={`w-4 h-4 ${
            level === 0
              ? isActive ? "text-white" : "text-gray-500 group-hover:text-primary-600"
              : isActive ? "text-primary-700" : "text-gray-500 group-hover:text-primary-600"
          }`}
        />
        <span className={`text-sm font-medium ${level > 0 ? 'text-xs' : ''}`}>{item.label}</span>
      </NavLink>
    );
  };

  const handleNavigateProfile = () => {
    navigate("/admin/dashboard/profile", { replace: true });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 min-h-screen bg-white flex flex-col border-r border-gray-200 shadow-xl transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-96 overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center space-x-3">
           <div className="h-12 rounded-lg flex items-center justify-center">
                  <img src={Logo} alt="NISR Logo" className="w-full h-full object-contain" />
                </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <X className="w-5 h-5 text-primary-600" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {navlinks.length > 0 ? (
              navlinks.map((item) => renderMenuItem(item, 0))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No menu items available</p>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div
          className="p-4 border-t border-gray-200 cursor-pointer bg-gradient-to-r from-primary-50 to-primary-100"
          onClick={handleNavigateProfile}
        >
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-200 border border-primary-100">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.full_name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@example.com"}
              </p>
              <p className="text-xs text-primary-600 font-medium">
                {user?.role?.name || "No Role"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;