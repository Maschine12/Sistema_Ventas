import { useAppSelector } from '@/app/redux';
import React, { useEffect, useState } from 'react';
import SeleccionProveedor from './suplieerSelect';

interface ProductFormProps {
    product?: {
        _id: string;
        name: string;
        category: string;
        priceSale: number;
        pricePurchase: number;
        stock: number;
    } | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    useEffect(() => {
        const rootElement = document.documentElement;
        if (isDarkMode) {
            rootElement.classList.add("dark");
        } else {
            rootElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const [name, setName] = useState('');
    const [pricePurchase, setPricePurchase] = useState<number>(0);
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState<number>(0);
    const [profitMargin, setProfitMargin] = useState<number>(0);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [proveedorId, setProveedorId] = useState<string | null>(null);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any | null>(null);

    const calculateSellingPrice = () => {
        if (pricePurchase !== undefined) {
            const price = pricePurchase + (pricePurchase * (profitMargin / 100));
            return Math.ceil(price * 10) / 10; // Redondear a la décima más cercana
        }
        return 0;
    };

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPricePurchase(product.pricePurchase);
            setCategory(product.category);
            setStock(product.stock);
        } else {
            setName('');
            setPricePurchase(0); // Cambiado a 0
            setCategory('');
            setStock(0); // Cambiado a 0
        }
    }, [product]);

    const handleSeleccionarProveedor = (proveedor: any) => {
        setProveedorSeleccionado(proveedor);
        setProveedorId(proveedor._id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || pricePurchase <= 0 || !category || stock < 0 || !proveedorId) {
            setError('Por favor, completa todos los campos.');
            setMessage('');
            return;
        }

        const totalAmount = pricePurchase * stock;

        const newPurchase = {
            supplierName: proveedorSeleccionado?.name,
            supplierRuc: proveedorSeleccionado?.ruc,
            supplierPhone: proveedorSeleccionado?.phone,
            productName: name,
            quantity: stock,
            totalAmount: totalAmount,
            purchaseDate: new Date(),
        };

        try {
            const purchaseResponse = await fetch('http://localhost:3000/api/compras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPurchase),
            });

            if (!purchaseResponse.ok) {
                throw new Error('Error al guardar la compra');
            }

            const purchaseResult = await purchaseResponse.json();
            console.log('Compra guardada:', purchaseResult);
        } catch (error) {
            console.error("Error al guardar la compra:", error);
        }

        const newProduct = {
            name,
            category,
            priceSale: calculateSellingPrice(),
            pricePurchase,
            stock,
        };

        try {
            const method = product ? 'PUT' : 'POST';
            const url = product
                ? `http://localhost:3000/api/productos/${product._id}`
                : 'http://localhost:3000/api/productos';

            const productResponse = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (!productResponse.ok) {
                throw new Error('Error al guardar el producto');
            }

            const result = await productResponse.json();
            console.log('Producto guardado:', result);
            setMessage(`Producto ${product ? 'actualizado' : 'registrado'} exitosamente.`);
            setError('');

            setName('');
            setPricePurchase(0);
            setCategory('');
            setStock(0);
            setProfitMargin(0);
            setProveedorId(null);
            setProveedorSeleccionado(null);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
            setError(errorMessage);
            setMessage('');
        }
    };

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    return (
        <div className='pt-9'>
            <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">
                {product ? 'Editar Producto' : 'Añadir Producto'}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}

            <label className="block text-gray-700">Nombre del Producto</label>
            <input
                type="text"
                placeholder="Nombre del producto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            <label className="block text-gray-700">Precio Compra X Unidad</label>
            <input
                type="number"
                placeholder="Precio de compra"
                value={pricePurchase}
                onChange={(e) => setPricePurchase(Number(e.target.value))}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            <label className="block text-gray-700">Porcentaje de Ganancia (%)</label>
            <input
                type="number"
                placeholder="Porcentaje de ganancia"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            <label className="block text-gray-700">Precio de Venta</label>
            <p className="text-gray-800 font-semibold">
                ${calculateSellingPrice().toFixed(2)}
            </p>

            <label className="block text-gray-700">Cantidad (Stock)</label>
            <input
                type="number"
                placeholder="Cantidad"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            <label className="block text-gray-700">Categoría</label>
            <input
                type="text"
                placeholder="Categoría"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            <h2 className="text-xl font-semibold text-gray-700">Seleccionar Proveedor</h2>
            <SeleccionProveedor onSeleccionar={handleSeleccionarProveedor} />

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                {product ? 'Actualizar Producto' : 'Registrar Producto'}
            </button>
        </form>
        </div>
    );
};

export default ProductForm;
