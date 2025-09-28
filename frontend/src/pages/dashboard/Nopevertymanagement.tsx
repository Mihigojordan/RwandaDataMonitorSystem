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

// Define interfaces for the property management data
interface TrendData {
  year: number;
  percentage: number;
}

interface MapData {
  year: number;
  location: string;
  povertyRate: number;
}

interface PropertyFigure {
  id?: string;
  targetName: string;
  targetDescription: string;
  targetPercentage: number;
  source: string;
  trend: TrendData[];
  map: MapData[];
  createdAt?: string;
  updatedAt?: string;
}

interface PropertyFigureData {
  targetName: string;
  targetDescription: string;
  targetPercentage: number;
  source: string;
  trend: TrendData[];
  map: MapData[];
}

type ViewMode = "table" | "grid" | "list";
type ModalMode = "create" | "edit" | "view" | null;

// Real service implementation using fetch
const propertyFiguresService = {
  getAll: async (): Promise<PropertyFigure[]> => {
    try {
      const response = await fetch("http://localhost:8000/no-poverty-targets", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error("Failed to fetch figures:", error);
      return [];
    }
  },

  findByName: async (name: string): Promise<PropertyFigure[]> => {
    try {
      const response = await fetch(
        `http://localhost:8000/no-poverty-targets?name=${encodeURIComponent(name)}`,
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
      console.error("Failed to search figures:", error);
      return [];
    }
  },

  createFigure: async (data: Partial<PropertyFigureData>): Promise<PropertyFigure> => {
    try {
      const response = await fetch("http://localhost:8000/no-poverty-targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to create figure: ${error.message}`);
    }
  },

  updateFigure: async (id: string, data: Partial<PropertyFigureData>): Promise<PropertyFigure> => {
    try {
      const response = await fetch(`http://localhost:8000/no-poverty-targets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to update figure: ${error.message}`);
    }
  },

  deleteFigure: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/no-poverty-targets/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to delete figure: ${error.message}`);
    }
  },

  validateFigureData: (data: Partial<PropertyFigureData>) => {
    const errors: string[] = [];
    if (!data.targetName?.trim()) errors.push("Target name is required");
    if (data.targetPercentage == null || data.targetPercentage < 0 || data.targetPercentage > 100)
      errors.push("Target percentage must be between 0 and 100");
    if (!data.source?.trim()) errors.push("Source is required");
    if (data.trend?.some(t => t.year < 1900 || t.year > 2100 || t.percentage < 0 || t.percentage > 100))
      errors.push("Trend data must have valid years (1900–2100) and percentages (0–100)");
    if (data.map?.some(m => m.year < 1900 || m.year > 2100 || m.povertyRate < 0 || m.povertyRate > 100 || !m.location?.trim()))
      errors.push("Map data must have valid years (1900–2100), percentages (0–100), and non-empty locations");
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

const PropertyFiguresDashboard: React.FC = () => {
  const [figures, setFigures] = useState<PropertyFigure[]>([]);
  const [allFigures, setAllFigures] = useState<PropertyFigure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof PropertyFigure>("targetName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedFigure, setSelectedFigure] = useState<PropertyFigure | null>(null);
  const [formData, setFormData] = useState<Partial<PropertyFigureData>>({
    targetName: "",
    targetDescription: "",
    targetPercentage: 0,
    source: "",
    trend: [],
    map: [],
  });
  const [modalAnimating, setModalAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State for new trend and map entries
  const [newTrend, setNewTrend] = useState<{ year: string; percentage: string }>({ year: "", percentage: "" });
  const [newMap, setNewMap] = useState<{ year: string; location: string; povertyRate: string }>({ year: "", location: "", povertyRate: "" });

  const loadFigures = useCallback(async () => {
    try {
      setLoading(true);
      const data = await propertyFiguresService.getAll();
      setAllFigures(data);
      setFigures(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load property figures");
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
          const searchResults = await propertyFiguresService.findByName(term);
          return Array.isArray(searchResults) ? searchResults : [];
        } catch (err: any) {
          setError(err.message || "Failed to search property figures");
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
      const aValue = a[sortBy] ?? "";
      const bValue = b[sortBy] ?? "";
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else {
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

  const openModal = useCallback((mode: ModalMode, figure?: PropertyFigure) => {
    setModalMode(mode);
    setModalAnimating(true);
    if (mode === "edit" && figure) {
      setSelectedFigure(figure);
      setFormData({
        targetName: figure.targetName,
        targetDescription: figure.targetDescription,
        targetPercentage: figure.targetPercentage,
        source: figure.source,
        trend: figure.trend,
        map: figure.map,
      });
    } else if (mode === "view" && figure) {
      setSelectedFigure(figure);
      setFormData({
        targetName: figure.targetName,
        targetDescription: figure.targetDescription,
        targetPercentage: figure.targetPercentage,
        source: figure.source,
        trend: figure.trend,
        map: figure.map,
      });
    } else {
      setSelectedFigure(null);
      setFormData({
        targetName: "",
        targetDescription: "",
        targetPercentage: 0,
        source: "",
        trend: [],
        map: [],
      });
    }
    setNewTrend({ year: "", percentage: "" });
    setNewMap({ year: "", location: "", povertyRate: "" });
  }, []);

  const closeModal = useCallback(() => {
    setModalAnimating(false);
    setTimeout(() => {
      setModalMode(null);
      setSelectedFigure(null);
      setFormData({
        targetName: "",
        targetDescription: "",
        targetPercentage: 0,
        source: "",
        trend: [],
        map: [],
      });
      setNewTrend({ year: "", percentage: "" });
      setNewMap({ year: "", location: "", povertyRate: "" });
    }, 200);
  }, []);

  const addTrend = useCallback(() => {
    if (newTrend.year && newTrend.percentage) {
      const year = Number(newTrend.year);
      const percentage = Number(newTrend.percentage);
      if (year >= 1900 && year <= 2100 && percentage >= 0 && percentage <= 100) {
        setFormData((prev) => ({
          ...prev,
          trend: [...(prev.trend || []), { year, percentage }],
        }));
        setNewTrend({ year: "", percentage: "" });
      } else {
        setError("Trend year must be between 1900 and 2100, and percentage between 0 and 100");
      }
    }
  }, [newTrend]);

  const removeTrend = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      trend: (prev.trend || []).filter((_, i) => i !== index),
    }));
  }, []);

  const addMap = useCallback(() => {
    if (newMap.year && newMap.location && newMap.povertyRate) {
      const year = Number(newMap.year);
      const povertyRate = Number(newMap.povertyRate);
      if (year >= 1900 && year <= 2100 && povertyRate >= 0 && povertyRate <= 100 && newMap.location.trim()) {
        setFormData((prev) => ({
          ...prev,
          map: [...(prev.map || []), { year, location: newMap.location, povertyRate }],
        }));
        setNewMap({ year: "", location: "", povertyRate: "" });
      } else {
        setError("Map year must be between 1900 and 2100, poverty rate between 0 and 100, and location must not be empty");
      }
    }
  }, [newMap]);

  const removeMap = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      map: (prev.map || []).filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validation = propertyFiguresService.validateFigureData(formData);

      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      try {
        setSubmitting(true);
        setError(null);

        if (modalMode === "create") {
          const newFigure = await propertyFiguresService.createFigure(formData);
          setAllFigures((prev) => [...prev, newFigure]);
        } else if (modalMode === "edit" && selectedFigure) {
          const updatedFigure = await propertyFiguresService.updateFigure(
            selectedFigure.id!,
            formData
          );
          setAllFigures((prev) =>
            prev.map((fig) => (fig.id === selectedFigure.id ? updatedFigure : fig))
          );
        }

        closeModal();
      } catch (err: any) {
        setError(err.message || "Failed to save figure");
      } finally {
        setSubmitting(false);
      }
    },
    [modalMode, selectedFigure, formData, closeModal]
  );

  const handleDelete = useCallback(async (figure: PropertyFigure) => {
    if (!confirm(`Are you sure you want to delete "${figure.targetName}"?`)) {
      return;
    }

    try {
      setError(null);
      await propertyFiguresService.deleteFigure(figure.id!);
      setAllFigures((prev) => prev.filter((fig) => fig.id !== figure.id));
    } catch (err: any) {
      setError(err.message || "Failed to delete figure");
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

  const getLatestTrend = useCallback((trend: TrendData[]): string => {
    if (!trend?.length) return "—";
    const latest = trend.reduce((max, item) => (item.year > max.year ? item : max), trend[0]);
    return `${latest.percentage}% (${latest.year})`;
  }, []);

  const renderModal = () => {
    if (!modalMode) return null;

    if (modalMode === "view") {
      return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${modalAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">View Figure Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Target Name</h4>
                <p className="text-gray-900">{formData.targetName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Description</h4>
                <p className="text-gray-900">{formData.targetDescription || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Target Percentage</h4>
                <p className="text-gray-900">{formData.targetPercentage}%</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Source</h4>
                <p className="text-gray-900">{formData.source}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Trend Data</h4>
                {formData.trend?.length ? (
                  <ul className="list-disc pl-5 text-gray-900">
                    {formData.trend.map((trend, index) => (
                      <li key={index}>
                        {trend.year}: {trend.percentage}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-900">No trend data available</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Map Data</h4>
                {formData.map?.length ? (
                  <ul className="list-disc pl-5 text-gray-900">
                    {formData.map.map((map, index) => (
                      <li key={index}>
                        {map.location} ({map.year}): {map.povertyRate}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-900">No map data available</p>
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
              {modalMode === "create" ? "Create New Figure" : "Edit Figure"}
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Name
              </label>
              <input
                type="text"
                value={formData.targetName || ""}
                onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter target name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Description
              </label>
              <textarea
                value={formData.targetDescription || ""}
                onChange={(e) => setFormData({ ...formData, targetDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Percentage (%)
              </label>
              <input
                type="number"
                value={formData.targetPercentage || ""}
                onChange={(e) => setFormData({ ...formData, targetPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter target percentage"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <input
                type="text"
                value={formData.source || ""}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter source"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trend Data
              </label>
              <div className="space-y-2 mb-2">
                {formData.trend?.map((trend, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{trend.year}: {trend.percentage}%</span>
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
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Year"
                  min="1900"
                  max="2100"
                />
                <input
                  type="number"
                  value={newTrend.percentage}
                  onChange={(e) => setNewTrend({ ...newTrend, percentage: e.target.value })}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Percentage"
                  min="0"
                  max="100"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Map Data
              </label>
              <div className="space-y-2 mb-2">
                {formData.map?.map((map, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{map.location} ({map.year}): {map.povertyRate}%</span>
                    <button
                      type="button"
                      onClick={() => removeMap(index)}
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
                  value={newMap.year}
                  onChange={(e) => setNewMap({ ...newMap, year: e.target.value })}
                  className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Year"
                  min="1900"
                  max="2100"
                />
                <input
                  type="text"
                  value={newMap.location}
                  onChange={(e) => setNewMap({ ...newMap, location: e.target.value })}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Location"
                />
                <input
                  type="number"
                  value={newMap.povertyRate}
                  onChange={(e) => setNewMap({ ...newMap, povertyRate: e.target.value })}
                  className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Poverty Rate"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={addMap}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Map
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
                onClick={handleSubmit}
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
          </div>
        </div>
      </div>
    );
  };

  const renderActionButtons = (figure: PropertyFigure) => (
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
                  setSortBy("targetName");
                  setSortOrder(
                    sortBy === "targetName" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Target Name</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left py-2 px-2">Target %</th>
              <th className="text-left py-2 px-2">Source</th>
              <th className="text-left py-2 px-2">Latest Trend</th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentFigures.map((fig, index) => (
              <tr key={fig.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="py-2 px-2 font-medium text-gray-900">{fig.targetName}</td>
                <td className="py-2 px-2 text-gray-700">{fig.targetPercentage}%</td>
                <td className="py-2 px-2 text-gray-700">{fig.source}</td>
                <td className="py-2 px-2 text-gray-700">{getLatestTrend(fig.trend)}</td>
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
              {fig.targetName}
            </h4>
          </div>
          <p className="text-gray-800 font-semibold text-lg mb-1">
            {fig.targetPercentage}%
          </p>
          <p className="text-xs text-gray-600">{fig.source}</p>
          <p className="text-xs text-gray-600 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{getLatestTrend(fig.trend)}</span>
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
            <h4 className="font-medium text-gray-900">{fig.targetName}</h4>
            <p className="text-xs text-gray-600">{fig.source}</p>
            <p className="text-xs text-gray-600">{getLatestTrend(fig.trend)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-900 font-semibold">{fig.targetPercentage}%</span>
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
          <h1 className="text-lg font-semibold text-gray-900">Property Figures Dashboard</h1>
          <p className="text-xs text-gray-500">View key property management indicators</p>
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
              placeholder="Search targets..."
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
                  keyof PropertyFigure,
                  "asc" | "desc"
                ];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-200 rounded px-2 py-1.5 text-xs"
            >
              <option value="targetName-asc">Target Name (A–Z)</option>
              <option value="targetName-desc">Target Name (Z–A)</option>
              <option value="targetPercentage-desc">Highest Percentage</option>
              <option value="targetPercentage-asc">Lowest Percentage</option>
              <option value="source-asc">Source (A–Z)</option>
              <option value="source-desc">Source (Z–A)</option>
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
            {searchTerm ? "No targets found matching your search" : "No targets found. Click 'Create' to add your first figure."}
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

export default PropertyFiguresDashboard;