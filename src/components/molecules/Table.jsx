import React from 'react';
import Skeleton from '../atoms/Skeleton';
import { ChevronUp, ChevronDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import './Table.css';

/**
 * Reusable Table component with a premium look and feel.
 * 
 * @param {Array} columns - Array of column definitions: { header: string, key: string, render: function, className: string }
 * @param {Array} data - Array of data objects
 * @param {boolean} loading - Loading state
 * @param {number} loadingRows - Number of skeleton rows to show when loading
 * @param {function} onRowClick - Optional row click handler
 * @param {string} emptyMessage - Message to show when data is empty
 * @param {string} className - Additional CSS class for the container
 */
const Table = ({
    columns = [],
    data = [],
    loading = false,
    loadingRows = 5,
    onRowClick,
    getRowClassName,
    sortConfig = { key: null, direction: 'asc' },
    onSort,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    emptyMessage = "No data available",
    className = ""
}) => {

    if (loading && (!data || data.length === 0)) {
        return (
            <div className={`custom-table-container ${className}`}>
                <table className="custom-table">
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={col.className}>
                                    <Skeleton width="60%" height="16px" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(loadingRows)].map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={col.className}>
                                        <Skeleton width={colIndex === 0 ? "80%" : "60%"} height="16px" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className={`custom-table-container ${className}`}>
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((col, idx) => {
                            const isSortable = col.sortable !== false && onSort;
                            const isSorted = sortConfig.key === col.key;

                            return (
                                <th
                                    key={idx}
                                    className={`${col.className || ''} ${isSortable ? 'sortable-header' : ''}`}
                                    onClick={isSortable ? () => onSort(col.key) : undefined}
                                >
                                    <div className="header-content">
                                        {col.header}
                                        {isSortable && (
                                            <span className={`sort-icon ${isSorted ? 'active' : ''}`}>
                                                {!isSorted ? (
                                                    <Minus size={12} className="inactive-sort" />
                                                ) : sortConfig.direction === 'asc' ? (
                                                    <ChevronUp size={14} />
                                                ) : (
                                                    <ChevronDown size={14} />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                className={`${onRowClick ? 'clickable-row' : ''} ${getRowClassName ? getRowClassName(row) : ''}`}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={col.className}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="empty-cell">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {onPageChange && totalPages > 1 && (
                <div className="table-pagination">
                    <div className="pagination-info">
                        Showing <span>{((currentPage - 1) * 10) + 1}</span>–<span>{Math.min(currentPage * 10, data.length > 0 ? ((currentPage - 1) * 10) + data.length : 0)}</span> of <span>{totalPages * 10}</span>
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            title="First Page"
                        >
                            «
                        </button>
                        <button
                            className="page-btn"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            title="Previous Page"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                if (totalPages <= 5) return true;
                                if (page === 1 || page === totalPages) return true;
                                return Math.abs(page - currentPage) <= 1;
                            })
                            .reduce((acc, page, idx, arr) => {
                                if (idx > 0 && page - arr[idx - 1] > 1) {
                                    acc.push('ellipsis-' + page);
                                }
                                acc.push(page);
                                return acc;
                            }, [])
                            .map(item => (
                                typeof item === 'string' ? (
                                    <span key={item} className="page-ellipsis">…</span>
                                ) : (
                                    <button
                                        key={item}
                                        className={`page-btn page-num ${currentPage === item ? 'active-page' : ''}`}
                                        onClick={() => onPageChange(item)}
                                    >
                                        {item}
                                    </button>
                                )
                            ))
                        }
                        <button
                            className="page-btn"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            title="Next Page"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            className="page-btn"
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            title="Last Page"
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
