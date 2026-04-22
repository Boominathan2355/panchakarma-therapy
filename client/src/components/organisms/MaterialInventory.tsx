import React from 'react';
import Badge from '../atoms/Badge';
import './MaterialInventory.css';

export interface InventoryItem {
    id: string;
    name: string;
    stock: number | string;
    unit: string;
    status: 'low' | 'optimal' | 'out_of_stock';
}

export interface MaterialInventoryProps {
    items: InventoryItem[];
}

const MaterialInventory: React.FC<MaterialInventoryProps> = ({ items = [] }) => {
    return (
        <div className="inventory-panel">
            <h3 className="section-title">Stock Inventory</h3>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Stock Level</th>
                        <th>Unit</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(items) ? items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td className="font-mono">{item.stock}</td>
                            <td className="text-secondary">{item.unit}</td>
                            <td>
                                {item.status === 'low' ? (
                                    <Badge variant="warning">Low Stock</Badge>
                                ) : item.status === 'out_of_stock' ? (
                                    <Badge variant="error">Out of Stock</Badge>
                                ) : (
                                    <Badge variant="success">Optimal</Badge>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center p-4 text-warning">
                                Invalid data format received.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {Array.isArray(items) && items.length === 0 && (
                <p className="no-items">No inventory items found.</p>
            )}
        </div>
    );
};

export default MaterialInventory;
