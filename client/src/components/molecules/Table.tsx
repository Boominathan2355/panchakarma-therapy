import React from 'react';
import './Table.css';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
    width?: string;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyField: keyof T;
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    className?: string;
    id?: string;
}

const Table = <T extends Record<string, any>>({
    data,
    columns,
    keyField,
    onRowClick,
    isLoading = false,
    className = '',
    id
}: TableProps<T>) => {
    return (
        <div className={`table-container ${className}`} id={id}>
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th 
                                key={index} 
                                className={column.className}
                                style={{ width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="table-loading">
                                Loading...
                            </td>
                        </tr>
                    ) : data.length > 0 ? (
                        data.map((item) => (
                            <tr 
                                key={item[keyField]} 
                                onClick={() => onRowClick?.(item)}
                                className={onRowClick ? 'clickable-row' : ''}
                            >
                                {columns.map((column, index) => (
                                    <td key={index} className={column.className}>
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(item)
                                            : item[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="table-empty">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
