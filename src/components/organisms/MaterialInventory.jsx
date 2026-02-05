import React from 'react';
import Badge from '../atoms/Badge';
import './MaterialInventory.css';

const MaterialInventory = ({ items }) => {
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
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td className="font-mono">{item.stock}</td>
                            <td className="text-secondary">{item.unit}</td>
                            <td>
                                {item.status === 'low' ? (
                                    <Badge variant="warning">Low Stock</Badge>
                                ) : (
                                    <Badge variant="success">Optimal</Badge>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MaterialInventory;
