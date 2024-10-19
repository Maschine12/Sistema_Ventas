import React, { useEffect, useState } from 'react';
import TablaProductos from '@/components/gestionClientes/customerTable';
import { RefreshCw } from 'lucide-react';
interface TablaCustomerProps {
    categoryFilter: string;
}

const ProductList: React.FC<TablaCustomerProps> = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/clientes');
            if (!response.ok) {
                throw new Error('Error al obtener los clientes');
            }
            const data = await response.json();
            setCustomers(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (productId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/clientes`, {
                method: 'DELETE',
                body: JSON.stringify({ id: productId }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }
            // Refresca la lista después de eliminar
            fetchCustomers();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div>Cargando clientes...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className=''>
            <button
                onClick={fetchCustomers}
                className="flex items-center w-max p-3 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
                <RefreshCw className="mr-2" />
                Actualizar
            </button>
            <TablaProductos customers={customers} onDelete={handleDelete} />
        </div>
    );
};

export default ProductList;
