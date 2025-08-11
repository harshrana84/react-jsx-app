import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { debounce } from 'lodash'; // Make sure to install lodash if not already
import { Filter, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FilterOffcanvas from './FilterOffcanvas';

const DiamondList = () => {
    const { props } = usePage();
    const data = useMemo(() => props.diamonds || [], [props.diamonds]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(33);
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [alert, setAlert] = useState({ visible: false, message: '', type: 'success' });
    const [filters, setFilters] = useState({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const tableWrapperRef = useRef(null);

    const breadcrumbs = [
        {
            title: 'Stock List Master',
            href: '/orders',
        },
    ];

    const showAlert = (message, type = 'success', ms = 2200) => {
        setAlert({ visible: true, message, type });
        setTimeout(() => setAlert((s) => ({ ...s, visible: false })), ms);
    };

    const formatHeaderLabel = (label) => {
        return label.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));
    };

    const sanitizeForTsv = (value) => {
        if (value === null || value === undefined) return '';
        let s = String(value);
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
            s = formatDate(value);
        } else if (typeof value === 'object') {
            s = JSON.stringify(value);
        }
        return s.replace(/\t/g, ' ').replace(/\r\n/g, ' ').replace(/\n/g, ' ');
    };

    const columns = useMemo(() => {
        if (!data.length) return [];
        const selectColumn = {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected?.() ?? false}
                    onChange={table.getToggleAllPageRowsSelectedHandler?.()}
                    aria-label="Select all rows "
                    className="cursor-poi accent-emerald-800"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected?.() ?? false}
                    onChange={row.getToggleSelectedHandler?.()}
                    aria-label={`Select row ${row.id}`}
                    className="cursor-poi accent-emerald-800"
                />
            ),
        };
        const dynamicCols = Object.keys(data[0]).map((key) => ({
            accessorKey: key,
            id: key,
            header: formatHeaderLabel(key),
            cell: (info) => {
                const val = info.getValue();
                if (val === null || val === undefined || val === '') return '—';

                // If column is stock_id, make it a clickable link
                if (key === 'stock_id') {
                    return (
                        <Link href={route('diamonds.show', info.row.original.id)} className="text-blue-600 hover:underline">
                            {val}
                        </Link>
                    );
                }

                if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
                    return formatDate(val);
                }
                return String(val);
            },
        }));
        return [selectColumn, ...dynamicCols];
    }, [data]);

    const getUniqueValues = (columnId) => {
        const values = new Set();
        data.forEach((row) => {
            const value = row[columnId];
            if (value !== null && value !== undefined) {
                values.add(value);
            }
        });
        return Array.from(values);
    };

    const uniqueValues = useMemo(() => {
        const values = {};
        columns.forEach((column) => {
            if (column.id !== 'select') {
                values[column.id] = getUniqueValues(column.id);
            }
        });
        return values;
    }, [data, columns]);

    // Debounce search input
    const handleSearchChange = debounce((e) => {
        setSearch(e.target.value);
    }, 300);

    const filteredData = useMemo(() => {
        if (!search && Object.keys(filters).length === 0) return data;
        let filtered = [...data];
        // Apply search filter
        if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter((row) => Object.values(row).join(' ').toLowerCase().includes(q));
        }
        // Apply column filters
        Object.entries(filters).forEach(([columnId, filter]) => {
            if (filter.value && filter.value.length > 0) {
                filtered = filtered.filter((row) => {
                    const cellValue = row[columnId];
                    if (cellValue === null || cellValue === undefined) return false;
                    const cellText = String(cellValue).toLowerCase();
                    // filter.value is array of selected values
                    return filter.value.some((fval) => fval.toLowerCase() === cellText);
                });
            }
        });

        return filtered;
    }, [data, search, filters]);

    const handleRowSelectionChange = useCallback((newSelection) => {
        setRowSelection(newSelection);
    }, []);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { sorting, rowSelection },
        onSortingChange: setSorting,
        onRowSelectionChange: handleRowSelectionChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        getRowId: (row) => String(row.id),
    });

    const rowModel = table.getRowModel().rows;
    const pageCount = Math.max(1, Math.ceil(rowModel.length / pageSize));
    const paginatedRows = rowModel.slice(page * pageSize, (page + 1) * pageSize);

    useEffect(() => setPage(0), [search, pageSize, filters]);

    const copySelectedRowsToClipboard = async () => {
        const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
        if (selectedIds.length === 0) {
            showAlert('No rows selected to copy', 'error');
            return;
        }
        const selectedRowsData = selectedIds
            .map((id) => table.getRowModel().rows.find((r) => r.id === id))
            .filter(Boolean)
            .map((r) => r.original);
        if (!selectedRowsData.length) {
            showAlert('No valid rows to copy', 'error');
            return;
        }
        const visibleCols = table.getAllLeafColumns().filter((col) => col.getIsVisible && col.getIsVisible() && col.id !== 'select');
        if (visibleCols.length === 0) {
            showAlert('No visible columns to export', 'error');
            return;
        }
        const headers = visibleCols.map((col) => (typeof col.columnDef.header === 'string' ? col.columnDef.header : formatHeaderLabel(col.id)));
        const rows = selectedRowsData.map((row) =>
            visibleCols
                .map((col) => {
                    const key = col.columnDef.accessorKey ?? col.id;
                    return sanitizeForTsv(row?.[key]);
                })
                .join('\t'),
        );
        const tsv = [headers.join('\t'), ...rows].join('\r\n');
        try {
            await navigator.clipboard.writeText(tsv);
            showAlert(`${selectedRowsData.length} row(s) copied — paste into Excel/Sheets`, 'success');
        } catch {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = tsv;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
                showAlert(`${selectedRowsData.length} row(s) copied — paste into Excel/Sheets`, 'success');
            } catch {
                showAlert('Failed to copy to clipboard', 'error');
            }
        }
    };

    useEffect(() => {
        const onKeyDown = (e) => {
            const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
            if (!isCopy) return;
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
            const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
            if (selectedIds.length === 0) return;
            e.preventDefault();
            copySelectedRowsToClipboard();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [rowSelection, table]);

    // Logic for column width calculation
    const [colWidths, setColWidths] = useState({});
    const [measurementTrigger, setMeasurementTrigger] = useState(0);

    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;
        const tableEl = wrapper.querySelector('table');
        if (!tableEl) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const tableStyle = window.getComputedStyle(tableEl);
        const font = `${tableStyle.fontSize} ${tableStyle.fontFamily}`;
        ctx.font = font;
        const visibleCols = table.getAllLeafColumns().filter((c) => c.getIsVisible && c.getIsVisible());
        const sampleRows = filteredData.slice(0, 1000);
        const paddingPx = 28;
        const MIN = 60;
        const MAX = 800;
        const newWidths = {};
        visibleCols.forEach((col) => {
            if (col.id === 'select') {
                newWidths[col.id] = '48px';
                return;
            }
            const headerLabel = typeof col.columnDef.header === 'string' ? col.columnDef.header : formatHeaderLabel(col.id);
            let maxPx = ctx.measureText(headerLabel).width;
            const key = col.columnDef.accessorKey ?? col.id;
            for (let i = 0; i < sampleRows.length; i++) {
                const raw = sampleRows[i]?.[key];
                if (raw === undefined || raw === null) continue;
                let display = String(raw);
                if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(raw)) {
                    display = formatDate(raw);
                } else if (typeof raw === 'object') {
                    display = JSON.stringify(raw);
                }
                display = display.replace(/\t/g, ' ').replace(/\r\n/g, ' ').replace(/\n/g, ' ');
                const w = ctx.measureText(display).width;
                if (w > maxPx) maxPx = w;
            }
            const finalPx = Math.min(MAX, Math.max(MIN, Math.ceil(maxPx + paddingPx)));
            newWidths[col.id] = `${finalPx}px`;
        });
        setColWidths(newWidths);
    }, [
        filteredData,
        table,
        columns,
        JSON.stringify(table.getAllLeafColumns().map((c) => ({ id: c.id, vis: c.getIsVisible ? c.getIsVisible() : true }))),
        measurementTrigger,
        tableWrapperRef.current,
    ]);

    useEffect(() => {
        let timer = null;
        const onResize = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                if (tableWrapperRef.current) {
                    setMeasurementTrigger((t) => t + 1);
                }
            }, 150);
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            if (timer) clearTimeout(timer);
        };
    }, []);

    const visibleColumnsOrdered = useMemo(() => table.getAllLeafColumns().filter((c) => c.getIsVisible && c.getIsVisible()), [table]);

    const handleFilterChange = (newFilters) => {
        const appliedFilters = {};
        Object.entries(newFilters).forEach(([columnId, filter]) => {
            if (filter.value) {
                appliedFilters[columnId] = filter;
            }
        });
        setFilters(appliedFilters);
    };

    const removeFilter = (columnId) => {
        const newFilters = { ...filters };
        delete newFilters[columnId];
        setFilters(newFilters);
    };

    // -------- Totals logic START --------
    const normalizedTotalKeys = useMemo(() => ['carat', 'rap_price', 'per_ct', 'total', 'sale_per_ct', 'sale_total'].map((k) => k.toLowerCase()), []);

    const normalizeKey = (k) =>
        String(k || '')
            .toLowerCase()
            .replace(/[_\s]/g, '');

    const normalizedTargetSet = useMemo(() => new Set(normalizedTotalKeys.map((k) => k.replace(/[_\s]/g, ''))), [normalizedTotalKeys]);

    const parseNumeric = (v) => {
        if (v === null || v === undefined || v === '') return 0;
        if (typeof v === 'number') return Number(v) || 0;
        const s = String(v)
            .replace(/,/g, '')
            .replace(/[^0-9.\-]/g, '');
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : 0;
    };

    const totals = useMemo(() => {
        const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
        const sourceRows =
            selectedIds.length > 0
                ? table
                      .getRowModel()
                      .rows.filter((r) => selectedIds.includes(r.id))
                      .map((r) => r.original)
                : filteredData;
        const sums = {};
        normalizedTargetSet.forEach((nk) => {
            sums[nk] = 0;
        });
        for (let i = 0; i < sourceRows.length; i++) {
            const row = sourceRows[i];
            Object.keys(row).forEach((rawKey) => {
                const nk = normalizeKey(rawKey);
                if (normalizedTargetSet.has(nk)) {
                    sums[nk] = (sums[nk] || 0) + parseNumeric(row[rawKey]);
                }
            });
        }
        return {
            sums,
            count: sourceRows.length,
            selectedCount: selectedIds.length,
            usingSelection: selectedIds.length > 0,
        };
    }, [rowSelection, filteredData, table, normalizedTargetSet]);
    // -------- Totals logic END --------

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Diamond Inventory" />
            {alert.visible && (
                <div
                    className={`fixed top-4 right-4 z-50 rounded px-4 py-2 shadow-md ${
                        alert.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                    }`}
                    role="status"
                    aria-live="polite"
                >
                    {alert.message}
                </div>
            )}
            <div className="space-y-4 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => handleSearchChange(e)}
                            className="w-full rounded border px-3 py-2 md:w-64"
                        />
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="fw-bold flex cursor-pointer items-center gap-2 rounded border bg-slate-100 px-3 py-2 hover:bg-slate-200 dark:bg-zinc-800"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div>
                            <label className="mr-2 font-medium">Rows per page:</label>
                            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="rounded border px-2 py-1">
                                {[5, 10, 20, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={copySelectedRowsToClipboard}
                            className="cursor-copy rounded border bg-slate-100 px-3 py-1 hover:bg-slate-200 dark:bg-zinc-800"
                        >
                            Copy selected
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="rounded border px-3 py-1">Columns</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
                                {table.getAllLeafColumns().map((column) =>
                                    column.id === 'select' ? null : (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible ? column.getIsVisible() : true}
                                            onCheckedChange={(checked) => column.toggleVisibility && column.toggleVisibility(Boolean(checked))}
                                        >
                                            {typeof column.columnDef.header === 'string' ? column.columnDef.header : formatHeaderLabel(column.id)}
                                        </DropdownMenuCheckboxItem>
                                    ),
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                    {Object.entries(filters).map(([columnId, filter]) => (
                        <div key={columnId} className="flex items-center rounded bg-gray-200 px-2 py-1">
                            <span className="text-xs">
                                {columnId}: {filter.value}
                            </span>
                            <button onClick={() => removeFilter(columnId)} className="ml-2">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <div ref={tableWrapperRef} className="overflow-hidden rounded-lg border">
                    <div className="w-full max-w-[1785px] overflow-hidden">
                        <Table className="table-fixed">
                            <colgroup>
                                {visibleColumnsOrdered.map((col) => (
                                    <col key={col.id} style={{ width: colWidths[col.id] ?? undefined }} />
                                ))}
                            </colgroup>
                            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800">
                                <TableRow
                                    key="totals-row"
                                    className="sticky top-0 z-20 bg-emerald-800 font-semibold hover:bg-emerald-900 dark:bg-teal-900"
                                >
                                    {visibleColumnsOrdered.map((col) => {
                                        if (col.id === 'select') {
                                            return (
                                                <TableHead key={col.id} className="px-2 py-2 text-sm text-white">
                                                    {totals.usingSelection ? `Selected (${totals.selectedCount})` : `Grand Total (${totals.count})`}
                                                </TableHead>
                                            );
                                        }
                                        const key = col.columnDef.accessorKey ?? col.id;
                                        const nk = normalizeKey(key);
                                        if (normalizedTargetSet.has(nk)) {
                                            const value = totals.sums[nk] ?? 0;
                                            const formatted = Number(value.toFixed(4)).toLocaleString(undefined, { maximumFractionDigits: 4 });
                                            return (
                                                <TableHead key={col.id} className="px-2 py-2 text-right text-sm text-white">
                                                    {formatted}
                                                </TableHead>
                                            );
                                        }
                                        return <TableHead key={col.id} className="px-2 py-2 text-sm"></TableHead>;
                                    })}
                                </TableRow>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="cursor-pointer select-none"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="" style={{ maxWidth: 300 }}>
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </div>
                                                    <span style={{ width: '1em', display: 'inline-block', textAlign: 'center' }}>
                                                        {{ asc: '↑', desc: '↓' }[header.column.getIsSorted?.() ?? ''] ?? ''}
                                                    </span>
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {paginatedRows.length > 0 ? (
                                    paginatedRows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="max-w-[160px] truncate overflow-hidden whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="py-4 text-center">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, rowModel.length)} of {rowModel.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 0))}
                            disabled={page === 0}
                            className="rounded border px-3 py-1 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span>
                            Page {page + 1} of {pageCount}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
                            disabled={page >= pageCount - 1}
                            className="rounded border px-3 py-1 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <FilterOffcanvas
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                columns={columns.filter((col) => col.id !== 'select')}
                uniqueValues={uniqueValues}
                filters={filters}
                onFilterChange={handleFilterChange}
            />
        </AppLayout>
    );
};

export default DiamondList;
