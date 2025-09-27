/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  type NationalFigure,
  type NationalFigureData,

} from "../../services/nationalFiguresService"; // Add 'type' for type-only importsom "../../services/nationalFiguresService"; // Adjust path to your service
import nationalFiguresService from "../../services/nationalFiguresService"; // Default import
type ViewMode = "table" | "grid" | "list";
type ModalMode = "create" | "edit" | null;

const NationalFiguresDashboard: React.FC = () => {
  const [figures, setFigures] = useState<NationalFigure[]>([]);
  const [allFigures, setAllFigures] = useState<NationalFigure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof NationalFigure>("indicatorName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedFigure, setSelectedFigure] = useState<NationalFigure | null>(null);
  const [formData, setFormData] = useState<Partial<NationalFigureData>>({
    indicatorName: "",
    money: 0,
    year: new Date().getFullYear(),
    quarter: 1,
  });
  const [modalAnimating, setModalAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFigures();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allFigures]);

  const loadFigures = async () => {
    try {
      setLoading(true);
      const data = await nationalFiguresService.getAll();
      setAllFigures(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load national figures");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSort = async () => {
    let filtered = [...allFigures];

    if (searchTerm.trim()) {
      try {
        filtered = await nationalFiguresService.findByName(searchTerm);
      } catch (err: any) {
        setError(err.message || "Failed to search national figures");
        filtered = [];
      }
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
  };

  const openModal = (mode: ModalMode, figure?: NationalFigure) => {
    setModalMode(mode);
    setModalAnimating(true);
    if (mode === "edit" && figure) {
      setSelectedFigure(figure);
      setFormData({ ...figure });
    } else {
      setSelectedFigure(null);
      setFormData({
        indicatorName: "",
        money: 0,
        year: new Date().getFullYear(),
        quarter: 1,
      });
    }
  };

  const closeModal = () => {
    setModalAnimating(false);
    setTimeout(() => {
      setModalMode(null);
      setSelectedFigure(null);
      setFormData({
        indicatorName: "",
        money: 0,
        year: new Date().getFullYear(),
        quarter: 1,
      });
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate data using service
    const validation = nationalFiguresService.validateFigureData({
      indicatorName: formData.indicatorName || "",
      money: formData.money || 0,
      year: formData.year || new Date().getFullYear(),
      quarter: formData.quarter || undefined,
    });

    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (modalMode === "create") {
        const newFigure = await nationalFiguresService.createFigure(formData);
        setAllFigures([...allFigures, newFigure]);
      } else if (modalMode === "edit" && selectedFigure) {
        const updatedFigure = await nationalFiguresService.updateFigure(
          selectedFigure.id!,
          formData
        );
        setAllFigures(
          allFigures.map((fig) =>
            fig.id === selectedFigure.id ? updatedFigure : fig
          )
        );
      }

      closeModal();
    } catch (err: any) {
      setError(err.message || "Failed to save figure");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (figure: NationalFigure) => {
    if (!confirm(`Are you sure you want to delete "${figure.indicatorName}"?`)) {
      return;
    }

    try {
      setError(null);
      await nationalFiguresService.deleteFigure(figure.id!);
      setAllFigures(allFigures.filter((fig) => fig.id !== figure.id));
    } catch (err: any) {
      setError(err.message || "Failed to delete figure");
    }
  };

  const totalPages = Math.ceil(figures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFigures = figures.slice(startIndex, startIndex + itemsPerPage);

  const renderModal = () => {
    if (!modalMode) return null;

    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${modalAnimating ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white rounded-lg w-full max-w-md transform transition-all duration-200 ${modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
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

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Indicator Name
              </label>
              <input
                type="text"
                value={formData.indicatorName || ""}
                onChange={(e) => setFormData({ ...formData, indicatorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter indicator name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value ($)
              </label>
              <input
                type="number"
                value={formData.money || ""}
                onChange={(e) => setFormData({ ...formData, money: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter value"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year || ""}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1900"
                  max="2100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quarter
                </label>
                <select
                  value={formData.quarter || ""}
                  onChange={(e) => setFormData({ ...formData, quarter: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Quarter</option>
                  <option value="1">Q1</option>
                  <option value="2">Q2</option>
                  <option value="3">Q3</option>
                  <option value="4">Q4</option>
                </select>
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

  const renderActionButtons = (figure: NationalFigure) => (
    <div className="flex items-center space-x-1">
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
                  setSortBy("indicatorName");
                  setSortOrder(
                    sortBy === "indicatorName" && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Indicator</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left py-2 px-2">Value</th>
              <th className="text-left py-2 px-2">Year</th>
              <th className="text-left py-2 px-2">Quarter</th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentFigures.map((fig, index) => (
              <tr key={fig.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2">{startIndex + index + 1}</td>
                <td className="py-2 px-2 font-medium text-gray-900">{fig.indicatorName}</td>
                <td className="py-2 px-2 text-gray-700">${fig.money.toLocaleString()}</td>
                <td className="py-2 px-2 text-gray-700">{fig.year}</td>
                <td className="py-2 px-2 text-gray-700">{fig.quarter ?? "—"}</td>
                <td className="py-2 px-2">{renderActionButtons(fig)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
              {fig.indicatorName}
            </h4>
          </div>
          <p className="text-gray-800 font-semibold text-lg mb-1">
            ${fig.money.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>
              {fig.year} Q{fig.quarter ?? "—"}
            </span>
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
            <h4 className="font-medium text-gray-900">{fig.indicatorName}</h4>
            <p className="text-xs text-gray-600">
              {fig.year} • Q{fig.quarter ?? "—"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-900 font-semibold">
              ${fig.money.toLocaleString()}
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
        Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, figures.length)} of{" "}
        {figures.length}
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
          <h1 className="text-lg font-semibold text-gray-900">National Figures Dashboard</h1>
          <p className="text-xs text-gray-500">View key national economic indicators</p>
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
        {/* Search and Controls */}
        <div className="bg-white p-3 border border-gray-200 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="relative">
            <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search indicators..."
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
                  keyof NationalFigure,
                  "asc" | "desc"
                ];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-200 rounded px-2 py-1.5 text-xs"
            >
              <option value="indicatorName-asc">Indicator (A–Z)</option>
              <option value="indicatorName-desc">Indicator (Z–A)</option>
              <option value="money-desc">Highest Value</option>
              <option value="money-asc">Lowest Value</option>
              <option value="year-desc">Newest Year</option>
              <option value="year-asc">Oldest Year</option>
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

        {/* Content */}
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
            {searchTerm ? "No indicators found matching your search" : "No indicators found. Click 'Create' to add your first figure."}
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

export default NationalFiguresDashboard;