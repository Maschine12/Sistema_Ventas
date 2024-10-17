"use client";
import { useEffect } from "react";
import { Trash } from "lucide-react"; // Importamos los iconos de Lucide
import { useAppSelector } from "../../app/redux";

interface TablaProductosProps {
    products: {
        _id: string;
        name: string;
        category: string;
        priceSale: number; // Usar priceSale para el precio de venta
        pricePurchase: number; // Puedes añadir esta columna si lo necesitas
        stock: number;
        createdAt: Date;
    }[];
    onDelete: (productId: string) => void;
}

const TablaProductos: React.FC<TablaProductosProps> = ({ products, onDelete }) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.add("light");
        }
    }, [isDarkMode]);
    //mostrar cambio de color
    const getStatus = (stock: number) => {
        if (stock === 0) {
            return { color: 'bg-red-500' }
        } else if (stock > 0 && stock <= 15) {
            return {color:'bg-orange-500'}
        }
    }
    // Ordenar los productos según la fecha de creación
    const sortedProducts = products.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} w-full h-full text-sm text-center`}>
                <thead className={`${isDarkMode ? "bg-gray-200 text-gray-600" : "text-gray-700 bg-gray-200"} text-xs uppercase`}>
                    <tr>
                        <th scope="col" className="px-6 py-3">Producto</th>
                        <th scope="col" className="px-6 py-3">Cantidad</th>
                        <th scope="col" className="px-6 py-3">Categoría</th>
                        <th scope="col" className="px-6 py-3">Precio de Venta</th> {/* Modificado para priceSale */}
                        <th scope="col" className="px-6 py-3">Fecha de Creación</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody className="items-center">
                    {sortedProducts.map((product) => (
                        <tr key={product._id} className={`${isDarkMode ? "bg-gray-300 border-gray-900 hover:bg-gray-400 text-gray-700" : "bg-white hover:bg-gray-50 text-gray-700"}`}>
                            <th scope="row" className="px-6 py-4 whitespace-nowrap">{product.name}</th>
                            <td className="px-6 py-4">{product.stock}</td>
                            <td className="px-6 py-4">{product.category}</td>
                            <td className="px-6 py-4">S/. {product.priceSale}</td> {/* Modificado para mostrar priceSale */}
                            <td className="px-6 py-4">{new Date(product.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => onDelete(product._id)}
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaProductos;
