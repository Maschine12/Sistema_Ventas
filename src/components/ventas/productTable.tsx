"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

interface Producto {
    _id: string;
    name: string;
    category: string;
    priceSale: number;
    stock: number;
}

interface TablaProductosProps {
    onAgregar: (producto: Producto) => void;
}

const TablaProductos: React.FC<TablaProductosProps> = ({ onAgregar }) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState<string>("");

    useEffect(() => {
        axios
            .get("../api/productos")
            .then((response) => setProductos(response.data))
            .catch((error) => console.error("Error al obtener productos:", error));
    }, []);

    // Filtrar productos según la búsqueda
    const productosFiltrados = productos.filter((producto) =>
        producto.name.toLowerCase().includes(busqueda.toLowerCase())
    );

    const manejarAgregar = (producto: Producto) => {
        if (producto.stock <= 0) {
            alert("No se puede agregar el producto al carrito porque el stock es 0."); // Mensaje de alerta si el stock es 0
            return;
        }

        // Actualizar el stock en el estado
        const productosActualizados = productos.map((p) => {
            if (p._id === producto._id) {
                return { ...p, stock: p.stock - 1 }; // Reducir el stock en 1
            }
            return p;
        });

        setProductos(productosActualizados); // Actualizar el estado de productos
        onAgregar(producto); // Agregar producto al carrito
    };

    return (
        <div className="relative rounded-lg overflow-x-auto shadow-md sm:rounded-lg gap-2">
            <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-1/4 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <table className="w-full h-full text-sm text-center mt-3">
                <thead className="bg-gray-200 text-gray-700 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3">Nombre</th>
                        <th className="px-6 py-3">Categoría</th>
                        <th className="px-6 py-3">Precio</th>
                        <th className="px-6 py-3">Stock</th>
                        <th className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosFiltrados.map((producto) => (
                        <tr key={producto._id} className="bg-white hover:bg-gray-50 text-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">{producto.name}</td>
                            <td className="px-6 py-4">{producto.category}</td>
                            <td className="px-6 py-4">S/. {producto.priceSale.toFixed(2)}</td>
                            <td className="px-6 py-4">{producto.stock}</td>
                            <td className="px-6 py-4">
                                <button 
                                    onClick={() => manejarAgregar(producto)} 
                                    className={`text-green-500 hover:text-green-700 ${producto.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    disabled={producto.stock <= 0} // Deshabilitar el botón si el stock es 0
                                >
                                    <Plus />
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
