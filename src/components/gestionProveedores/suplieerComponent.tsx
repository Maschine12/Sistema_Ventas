"use client";
import React, { useEffect, useState } from 'react';
import SupplierTable from './suplieerList';
import SupplierForm from './suplieerForm';
import UpdateForm from './suplieerUpdateForm';
import UpdateButton from './updateButon';

const SuppliersComponent: React.FC = () => {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchSuppliers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/proveedores');
            if (!response.ok) throw new Error('Error al obtener los proveedores');
            const data = await response.json();
            setSuppliers(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (_id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/proveedores/${_id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar el proveedor');
            fetchSuppliers();
        } catch (error: any) {
            setError(error.message);
        }
    };
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleCloseUpdate = () => {
        setIsUpdating(false);
        setSelectedSupplier(null);
        fetchSuppliers(); // Refrescar la lista después de actualizar
    };

    return (
        <>
            <h1 className="text-2xl font-bold">GESTIÓN DE PROVEEDORES</h1>
            <div className="grid grid-cols-5 gap-4 py-4">
                <div className="col-span-4 sm:col-span-1 lg:col-span-3">
                    <UpdateButton onUpdate={fetchSuppliers} />
                    {loading ? (
                        <p>Cargando proveedores...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <SupplierTable suppliers={suppliers} onDelete={handleDelete} />
                    )}
                </div>
                <div className="mt-12 col-span-1 sm:col-span-1 lg:col-span-1 space-y-3">
                    <div className='mt-5'></div>
                    <SupplierForm onClose={fetchSuppliers} />

                </div>
                <div className='col-span-1 mt-12'>
                    <div className='mt-5'></div>
                    <UpdateForm />
                </div>
            </div>
        </>
    );
};

export default SuppliersComponent;
