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
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Eye,
} from "lucide-react";

// Define interfaces for the GDP data
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

const GDPFiguresDashboard: React.FC = () => {
  const [figures, setFigures] = useState<GDPData[]>([]);
  const [allFigures, setAllFigures] = useState<GDPData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof GDPData | "currentYear.money">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedFigure, setSelectedFigure] = useState<GDPData | null>(null);
  const [formData, setFormData] = useState<Partial<GDPDataInput>>({
    lastYear: null,
    currentYear: null,
    trends: [],
  });
  const [modalAnimating, setModalAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State for new trend entry
  const [newTrend, setNewTrend] = useState<{ year: string; quarter: string; money: string }>({
    year: "",
    quarter: "",
    money: "",
  });

  const loadFigures = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gdpService.getAll();
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
          const searchResults = await gdpService.findByName(term);
          return Array.isArray(searchResults) ? searchResults : [];
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
      if (sortBy === "currentYear.money") {
        const aValue = a.currentYear?.money ?? 0;
        const bValue = b.currentYear?.money ?? 0;
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortBy === "lastYear.money") {
        const aValue = a.lastYear?.money ?? 0;
        const bValue = b.lastYear?.money ?? 0;
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        const aValue = a[sortBy as keyof GDPData] ?? "";
        const bValue = b[sortBy as keyof GDPData] ?? "";
        return sortOrder === "asc"
          ? aValue.toString().localeCompare(bValue.toString())
          : bValue.toString().localeCompare(aValue.toString());
      }
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

  const openModal = useCallback((mode: ModalMode, figure?: GDPData) => {
    setModalMode(mode);
    setModalAnimating(true);
    if (mode === "edit" && figure) {
      setSelectedFigure(figure);
      setFormData({
        lastYear: figure.lastYear,
        currentYear: figure.currentYear,
        trends: figure.trends,
      });
    } else if (mode === "view" && figure) {
      setSelectedFigure(figure);
      setFormData({
        lastYear: figure.lastYear,
        currentYear: figure.currentYear,
        trends: figure.trends,
      });
    } else {
      setSelectedFigure(null);
      setFormData({
        lastYear: null,
        currentYear: null,
        trends: [],
      });
    }
    setNewTrend({ year: "", quarter: "", money: "" });
  }, []);

  const closeModal = useCallback(() => {
    setModalAnimating(false);
    setTimeout(() => {
      setModalMode(null);
      setSelectedFigure(null);
      setFormData({
        lastYear: null,
        currentYear: null,
        trends: [],
      });
      setNewTrend({ year: "", quarter: "", money: "" });
    }, 200);
  }, []);

  const addTrend = useCallback(() => {
    if (newTrend.year && newTrend.quarter && newTrend.money) {
      const year = Number(newTrend.year);
      const money = Number(newTrend.money);
      const quarter = newTrend.quarter;
      if (year >= 1900 && year <= 2100 && ["Q1", "Q2", "Q3", "Q4"].includes(quarter) && money >= 0) {
        setFormData((prev) => ({
          ...prev,
          trends: [...(prev.trends || []), { year, quarter, money }],
        }));
        setNewTrend({ year: "", quarter: "", money: "" });
      } else {
        setError("Trend year must be between 1900 and 2100, quarter must be Q1–Q4, and money must be non-negative");
      }
    }
  }, [newTrend]);

  const removeTrend = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      trends: (prev.trends || []).filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validation = gdpService.validateFigureData(formData);

      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      try {
        setSubmitting(true);
        setError(null);

        if (modalMode === "create") {
          const newFigure = await gdpService.createFigure(formData);
          setAllFigures((prev) => [...prev, newFigure]);
        } else if (modalMode === "edit" && selectedFigure) {
          const updatedFigure = await gdpService.updateFigure(
            selectedFigure.id!,
            formData
          );
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

  const handleDelete = useCallback(async (figure: GDPData) => {
    if (!confirm(`Are you sure you want to delete GDP record "${figure.id}"?`)) {
      return;
    }

    try {
      setError(null);
      await gdpService.deleteFigure(figure.id!);
      setAllFigures((prev) => prev.filter((fig) => fig.id !== figure.id));
    } catch (err: any) {
      setError(err.message || "Failed to delete GDP data");
    }
  }, []);

  const totalPages = useMemo(
    () => (figures ? Math.ceil(figures.length / itemsPerPage) : 1),
    [figures, itemsPerPage]
  );

  const currentFigures = useMemo(
    () => (figures ? figures.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : []),
    [figures, currentPage, itemsPerPage]
  );

  const getLatestTrend = useCallback((trends: TrendData[]): string => {
    if (!trends?.length) return "—";
    const latest = trends.reduce((max, item) => {
      if (item.year > max.year) return item;
      if (item.year === max.year) {
        const quarters = ["Q1", "Q2", "Q3", "Q4"];
        return quarters.indexOf(item.quarter) > quarters.indexOf(max.quarter) ? item : max;
      }
      return max;
    }, trends[0]);
    return `${latest.money} (${latest.year} ${latest.quarter})`;
  }, []);

  const renderModal = () => {
    if (!modalMode) return null;

    if (modalMode === "view") {
      return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${modalAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
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
              <div>
                <h4 className="text-sm font-medium text-gray-700">ID</h4>
                <p className="text-gray-900">{selectedFigure?.id || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Last Year</h4>
                <p className="text-gray-900">
                  {formData.lastYear ? `${formData.lastYear.money} (${formData.lastYear.year} ${formData.lastYear.quarter})` : "—"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Current Year</h4>
                <p className="text-gray-900">
                  {formData.currentYear ? `${formData.currentYear.money} (${formData.currentYear.year} ${formData.currentYear.quarter})` : "—"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Trend Data</h4>
                {formData.trends?.length ? (
                  <ul className="list-disc pl-5 text-gray-900">
                    {formData.trends.map((trend, index) => (
                      <li key={index}>
                        {trend.year} {trend.quarter}: {trend.money}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-900">No trend data available</p>
                )}
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
        <div className={`bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Year
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.lastYear?.year || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastYear: { ...formData.lastYear, year: Number(e.target.value) },
                    })
                  }
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Year"
                  min="1900"
                  max="2100"
                />
                <select
                  value={formData.lastYear?.quarter || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastYear: { ...formData.lastYear, quarter: e.target.value },
                    })
                  }
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Quarter</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                <input
                  type="number"
                  value={formData.lastYear?.money || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastYear: { ...formData.lastYear, money: Number(e.target.value) },
                    })
                  }
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Money"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Year
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.currentYear?.year || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentYear: { ...formData.currentYear, year: Number(e.target.value) },
                    })
                  }
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Year"
                  min="1900"
                  max="2100"
                />
                <select
                  value={formData.currentYear?.quarter || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentYear: { ...formData.currentYear, quarter: e.target.value },
                    })
                  }
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Quarter</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                <input
                  type="number"
                  value={formData.currentYear?.money || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentYear: { ...formData.currentYear, money: Number(e.target.value) },
                    })
                  }
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Money"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trend Data
              </label>
              <div className="space-y-2 mb-2">
                {formData.trends?.map((trend, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{trend.year} {trend.quarter}: {trend.money}</span>
                    <button
                      type="button"
                      onClick={() => removeTrend(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={newTrend.year}
                  onChange={(e) => setNewTrend({ ...newTrend, year: e.target.value })}
                  className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Year"
                  min="1900"
                  max="2100"
                />
                <select
                  value={newTrend.quarter}
                  onChange={(e) => setNewTrend({ ...newTrend, quarter: e.target.value })}
                  className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Quarter</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                <input
                  type="number"
                  value={newTrend.money}
                  onChange={(e) => setNewTrend({ ...newTrend, money: e.target.value })}
                  className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Money"
                  min="0"
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={addTrend}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Trend
                </button>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
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

  const renderActionButtons = (figure: GDPData) => (
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
        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
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
                  setSortBy("id");
                  setSortOrder(
                    sortBy === "id" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 cursor-pointer"
                onClick={() => {
                  setSortBy("lastYear.money");
                  setSortOrder(
                    sortBy === "lastYear.money" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Year</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 cursor-pointer"
                onClick={() => {
                  setSortBy("currentYear.money");
                  setSortOrder(
                    sortBy === "currentYear.money" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Current Year</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left py-2 px-2">Latest Trend</th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentFigures.map((fig, index) => (
              <tr key={fig.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="py-2 px-2 font-medium text-gray-900">{fig.id}</td>
                <td className="py-2 px-2 text-gray-700">
                  {fig.lastYear ? `${fig.lastYear.money} (${fig.lastYear.year} ${fig.lastYear.quarter})` : "—"}
                </td>
                <td className="py-2 px-2 text-gray-700">
                  {fig.currentYear ? `${fig.currentYear.money} (${fig.currentYear.year} ${fig.currentYear.quarter})` : "—"}
                </td>
                <td className="py-2 px-2 text-gray-700">{getLatestTrend(fig.trends)}</td>
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
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChart2 className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 text-xs truncate pr-12">
              {fig.id}
            </h4>
          </div>
          <p className="text-gray-800 font-semibold text-lg mb-1">
            {fig.currentYear ? `${fig.currentYear.money}` : "—"}
          </p>
          <p className="text-xs text-gray-600">
            Last: {fig.lastYear ? `${fig.lastYear.money} (${fig.lastYear.year} ${fig.lastYear.quarter})` : "—"}
          </p>
          <p className="text-xs text-gray-600 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{getLatestTrend(fig.trends)}</span>
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
            <h4 className="font-medium text-gray-900">{fig.id}</h4>
            <p className="text-xs text-gray-600">
              Last: {fig.lastYear ? `${fig.lastYear.money} (${fig.lastYear.year} ${fig.lastYear.quarter})` : "—"}
            </p>
            <p className="text-xs text-gray-600">{getLatestTrend(fig.trends)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-900 font-semibold">
              {fig.currentYear ? `${fig.currentYear.money}` : "—"}
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
          <h1 className="text-lg font-semibold text-gray-900">GDP Figures Dashboard</h1>
          <p className="text-xs text-gray-500">View key GDP indicators</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openModal("create")}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
                  keyof GDPData | "currentYear.money",
                  "asc" | "desc"
                ];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-200 rounded px-2 py-1.5 text-xs"
            >
              <option value="id-asc">ID (A–Z)</option>
              <option value="id-desc">ID (Z–A)</option>
              <option value="lastYear.money-desc">Highest Last Year Money</option>
              <option value="lastYear.money-asc">Lowest Last Year Money</option>
              <option value="currentYear.money-desc">Highest Current Year Money</option>
              <option value="currentYear.money-asc">Lowest Current Year Money</option>
            </select>

            <div className="flex border border-gray-200 rounded">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 transition-colors ${
                  viewMode === "table"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-3 h-3" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid3X3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-600"
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
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
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

export default GDPFiguresDashboard;