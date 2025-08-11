import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import Select from "react-select";

const FilterOffcanvas = ({
  isOpen,
  onClose,
  columns,
  uniqueValues,
  filters,
  onFilterChange,
}) => {
  const formatHeaderLabel = (label) =>
    typeof label === "string"
      ? label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : String(label);

  // Initialize localFilters with Arrays of selected options
  const initialFilters = useMemo(() =>
    Object.fromEntries(
      columns
        .filter((col) => col.id !== "select")
        .map((col) => {
          const prevFilter = filters[col.id];
          const selectedArray =
            prevFilter && prevFilter.value
              ? Array.isArray(prevFilter.value)
                ? prevFilter.value
                : [prevFilter.value]
              : [];
          return [col.id, { value: selectedArray, type: "multiselect" }];
        })
    ),
    [filters, columns]
  );

  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const handleChange = (columnId, selectedOptions) => {
    // selectedOptions can be null or array of {value, label}
    const values = selectedOptions ? selectedOptions.map((o) => o.value) : [];
    setLocalFilters((prev) => ({
      ...prev,
      [columnId]: { value: values, type: "multiselect" },
    }));
  };

  const applyFilters = () => {
    // Pass filters with array values to parent
    const filtered = {};
    Object.entries(localFilters).forEach(([colId, filter]) => {
      if (filter.value && filter.value.length > 0) {
        filtered[colId] = { ...filter, value: filter.value };
      }
    });
    onFilterChange(filtered);
    onClose();
  };

  const clearAllFilters = () => {
    const cleared = Object.fromEntries(
      columns
        .filter((col) => col.id !== "select")
        .map((col) => [col.id, { value: [], type: "multiselect" }])
    );
    setLocalFilters(cleared);
    onFilterChange({});
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
  

      {/* Slide-over panel */}
      <section
        className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative w-screen max-w-md bg-white shadow-xl flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b flex-shrink-0">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-600"
              onClick={onClose}
              aria-label="Close filters"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
            {columns
              .filter((column) => column.id !== "select")
              .map((column) => {
                const options =
                  (uniqueValues[column.id] || []).map((val) => ({
                    label: String(val),
                    value: val,
                  })) || [];
                const selectedValues = localFilters[column.id]?.value || [];

                return (
                  <div key={column.id}>
                    <label
                      htmlFor={`filter-${column.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {formatHeaderLabel(column.header)}
                    </label>

                    <Select
                      inputId={`filter-${column.id}`}
                      options={options}
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      onChange={(selected) => handleChange(column.id, selected)}
                      value={options.filter((opt) =>
                        selectedValues.includes(opt.value)
                      )}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select or search..."
                      noOptionsMessage={() => "No options"}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>
                );
              })}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex gap-2 flex-shrink-0">
            <button
              type="button"
              className="flex-1 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-100"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
            <button
              type="button"
              className="flex-1 bg-indigo-600 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-indigo-700"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(FilterOffcanvas);