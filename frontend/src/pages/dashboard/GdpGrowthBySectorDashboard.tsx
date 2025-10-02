/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Grid3X3,
  List,
  BarChart2,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  PieChart,
  ShoppingCart,
  Bus,
  Building2,
  Wallet,
  Utensils,
  School,
  StethoscopeIcon,
  Eye,
} from "lucide-react";
import gdpGrowthService, {
  type GdpGrowthBySector,
  type CreateGdpGrowthInput,
} from "../../services/GdpGrowthBySectorService";

type ViewMode = "table" | "grid" | "list";
type ModalMode = "create" | "edit" | "view" | null;

interface SubCategory {
  name: string;
  percentage: number;
  color: string;
  icon: string;
  description: string;
}

// Align sub-categories with backend subSectors
const serviceSubCategories: SubCategory[] = [
  { name: "Trade", percentage: 19, color: "#1E3A8A", icon: "cart", description: "Wholesale and retail trade services" },
  { name: "Transportation", percentage: 14, color: "#1E40AF", icon: "bus", description: "Transportation and logistics services" },
  { name: "Hotels and Restaurants", percentage: 5, color: "#312E81", icon: "restaurant", description: "Hospitality and food services" },
  { name: "Financial Services", percentage: 8, color: "#0F172A", icon: "account-balance-wallet", description: "Banking and financial institutions" },
  { name: "Government", percentage: 16, color: "#1E293B", icon: "account-balance", description: "Public administration services" },
  { name: "Health", percentage: 4, color: "#1E3A8A", icon: "medical-services", description: "Healthcare and medical services" },
  { name: "Education", percentage: 5, color: "#1E40AF", icon: "school", description: "Educational services and institutions" },
];

const agricultureSubCategories: SubCategory[] = [
  { name: "Livestock Products", percentage: 8, color: "#10B981", icon: "cow", description: "Cattle, poultry, and dairy production" },
  { name: "Export Crops", percentage: 3, color: "#047857", icon: "local-shipping", description: "Coffee, tea, and other export crops" },
  { name: "Forestry", percentage: 6, color: "#059669", icon: "tree", description: "Forest products and timber" },
  { name: "Food Crops", percentage: 4, color: "#065F46", icon: "grain", description: "Staple food crop production" },
];

const industrySubCategories: SubCategory[] = [
  { name: "Chemical and Plastic Products", percentage: 10, color: "#3B82F6", icon: "factory", description: "Chemical and plastic manufacturing" },
  { name: "Construction", percentage: 13, color: "#2563EB", icon: "construction", description: "Building and infrastructure" },
  { name: "Food Manufacture", percentage: 2, color: "#1E40AF", icon: "fastfood", description: "Food and beverage processing" },
  { name: "Textile & Clothing", percentage: 3, color: "#1E3A8A", icon: "tshirt-crew", description: "Textile and clothing manufacturing" },
];

const GdpGrowthBySectorDashboard: React.FC = () => {
  const [figures, setFigures] = useState<GdpGrowthBySector[]>([]);
  const [allFigures, setAllFigures] = useState<GdpGrowthBySector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof GdpGrowthBySector>("totalGdp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedFigure, setSelectedFigure] = useState<GdpGrowthBySector | null>(null);
  const [formData, setFormData] = useState<CreateGdpGrowthInput>({
    totalGdp: 0,
    servicesShare: 0,
    industryShare: 0,
    agricultureShare: 0,
    taxesShare: 8, // Default to backend's fixed taxesShare
    servicesSubShares: {},
    agricultureSubShares: {},
    industrySubShares: {},
  });
  const [modalAnimating, setModalAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadFigures = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gdpGrowthService.getAllRecords();
      setAllFigures(data);
      setFigures(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load GDP data");
      setAllFigures([]);
      setFigures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        try {
          const result = await gdpGrowthService.getRecordById(term);
          return result ? [result] : [];
        } catch (err: any) {
          setError(err.message || "Failed to search GDP data");
          return [];
        }
      }, 300),
    []
  );

  const handleFilterAndSort = useCallback(async () => {
    let filtered = [...allFigures];

    if (searchTerm.trim()) {
      filtered = await debouncedSearch(searchTerm);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy] ?? 0;
      const bValue = b[sortBy] ?? 0;
      return sortOrder === "asc"
        ? aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true })
        : bValue.toString().localeCompare(aValue.toString(), undefined, { numeric: true });
    });

    setFigures(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, allFigures, debouncedSearch]);

  useEffect(() => {
    loadFigures();
  }, [loadFigures]);

  useEffect(() => {
    handleFilterAndSort();
  }, [handleFilterAndSort]);

  const openModal = useCallback((mode: ModalMode, figure?: GdpGrowthBySector) => {
    setModalMode(mode);
    setModalAnimating(true);
    if (mode === "edit" && figure) {
      setSelectedFigure(figure);
      setFormData({
        totalGdp: figure.totalGdp,
        servicesShare: figure.servicesShare,
        industryShare: figure.industryShare,
        agricultureShare: figure.agricultureShare,
        taxesShare: figure.taxesShare,
        servicesSubShares: figure.servicesSubShares,
        agricultureSubShares: figure.agricultureSubShares,
        industrySubShares: figure.industrySubShares,
      });
    } else if (mode === "view" && figure) {
      setSelectedFigure(figure);
      setFormData({
        totalGdp: figure.totalGdp,
        servicesShare: figure.servicesShare,
        industryShare: figure.industryShare,
        agricultureShare: figure.agricultureShare,
        taxesShare: figure.taxesShare,
        servicesSubShares: figure.servicesSubShares,
        agricultureSubShares: figure.agricultureSubShares,
        industrySubShares: figure.industrySubShares,
      });
    } else {
      setSelectedFigure(null);
      setFormData({
        totalGdp: 0,
        servicesShare: 0,
        industryShare: 0,
        agricultureShare: 0,
        taxesShare: 8,
        servicesSubShares: {},
        agricultureSubShares: {},
        industrySubShares: {},
      });
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalAnimating(false);
    setTimeout(() => {
      setModalMode(null);
      setSelectedFigure(null);
      setFormData({
        totalGdp: 0,
        servicesShare: 0,
        industryShare: 0,
        agricultureShare: 0,
        taxesShare: 8,
        servicesSubShares: {},
        agricultureSubShares: {},
        industrySubShares: {},
      });
    }, 200);
  }, []);

  const validateFormData = (data: CreateGdpGrowthInput) => {
    const errors: string[] = [];
    if (data.totalGdp < 0) errors.push("Total GDP must be non-negative");
    if (data.servicesShare < 0) errors.push("Services share must be non-negative");
    if (data.industryShare < 0) errors.push("Industry share must be non-negative");
    if (data.agricultureShare < 0) errors.push("Agriculture share must be non-negative");
    if (data.taxesShare < 0) errors.push("Taxes share must be non-negative");

    const totalShare = data.servicesShare + data.industryShare + data.agricultureShare + data.taxesShare;
    if (Math.abs(totalShare - 100) > 0.01) {
      errors.push("Sectoral shares (Services, Industry, Agriculture, Taxes) must sum to 100%");
    }

    // Validate services sub-sectors
    Object.keys(data.servicesSubShares).forEach((key) => {
      if (!serviceSubCategories.map((sub) => sub.name).includes(key)) {
        errors.push(`Invalid services sub-sector: ${key}`);
      }
      if (data.servicesSubShares[key] < 0) {
        errors.push(`Services sub-sector ${key} percentage must be non-negative`);
      }
    });

    return errors;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validateFormData(formData);
      if (errors.length > 0) {
        setError(errors.join("; "));
        return;
      }

      try {
        setSubmitting(true);
        setError(null);

        if (modalMode === "create") {
          const newFigure = await gdpGrowthService.createRecord(formData);
          setAllFigures((prev) => [...prev, newFigure]);
        } else if (modalMode === "edit" && selectedFigure) {
          const updatedFigure = await gdpGrowthService.updateRecord(selectedFigure.id, formData);
          setAllFigures((prev) =>
            prev.map((fig) => (fig.id === selectedFigure.id ? updatedFigure : fig))
          );
        }

        closeModal();
      } catch (err: any) {
        setError(err.message || "Failed to save GDP data");
      } finally {
        setSubmitting(false);
      }
    },
    [modalMode, selectedFigure, formData, closeModal]
  );

  const handleDelete = useCallback(async (figure: GdpGrowthBySector) => {
    if (!confirm(`Are you sure you want to delete GDP record "${figure.id}"?`)) {
      return;
    }

    try {
      setError(null);
      await gdpGrowthService.deleteRecord(figure.id);
      setAllFigures((prev) => prev.filter((fig) => fig.id !== figure.id));
    } catch (err: any) {
      setError(err.message || "Failed to delete GDP data");
    }
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(figures.length / itemsPerPage),
    [figures, itemsPerPage]
  );

  const currentFigures = useMemo(
    () => figures.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [figures, currentPage, itemsPerPage]
  );

  const iconMap: { [key: string]: React.ElementType } = {
    cart: ShoppingCart,
    bus: Bus,
    "account-balance": Building2,
    "account-balance-wallet": Wallet,
    restaurant: Utensils,
    "medical-services": StethoscopeIcon,
    school: School,
    cow: PieChart, // Placeholder, as lucide-react doesn't have a cow icon
    tree: PieChart, // Placeholder, as lucide-react doesn't have a tree icon
    "local-shipping": PieChart,
    grain: PieChart,
    factory: PieChart,
    construction: PieChart,
    fastfood: PieChart,
    "tshirt-crew": PieChart,
  };

  const formatDate = (date?: Date) =>
    date ? new Date(date).toLocaleString() : "N/A";

  const renderModal = () => {
    if (!modalMode) return null;

    if (modalMode === "view") {
      return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${modalAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">View GDP Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Total GDP (RWF)</h4>
                  <p className="text-gray-900">{formData.totalGdp.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Taxes Share</h4>
                  <p className="text-gray-900">{formData.taxesShare.toFixed(2)}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Services Share</h4>
                  <p className="text-gray-900">{formData.servicesShare.toFixed(2)}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Agriculture Share</h4>
                  <p className="text-gray-900">{formData.agricultureShare.toFixed(2)}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Industry Share</h4>
                  <p className="text-gray-900">{formData.industryShare.toFixed(2)}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Created At</h4>
                  <p className="text-gray-900">{formatDate(selectedFigure?.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Updated At</h4>
                  <p className="text-gray-900">{formatDate(selectedFigure?.updatedAt)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Services Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="w-5 h-5 text-primary-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Services ({formData.servicesShare.toFixed(2)}%)</h4>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${Math.min(formData.servicesShare, 100)}%` }}></div>
                  </div>
                  <div className="space-y-2">
                    {serviceSubCategories.map((sub) => {
                      const Icon = iconMap[sub.icon] || PieChart;
                      return (
                        <div key={sub.name} className="flex items-center justify-between" title={sub.description}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" style={{ color: sub.color }} />
                            <span className="text-xs text-gray-700">{sub.name}</span>
                          </div>
                          <span className="text-xs text-gray-900">{(formData.servicesSubShares[sub.name] || sub.percentage).toFixed(2)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Agriculture Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <PieChart className="w-5 h-5 text-primary-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Agriculture ({formData.agricultureShare.toFixed(2)}%)</h4>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${Math.min(formData.agricultureShare, 100)}%` }}></div>
                  </div>
                  <div className="space-y-2">
                    {agricultureSubCategories.map((sub) => {
                      const Icon = iconMap[sub.icon] || PieChart;
                      return (
                        <div key={sub.name} className="flex items-center justify-between" title={sub.description}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" style={{ color: sub.color }} />
                            <span className="text-xs text-gray-700">{sub.name}</span>
                          </div>
                          <span className="text-xs text-gray-900">{(formData.agricultureSubShares[sub.name] || sub.percentage).toFixed(2)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Industry Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <PieChart className="w-5 h-5 text-primary-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Industry ({formData.industryShare.toFixed(2)}%)</h4>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${Math.min(formData.industryShare, 100)}%` }}></div>
                  </div>
                  <div className="space-y-2">
                    {industrySubCategories.map((sub) => {
                      const Icon = iconMap[sub.icon] || PieChart;
                      return (
                        <div key={sub.name} className="flex items-center justify-between" title={sub.description}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" style={{ color: sub.color }} />
                            <span className="text-xs text-gray-700">{sub.name}</span>
                          </div>
                          <span className="text-xs text-gray-900">{(formData.industrySubShares[sub.name] || sub.percentage).toFixed(2)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${modalAnimating ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">
              {modalMode === "create" ? "Create New GDP Record" : "Edit GDP Record"}
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="text-sm text-gray-600">
              Note: Services, Industry, Agriculture, and Taxes shares must sum to 100%.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total GDP (RWF)
                </label>
                <input
                  type="number"
                  value={formData.totalGdp}
                  onChange={(e) =>
                    setFormData({ ...formData, totalGdp: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter total GDP"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxes Share (%)
                </label>
                <input
                  type="number"
                  value={formData.taxesShare}
                  onChange={(e) =>
                    setFormData({ ...formData, taxesShare: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter taxes share"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services Share (%)
                </label>
                <input
                  type="number"
                  value={formData.servicesShare}
                  onChange={(e) =>
                    setFormData({ ...formData, servicesShare: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter services share"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agriculture Share (%)
                </label>
                <input
                  type="number"
                  value={formData.agricultureShare}
                  onChange={(e) =>
                    setFormData({ ...formData, agricultureShare: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter agriculture share"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Share (%)
                </label>
                <input
                  type="number"
                  value={formData.industryShare}
                  onChange={(e) =>
                    setFormData({ ...formData, industryShare: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter industry share"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Services Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Services ({formData.servicesShare.toFixed(2)}%)</h4>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${Math.min(formData.servicesShare, 100)}%` }}></div>
                </div>
                <div className="space-y-2">
                  {serviceSubCategories.map((sub) => {
                    const Icon = iconMap[sub.icon] || PieChart;
                    return (
                      <div key={sub.name} className="flex items-center justify-between gap-2" title={sub.description}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" style={{ color: sub.color }} />
                          <span className="text-xs text-gray-700">{sub.name}</span>
                        </div>
                        <input
                          type="number"
                          value={formData.servicesSubShares[sub.name] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              servicesSubShares: {
                                ...formData.servicesSubShares,
                                [sub.name]: Number(e.target.value),
                              },
                            })
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="%"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Agriculture Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <PieChart className="w-5 h-5 text-primary-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Agriculture ({formData.agricultureShare.toFixed(2)}%)</h4>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${Math.min(formData.agricultureShare, 100)}%` }}></div>
                </div>
                <div className="space-y-2">
                  {agricultureSubCategories.map((sub) => {
                    const Icon = iconMap[sub.icon] || PieChart;
                    return (
                      <div key={sub.name} className="flex items-center justify-between gap-2" title={sub.description}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" style={{ color: sub.color }} />
                          <span className="text-xs text-gray-700">{sub.name}</span>
                        </div>
                        <span className="text-xs text-gray-900">{sub.percentage.toFixed(2)}% (Fixed)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Industry Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <PieChart className="w-5 h-5 text-primary-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Industry ({formData.industryShare.toFixed(2)}%)</h4>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${Math.min(formData.industryShare, 100)}%` }}></div>
                </div>
                <div className="space-y-2">
                  {industrySubCategories.map((sub) => {
                    const Icon = iconMap[sub.icon] || PieChart;
                    return (
                      <div key={sub.name} className="flex items-center justify-between gap-2" title={sub.description}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" style={{ color: sub.color }} />
                          <span className="text-xs text-gray-700">{sub.name}</span>
                        </div>
                        <span className="text-xs text-gray-900">{sub.percentage.toFixed(2)}% (Fixed)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{submitting ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderActionButtons = (figure: GdpGrowthBySector) => (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => openModal("view", figure)}
        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
        title="View More"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => openModal("edit", figure)}
        className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(figure)}
        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">#</th>

              <th
                className="text-left py-2 px-2 cursor-pointer"
                onClick={() => {
                  setSortBy("totalGdp");
                  setSortOrder(
                    sortBy === "totalGdp" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Total GDP (RWF)</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 cursor-pointer"
                onClick={() => {
                  setSortBy("servicesShare");
                  setSortOrder(
                    sortBy === "servicesShare" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Services (%)</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 cursor-pointer"
                onClick={() => {
                  setSortBy("industryShare");
                  setSortOrder(
                    sortBy === "industryShare" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Industry (%)</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 cursor-pointer"
                onClick={() => {
                  setSortBy("agricultureShare");
                  setSortOrder(
                    sortBy === "agricultureShare" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Agriculture (%)</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 cursor-pointer"
                onClick={() => {
                  setSortBy("createdAt");
                  setSortOrder(
                    sortBy === "createdAt" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Created At</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentFigures.map((fig, index) => (
              <tr key={fig.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                
                <td className="py-2 px-2 text-gray-700">{fig.totalGdp.toFixed(2)}</td>
                <td className="py-2 px-2 text-gray-700">{fig.servicesShare.toFixed(2)}%</td>
                <td className="py-2 px-2 text-gray-700">{fig.industryShare.toFixed(2)}%</td>
                <td className="py-2 px-2 text-gray-700">{fig.agricultureShare.toFixed(2)}%</td>
                <td className="py-2 px-2 text-gray-700">{formatDate(fig.createdAt)}</td>
                <td className="py-2 px-2">{renderActionButtons(fig)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {currentFigures.map((fig) => (
        <div
          key={fig.id}
          className="bg-white border border-gray-200 rounded p-3 hover:shadow-sm relative group"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {renderActionButtons(fig)}
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary-100 rounded-full">
              <PieChart className="w-4 h-4 text-primary-600" />
            </div>
           
          </div>
          <p className="text-gray-800 font-semibold text-lg mb-1">
            {fig.totalGdp.toFixed(2)} RWF
          </p>
          <p className="text-xs text-gray-600">
            Services: {fig.servicesShare.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-600">
            Industry: {fig.industryShare.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-600">
            Agriculture: {fig.agricultureShare.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-600">
            Created: {formatDate(fig.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
      {currentFigures.map((fig) => (
        <div key={fig.id} className="px-4 py-3 flex justify-between items-center group">
          <div>
          
            <p className="text-xs text-gray-600">
              Services: {fig.servicesShare.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-600">
              Industry: {fig.industryShare.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-600">
              Agriculture: {fig.agricultureShare.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-600">
              Created: {formatDate(fig.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-900 font-semibold">
              {fig.totalGdp.toFixed(2)} RWF
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {renderActionButtons(fig)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => (
    <div className="flex items-center justify-between bg-white px-3 py-2 border-t border-gray-200">
      <div className="text-xs text-gray-600">
        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, figures?.length || 0)} of{" "}
        {figures?.length || 0}
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 border rounded text-xs disabled:opacity-50"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <span className="text-xs">{currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 border rounded text-xs disabled:opacity-50"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-xs">
      <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">GDP by Sector Dashboard</h1>
          <p className="text-xs text-gray-500">View GDP growth by sector at constant prices</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openModal("create")}
            className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Create</span>
          </button>
          <button
            onClick={loadFigures}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1.5 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white p-3 border border-gray-200 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="relative">
            <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1.5 border border-gray-200 rounded text-xs"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-") as [
                  keyof GdpGrowthBySector,
                  "asc" | "desc"
                ];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-200 rounded px-2 py-1.5 text-xs"
            >
              <option value="id-asc">ID (A–Z)</option>
              <option value="id-desc">ID (Z–A)</option>
              <option value="totalGdp-desc">Highest Total GDP</option>
              <option value="totalGdp-asc">Lowest Total GDP</option>
              <option value="servicesShare-desc">Highest Services Share</option>
              <option value="servicesShare-asc">Lowest Services Share</option>
              <option value="industryShare-desc">Highest Industry Share</option>
              <option value="industryShare-asc">Lowest Industry Share</option>
              <option value="agricultureShare-desc">Highest Agriculture Share</option>
              <option value="agricultureShare-asc">Lowest Agriculture Share</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>

            <div className="flex border border-gray-200 rounded">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 transition-colors ${
                  viewMode === "table"
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-3 h-3" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid3X3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <BarChart2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 bg-white border border-gray-200 rounded text-center">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
            Loading data...
          </div>
        ) : currentFigures.length === 0 ? (
          <div className="p-8 bg-white border border-gray-200 rounded text-center text-gray-500">
            {searchTerm ? "No GDP records found matching your search" : "No GDP records found. Click 'Create' to add your first record."}
          </div>
        ) : (
          <div>
            {viewMode === "table" && renderTableView()}
            {viewMode === "grid" && renderGridView()}
            {viewMode === "list" && renderListView()}
            {renderPagination()}
          </div>
        )}
      </div>

      {renderModal()}
    </div>
  );
};

// Debounce utility for search
const debounce = <F extends (...args: any[]) => any>(func: F, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), wait);
    });
  };
};

export default GdpGrowthBySectorDashboard;