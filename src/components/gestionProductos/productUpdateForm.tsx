import { useAppSelector } from '@/app/redux';
import React, { useEffect, useState } from 'react';

const ProductUpdateForm: React.FC = () => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    useEffect(() => {
        const rootElement = document.documentElement;
        if (isDarkMode) {
            rootElement.classList.add('dark');
        } else {
            rootElement.classList.add('light');
        }
    }, [isDarkMode]);

    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estados para el formulario de actualización
    const [name, setName] = useState('');
    const [pricePurchase, setPricePurchase] = useState<number | undefined>(undefined);
    const [priceSale, setPriceSale] = useState<number | undefined>(undefined);
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState<number | undefined>(undefined);
    const [percentageProfit, setPercentageProfit] = useState<number>(10);

    const [showProductList, setShowProductList] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/productos');
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            const result = await response.json();
            setProducts(result);
            setFilteredProducts(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
            setError(errorMessage);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products]);

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product);
        setName(product.name);
        setPricePurchase(product.pricePurchase);
        setCategory(product.category);
        setStock(product.stock);
        setPriceSale(calculatePriceSale(product.pricePurchase, percentageProfit));
        setShowProductList(false);
    };

    const calculatePriceSale = (purchasePrice: number, profitPercentage: number): number => {
        return parseFloat((purchasePrice + (purchasePrice * profitPercentage) / 100).toFixed(1));
    };

    useEffect(() => {
        if (pricePurchase !== undefined) {
            setPriceSale(calculatePriceSale(pricePurchase, percentageProfit));
        }
    }, [pricePurchase, percentageProfit]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) {
            setError('Selecciona un producto para actualizar.');
            return;
        }

        // Crear objeto para actualización del producto
        const updatedProduct = {
            id: selectedProduct._id,
            name,
            category,
            pricePurchase,
            priceSale,
            stock,
        };

        try {
            // Actualizar el producto
            const productResponse = await fetch(`http://localhost:3000/api/productos`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!productResponse.ok) {
                throw new Error('Error al actualizar el producto');
            }

            const result = await productResponse.json();
            setProducts((prev) =>
                prev.map((product) => (product._id === result._id ? result : product))
            );
            setSuccessMessage('Producto actualizado exitosamente.');
            setError('');

            // Restablecer campos del formulario
            setName('');
            setPricePurchase(undefined);
            setPriceSale(undefined);
            setCategory('');
            setStock(undefined);

            // Crear nueva compra
            if (stock && pricePurchase) {
                const newPurchase = {
                    supplierName: "Nombre del proveedor", // Cambia esto según tu lógica
                    supplierRuc: "RUC del proveedor", // Cambia esto según tu lógica
                    supplierPhone: "Teléfono del proveedor", // Cambia esto según tu lógica
                    productName: name,
                    quantity: stock,
                    totalAmount: stock * pricePurchase,
                    purchaseDate: new Date(),
                };

                // Enviar nueva compra
                const purchaseResponse = await fetch(`http://localhost:3000/api/compras`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPurchase),
                });

                if (!purchaseResponse.ok) {
                    throw new Error('Error al crear la compra');
                }

                setSuccessMessage((prev) => `${prev} y nueva compra creada exitosamente.`);
            }

            // Volver a mostrar la lista de productos después de actualizar
            setShowProductList(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
            setError(errorMessage);
        }
    };

    const handleRefresh = () => {
        fetchProducts();
        setShowProductList(true);
    };

    return (
        <div className="bg-gray-100 mt-9 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Actualizar Producto</h2>
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <label className="block text-gray-700">Buscar Producto</label>
            <input
                type="text"
                placeholder="Nombre del producto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
                onClick={handleRefresh}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
                Actualizar Lista de Productos
            </button>
            {showProductList && filteredProducts.length > 0 ? (
                <ul className="space-y-2">
                    {filteredProducts.map((product) => (
                        <li
                            key={product._id}
                            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                            onClick={() => handleSelectProduct(product)}
                        >
                            {product.name}
                        </li>
                    ))}
                </ul>
            ) : (
                !showProductList && <p>No hay productos disponibles</p>
            )}
            {selectedProduct && (
                <form onSubmit={handleUpdate} className="space-y-4">
                    <h3 className="text-lg font-semibold">Producto Seleccionado: {name}</h3>
                    <label className="block text-gray-700">Precio de Compra X Unidad</label>
                    <input
                        type="number"
                        placeholder="Precio de compra"
                        value={pricePurchase}
                        onChange={(e) => setPricePurchase(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block text-gray-700">Precio de Venta (Calculado Automáticamente)</label>
                    <input
                        type="number"
                        value={priceSale}
                        disabled
                        className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                    />
                    <label className="block text-gray-700">Porcentaje de Ganancia</label>
                    <input
                        type="number"
                        value={percentageProfit}
                        onChange={(e) => setPercentageProfit(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block text-gray-700">Stock Nuevo</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    >
                        Actualizar Producto
                    </button>
                </form>
            )
            }
        </div>
    );
};

export default ProductUpdateForm;
