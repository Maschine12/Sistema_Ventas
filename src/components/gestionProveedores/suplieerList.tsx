"use client";
import { useEffect } from "react";
import { Trash } from "lucide-react";
import { useAppSelector } from "../../app/redux";

interface Supplier {
    _id: string;
    name: string;
    contact: string;
    email: string;
    ruc: string;
    phone: string;
    createdAt: Date; // Añadido para ordenar por fecha de creación
}

interface SupplierTableProps {
    suppliers: Supplier[];
    onDelete: (supplierId: string) => void; // Función que se ejecuta al presionar el botón de eliminar
}

const SupplierTable: React.FC<SupplierTableProps> = ({ suppliers, onDelete }) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("light");
        }
    }, [isDarkMode]);

    // Ordenar los proveedores según la fecha de creación
    const sortedSuppliers = suppliers.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Ordenar de más reciente a más antiguo
    });

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} w-full h-full text-sm text-center`}>
                <thead className={`${isDarkMode ? "bg-gray-200 text-gray-600" : "text-gray-700 bg-gray-200"} text-xs uppercase`}>
                    <tr>
                        <th className="px-6 py-3">Nombre</th>
                        <th className="px-6 py-3">Contacto</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">RUC</th>
                        <th className="px-6 py-3">Teléfono</th>
                        <th className="px-6 py-3">Fecha de Creación</th>
                        <th className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody className="items-center">
                    {sortedSuppliers.map((supplier) => (
                        <tr key={supplier._id} className={`${isDarkMode ? "bg-gray-300 border-gray-900 hover:bg-gray-400 text-gray-700" : "bg-gray-50 hover:bg-gray-50 text-gray-700"}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{supplier.name}</td>
                            <td className="px-6 py-4">{supplier.contact}</td>
                            <td className="px-6 py-4">{supplier.email}</td>
                            <td className="px-6 py-4">{supplier.ruc}</td>
                            <td className="px-6 py-4">{supplier.phone}</td>
                            <td className="px-6 py-4">{new Date(supplier.createdAt).toLocaleDateString()}</td> {/* Mostrar la fecha de creación */}
                            <td className="px-6 py-4">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => onDelete(supplier._id)}
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

export default SupplierTable;
