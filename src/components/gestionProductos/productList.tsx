import React, { useEffect, useState } from 'react';
import TablaProductos from '@/components/gestionProductos/productTable';
import { RefreshCw } from 'lucide-react';
interface ProductListProps {
    categoryFilter: string;
}

const ProductList: React.FC<ProductListProps> = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('../api/productos');
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId: string) => {
        try {
            const response = await fetch(`../api/productos`, {
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
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>

            <button
                onClick={fetchProducts}
                className="flex items-center px-4 py-3 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
                <RefreshCw className="mr-2" />
                Actualizar
            </button>
            <TablaProductos products={products} onDelete={handleDelete} />
        </div>
    );
};

export default ProductList;
