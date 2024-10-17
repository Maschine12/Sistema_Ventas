"use client";
import React, { useEffect } from "react";
import { Trash } from "lucide-react"; // Importamos los iconos de Lucide
import { useAppSelector } from "../../app/redux";

interface TablaCustomerProps {
    customers: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: Date;
    }[];
    onDelete: (customerId: string) => void;
}

const TablaCustomers: React.FC<TablaCustomerProps> = ({ customers, onDelete }) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.add("light");
        }
    }, [isDarkMode]);

    // Ordenar los clientes según la fecha de creación
    const sortedCustomers = customers.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} w-full h-full text-sm text-center`}>
                <thead className={`${isDarkMode ? "bg-gray-200 text-gray-600" : "text-gray-700 bg-gray-200"} text-xs uppercase`}>
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Correo</th>
                        <th scope="col" className="px-6 py-3">Teléfono</th>
                        <th scope="col" className="px-6 py-3">Fecha de Creación</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody className="items-center">
                    {sortedCustomers.map((customer) => (
                        <tr key={customer._id} className={`${isDarkMode ? "bg-gray-300 border-gray-900 hover:bg-gray-400 text-gray-700" : "bg-white hover:bg-gray-50 text-gray-700"}`}>
                            <th scope="row" className="px-6 py-4 whitespace-nowrap">{customer.name}</th>
                            <td className="px-6 py-4">{customer.email}</td>
                            <td className="px-6 py-4">{customer.phone}</td>
                            <td className="px-6 py-4">{new Date(customer.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => onDelete(customer._id)}
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

export default TablaCustomers;
