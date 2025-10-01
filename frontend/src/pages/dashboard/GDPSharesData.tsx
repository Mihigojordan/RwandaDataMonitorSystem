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
  Eye,
} from "lucide-react";

// Define interfaces for the GDP share data
interface GDPSectorData {
  id?: string;
  totalGdp: number;
  servicesShare: number;
  industryShare: number;
  agricultureShare: number;
  taxesShare: number;
  privateSector: number;
  governmentSector: number;
  imports: number;
  exports: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GDPSectorDataInput {
  totalGdp: number;
  servicesShare: number;
  industryShare: number;
  agricultureShare: number;
  taxesShare: number;
  privateSector: number;
  governmentSector: number;
  imports: number;
  exports: number;
}

type ViewMode = "table" | "grid" | "list";
type ModalMode = "create" | "edit" | "view" | null;

// Real service implementation using fetch
const gdpService = {
  getAll: async (): Promise<GDPSectorData[]> => {
    try {
      const response = await fetch("http://localhost:8000/gdp-shares", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error("Failed to fetch GDP share data:", error);
      return [];
    }
  },
  findById: async (id: string): Promise<GDPSectorData[]> => {
    try {
      const response = await fetch(
        `http://localhost:8000/gdp-shares?id=${encodeURIComponent(id)}`,
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
      console.error("Failed to search GDP share data:", error);
      return [];
    }
  },
  createFigure: async (data: Partial<GDPSectorDataInput>): Promise<GDPSectorData> => {
    try {
      const response = await fetch("http://localhost:8000/gdp-shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to create GDP share data: ${error.message}`);
    }
  },
  updateFigure: async (id: string, data: Partial<GDPSectorDataInput>): Promise<GDPSectorData> => {
    try {
      const response = await fetch(`http://localhost:8000/gdp-shares/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to update GDP share data: ${error.message}`);
    }
  },
  deleteFigure: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/gdp-shares/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to delete GDP share data: ${error.message}`);
    }
  },
  validateFigureData: (data: Partial<GDPSectorDataInput>) => {
    const errors: string[] = [];
    if (data.totalGdp && data.totalGdp < 0) {
      errors.push("Total GDP must be non-negative");
    }
    if (
      data.servicesShare != null &&
      data.industryShare != null &&
      data.agricultureShare != null &&
      data.taxesShare != null
    ) {
      const totalShare =
        data.servicesShare + data.industryShare + data.agricultureShare + data.taxesShare;
      if (totalShare !== 100) {
        errors.push("Sector shares (services, industry, agriculture, taxes) must sum to 100%");
      }
      if (
        data.servicesShare < 0 ||
        data.industryShare < 0 ||
        data.agricultureShare < 0 ||
        data.taxesShare < 0
      ) {
        errors.push("Sector shares must be non-negative");
      }
    }
    if (data.privateSector && data.privateSector < 0) {
      errors.push("Private sector must be non-negative");
    }
    if (data.governmentSector && data.governmentSector < 0) {
      errors.push("Government sector must be non-negative");
    }
    if (data.imports && data.imports < 0) {
      errors.push("Imports must be non-negative");
    }
    if (data.exports && data.exports < 0) {
      errors.push("Exports must be non-negative");
    }
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

const GDPSectorDashboard: React.FC = () => {
  const [figures, setFigures] = useState<GDPSectorData[]>([]);
  const [allFigures, setAllFigures] = useState<GDPSectorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof GDPSectorData>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedFigure, setSelectedFigure] = useState<GDPSectorData | null>(null);
  const [formData, setFormData] = useState<Partial<GDPSectorDataInput>>({
    totalGdp: 0,
    servicesShare: 0,
    industryShare: 0,
    agricultureShare: 0,
    taxesShare: 0,
    privateSector: 0,
    governmentSector: 0,
    imports: 0,
    exports: 0,
  });
  const [modalAnimating, setModalAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadFigures = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gdpService.getAll();
      setAllFigures(data);
      setFigures(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load GDP share data");
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
          const searchResults = await gdpService.findById(term);
          return Array.isArray(searchResults) ? searchResults : [];
        } catch (err: any) {
          setError(err.message || "Failed to search GDP share data");
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
      }
      return sortOrder === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
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

  const openModal = useCallback((mode: ModalMode, figure?: GDPSectorData) => {
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
        privateSector: figure.privateSector,
        governmentSector: figure.governmentSector,
        imports: figure.imports,
        exports: figure.exports,
      });
    } else if (mode === "view" && figure) {
      setSelectedFigure(figure);
      setFormData({
        totalGdp: figure.totalGdp,
        servicesShare: figure.servicesShare,
        industryShare: figure.industryShare,
        agricultureShare: figure.agricultureShare,
        taxesShare: figure.taxesShare,
        privateSector: figure.privateSector,
        governmentSector: figure.governmentSector,
        imports: figure.imports,
        exports: figure.exports,
      });
    } else {
      setSelectedFigure(null);
      setFormData({
        totalGdp: 0,
        servicesShare: 0,
        industryShare: 0,
        agricultureShare: 0,
        taxesShare: 0,
        privateSector: 0,
        governmentSector: 0,
        imports: 0,
        exports: 0,
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
        taxesShare: 0,
        privateSector: 0,
        governmentSector: 0,
        imports: 0,
        exports: 0,
      });
    }, 200);
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
        setError(err.message || "Failed to save GDP share data");
      } finally {
        setSubmitting(false);
      }
    },
    [modalMode, selectedFigure, formData, closeModal]
  );

  const handleDelete = useCallback(async (figure: GDPSectorData) => {
    if (!confirm(`Are you sure you want to delete GDP share record "${figure.id}"?`)) {
      return;
    }
    try {
      setError(null);
      await gdpService.deleteFigure(figure.id!);
      setAllFigures((prev) => prev.filter((fig) => fig.id !== figure.id));
    } catch (err: any) {
      setError(err.message || "Failed to delete GDP share data");
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

  const renderModal = () => {
    if (!modalMode) return null;
    if (modalMode === "view") {
      return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${modalAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">View GDP Share Details</h3>
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
                <h4 className="text-sm font-medium text-gray-700">Total GDP</h4>
                <p className="text-gray-900">{formData.totalGdp || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Services Share (%)</h4>
                <p className="text-gray-900">{formData.servicesShare || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Industry Share (%)</h4>
                <p className="text-gray-900">{formData.industryShare || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Agriculture Share (%)</h4>
                <p className="text-gray-900">{formData.agricultureShare || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Taxes Share (%)</h4>
                <p className="text-gray-900">{formData.taxesShare || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Private Sector</h4>
                <p className="text-gray-900">{formData.privateSector || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Government Sector</h4>
                <p className="text-gray-900">{formData.governmentSector || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Imports</h4>
                <p className="text-gray-900">{formData.imports || "—"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Exports</h4>
                <p className="text-gray-900">{formData.exports || "—"}</p>
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
              {modalMode === "create" ? "Create New GDP Share Record" : "Edit GDP Share Record"}
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
                Total GDP
              </label>
              <input
                type="number"
                value={formData.totalGdp || ""}
                onChange={(e) =>
                  setFormData({ ...formData, totalGdp: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Total GDP"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services Share (%)
              </label>
              <input
                type="number"
                value={formData.servicesShare || ""}
                onChange={(e) =>
                  setFormData({ ...formData, servicesShare: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Services Share"
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
                value={formData.industryShare || ""}
                onChange={(e) =>
                  setFormData({ ...formData, industryShare: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Industry Share"
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
                value={formData.agricultureShare || ""}
                onChange={(e) =>
                  setFormData({ ...formData, agricultureShare: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Agriculture Share"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxes Share (%)
              </label>
              <input
                type="number"
                value={formData.taxesShare || ""}
                onChange={(e) =>
                  setFormData({ ...formData, taxesShare: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Taxes Share"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Private Sector
              </label>
              <input
                type="number"
                value={formData.privateSector || ""}
                onChange={(e) =>
                  setFormData({ ...formData, privateSector: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Private Sector"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Government Sector
              </label>
              <input
                type="number"
                value={formData.governmentSector || ""}
                onChange={(e) =>
                  setFormData({ ...formData, governmentSector: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Government Sector"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imports
              </label>
              <input
                type="number"
                value={formData.imports || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imports: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Imports"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exports
              </label>
              <input
                type="number"
                value={formData.exports || ""}
                onChange={(e) =>
                  setFormData({ ...formData, exports: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Exports"
                min="0"
                step="0.1"
              />
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

  const renderActionButtons = (figure: GDPSectorData) => (
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
                  setSortBy("totalGdp");
                  setSortOrder(
                    sortBy === "totalGdp" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Total GDP</span>
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
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentFigures.map((fig, index) => (
              <tr key={fig.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="py-2 px-2 font-medium text-gray-900">{fig.id}</td>
                <td className="py-2 px-2 text-gray-700">{fig.totalGdp}</td>
                <td className="py-2 px-2 text-gray-700">{fig.servicesShare}%</td>
                <td className="py-2 px-2 text-gray-700">{fig.industryShare}%</td>
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
            {fig.totalGdp}
          </p>
          <p className="text-xs text-gray-600">
            Services: {fig.servicesShare}%
          </p>
          <p className="text-xs text-gray-600">
            Industry: {fig.industryShare}%
          </p>
          <p className="text-xs text-gray-600">
            Agriculture: {fig.agricultureShare}%
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
              Services: {fig.servicesShare}%
            </p>
            <p className="text-xs text-gray-600">
              Industry: {fig.industryShare}%
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-900 font-semibold">
              {fig.totalGdp}
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
          <h1 className="text-lg font-semibold text-gray-900">GDP Sector Shares Dashboard</h1>
          <p className="text-xs text-gray-500">View GDP distribution by sector</p>
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
                  keyof GDPSectorData,
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
            {searchTerm ? "No GDP share records found matching your search" : "No GDP share records found. Click 'Create' to add your first record."}
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

export default GDPSectorDashboard;