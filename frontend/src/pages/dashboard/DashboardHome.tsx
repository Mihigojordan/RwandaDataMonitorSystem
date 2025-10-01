import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Clock,
  Bell,
  Settings,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building2,
  Award,
  CheckCircle,
  DollarSign,
  BarChart2,
  Globe,
  PieChart
} from 'lucide-react';
import gdpGrowthService from '../../services/GdpGrowthBySectorService'; // Adjust path based on your file structure
import nationalFiguresService from '../../services/nationalFiguresService'; // Adjust path
import noPovertyTargetService from '../../services/noPovertyTargetService'; // Adjust path
interface TrendData {
  year: number;
  quarter: string;
  money: number;
}

interface YearData {
  year: number;
  quarter: string;
  money: number;
}

interface GDPData {
  id?: string;
  lastYear: YearData | null;
  currentYear: YearData | null;
  trends: TrendData[];
  createdAt?: string;
  updatedAt?: string;
}

interface GDPDataInput {
  lastYear: YearData | null;
  currentYear: YearData | null;
  trends: TrendData[];
}

type ViewMode = "table" | "grid" | "list";
type ModalMode = "create" | "edit" | "view" | null;

// Real service implementation using fetch
const gdpService = {
  getAll: async (): Promise<GDPData[]> => {
    try {
      const response = await fetch("http://localhost:8000/gdp-current-price", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error("Failed to fetch GDP data:", error);
      return [];
    }
  },

  findByName: async (id: string): Promise<GDPData[]> => {
    try {
      const response = await fetch(
        `http://localhost:8000/gdp-current-price?id=${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error("Failed to search GDP data:", error);
      return [];
    }
  },

  createFigure: async (data: Partial<GDPDataInput>): Promise<GDPData> => {
    try {
      const response = await fetch("http://localhost:8000/gdp-current-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to create GDP data: ${error.message}`);
    }
  },

  updateFigure: async (id: string, data: Partial<GDPDataInput>): Promise<GDPData> => {
    try {
      const response = await fetch(`http://localhost:8000/gdp-current-price/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to update GDP data: ${error.message}`);
    }
  },

  deleteFigure: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/gdp-current-price/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to delete GDP data: ${error.message}`);
    }
  },

  validateFigureData: (data: Partial<GDPDataInput>) => {
    const errors: string[] = [];
    if (data.lastYear && (data.lastYear.year < 1900 || data.lastYear.year > 2100 || !["Q1", "Q2", "Q3", "Q4"].includes(data.lastYear.quarter) || data.lastYear.money < 0))
      errors.push("Last year must have a valid year (1900–2100), quarter (Q1–Q4), and non-negative money");
    if (data.currentYear && (data.currentYear.year < 1900 || data.currentYear.year > 2100 || !["Q1", "Q2", "Q3", "Q4"].includes(data.currentYear.quarter) || data.currentYear.money < 0))
      errors.push("Current year must have a valid year (1900–2100), quarter (Q1–Q4), and non-negative money");
    if (data.trends?.some(t => t.year < 1900 || t.year > 2100 || !["Q1", "Q2", "Q3", "Q4"].includes(t.quarter) || t.money < 0))
      errors.push("Trend data must have valid years (1900–2100), quarters (Q1–Q4), and non-negative money");
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};


// --- Type Definitions (adapted from services) ---
interface GdpGrowthBySector {
  id: string;
  totalGdp: number;
  servicesShare: number;
  industryShare: number;
  agricultureShare: number;
  servicesSubShares: Record<string, number>;
  agricultureSubShares: Record<string, number>;
  industrySubShares: Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NationalFigure {
  id: string;
  indicatorName: string;
  money: number;
  year: number;
  quarter?: number | null;
  created_at?: string;
  updated_at?: string;
}

interface NoPovertyTarget {
  id?: string;
  targetName: string;
  targetDescription?: string;
  targetPercentage?: number;
  source?: string;
  trend?: { year: number; percentage: number }[];
  map?: { year: number; location: string; povertyRate: number }[];
  createdAt?: string;
  updatedAt?: string;
}

interface GDPData {
  id?: string;
  lastYear: { year: number; quarter: string; money: number } | null;
  currentYear: { year: number; quarter: string; money: number } | null;
  trends: { year: number; quarter: string; money: number }[];
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardData {
  gdpGrowths: GdpGrowthBySector[];
  nationalFigures: NationalFigure[];
  noPovertyTargets: NoPovertyTarget[];
  gdpCurrents: GDPData[];
  stats: {
    totalRecords: number;
    averageGDP: number;
    totalIndicators: number;
    recentUpdates: number;
    averagePovertyRate: number;
    totalSectors: number;
    growthRate: number;
    totalTrends: number;
  };
}

interface RecentUpdate {
  id: string;
  name: string;
  type: string;
  value: number;
  date: string;
}

interface PendingItem {
  id: string;
  name: string;
  type: string;
  value: number;
  status: 'recent' | 'updated' | 'new';
  date: string;
}

interface UpcomingItem {
  id: string;
  name: string;
  date: string;
  category: string;
}

interface SectorOverview {
  name: string;
  share: number;
  growth: string;
}

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  icon: React.FC<any>;
  color: string;
  trend: 'up' | 'down';
}

// --- Component ---
const DashboardHome: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    gdpGrowths: [],
    nationalFigures: [],
    noPovertyTargets: [],
    gdpCurrents: [],
    stats: {
      totalRecords: 0,
      averageGDP: 0,
      totalIndicators: 0,
      recentUpdates: 0,
      averagePovertyRate: 0,
      totalSectors: 0,
      growthRate: 0,
      totalTrends: 0,
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gdpGrowths, nationalFigures, noPovertyTargets, gdpCurrents] = await Promise.all([
          gdpGrowthService.getAllRecords(),
          nationalFiguresService.getAll(),
          noPovertyTargetService.getAll(),
          gdpService.getAll()
        ]);

        // Compute stats
        const totalRecords = gdpGrowths.length + nationalFigures.length + noPovertyTargets.length + gdpCurrents.length;
        const averageGDP = gdpGrowths.reduce((sum, g) => sum + g.totalGdp, 0) / (gdpGrowths.length || 1);
        const totalIndicators = nationalFigures.length;
        const recentUpdates = nationalFigures.filter(f => new Date(f.updated_at || f.created_at || '').getTime() > Date.now() - 30*24*60*60*1000).length;
        const averagePovertyRate = noPovertyTargets.reduce((sum, t) => sum + (t.targetPercentage || 0), 0) / (noPovertyTargets.length || 1);
        const totalSectors = gdpGrowths.reduce((set, g) => {
          Object.keys(g.servicesSubShares).forEach(k => set.add(k));
          Object.keys(g.industrySubShares).forEach(k => set.add(k));
          Object.keys(g.agricultureSubShares).forEach(k => set.add(k));
          return set;
        }, new Set<string>()).size;
        const growthRate = gdpCurrents.reduce((sum, g) => {
          const current = g.currentYear?.money || 0;
          const last = g.lastYear?.money || 0;
          return sum + (last ? ((current - last) / last * 100) : 0);
        }, 0) / (gdpCurrents.length || 1);
        const totalTrends = gdpCurrents.reduce((sum, g) => sum + g.trends.length, 0) + noPovertyTargets.reduce((sum, t) => sum + (t.trend?.length || 0), 0);

        setDashboardData({
          gdpGrowths,
          nationalFigures,
          noPovertyTargets,
          gdpCurrents,
          stats: {
            totalRecords,
            averageGDP: Math.round(averageGDP),
            totalIndicators,
            recentUpdates,
            averagePovertyRate: Math.round(averagePovertyRate),
            totalSectors,
            growthRate: Math.round(growthRate * 10) / 10,
            totalTrends,
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute derived data for display
  const recentUpdates: RecentUpdate[] = dashboardData.nationalFigures
    .sort((a, b) => new Date(b.updated_at || b.created_at || '').getTime() - new Date(a.updated_at || a.created_at || '').getTime())
    .slice(0, 3)
    .map(fig => ({
      id: fig.id,
      name: fig.indicatorName,
      type: 'National Figure',
      value: fig.money,
      date: fig.year.toString()
    }));

  const pendingItems: PendingItem[] = dashboardData.gdpGrowths
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || '').getTime() - new Date(a.updatedAt || a.createdAt || '').getTime())
    .slice(0, 3)
    .map(gdp => ({
      id: gdp.id,
      name: `GDP Growth ${gdp.id}`,
      type: 'Sector Growth',
      value: gdp.totalGdp,
      status: 'recent',
      date: new Date(gdp.updatedAt || gdp.createdAt || '').toLocaleDateString()
    }));

  const upcomingItems: UpcomingItem[] = dashboardData.noPovertyTargets
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || '').getTime() - new Date(a.updatedAt || a.createdAt || '').getTime())
    .slice(0, 3)
    .map(target => ({
      id: target.id || '',
      name: target.targetName,
      date: target.trend?.[0]?.year.toString() || 'N/A',
      category: 'Poverty Target'
    }));

  const sectorOverviews: SectorOverview[] = dashboardData.gdpGrowths.slice(0, 6).map(gdp => ({
    name: 'Services',
    share: gdp.servicesShare,
    growth: `+${Math.round(gdp.servicesShare * 0.05)}%` // Mocked growth for demo
  })).concat(dashboardData.gdpGrowths.slice(0, 6).map(gdp => ({
    name: 'Industry',
    share: gdp.industryShare,
    growth: `+${Math.round(gdp.industryShare * 0.03)}%`
  }))); // Simplified, adapt as needed

  const statsCards: StatCard[] = [
    {
      label: 'Total Records',
      value: dashboardData.stats.totalRecords,
      change: '+4.5%',
      icon: BarChart2,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Recent Updates',
      value: dashboardData.stats.recentUpdates,
      change: '+15%',
      icon: RefreshCw,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Average GDP',
      value: `$${dashboardData.stats.averageGDP.toLocaleString()}`,
      change: '+3.2%',
      icon: DollarSign,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Growth Rate',
      value: `${dashboardData.stats.growthRate}%`,
      change: '-1.5%',
      icon: TrendingUp,
      color: 'bg-primary-500',
      trend: 'down'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
          <span className="text-base text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Economic Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Overview of national economic indicators and GDP data.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last period</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Updates (adapted from Recent Hires) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Updates</h3>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUpdates.map((update) => (
                  <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{update.name}</p>
                        <p className="text-sm text-gray-500">{update.type}</p>
                        <p className="text-sm text-gray-400">${update.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-medium text-gray-900">{update.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All Indicators →
                </button>
              </div>
            </div>
          </div>

          {/* Pending Items (adapted from Leave Requests) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent GDP Items</h3>
                <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">
                    {pendingItems.length} Recent
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingItems.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.type} • ${item.value.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-sm px-2 py-1 rounded-lg ${
                          item.status === 'recent' 
                            ? 'bg-yellow-100 text-yellow-700'
                            : item.status === 'updated'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All GDP Data →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sector Overview (adapted from Department Overview) */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Sector Overview</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectorOverviews.map((sector, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <PieChart className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{sector.name}</p>
                          <p className="text-sm text-gray-500">{sector.share}% share</p>
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium">
                        {sector.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Items (adapted from Upcoming Birthdays) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Recent Poverty Targets</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Year: {item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All Targets →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;