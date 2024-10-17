"use client"
import { useAppSelector } from '@/app/redux';
import React, { useEffect, useState } from 'react';

const CustomerUpdateForm: React.FC = () => {
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
    const [customers, setCustomers] = useState<any[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estados para el formulario de actualización
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState<number | undefined>(undefined);

    // Función para cargar productos desde la base de datos
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/clientes');
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            const result = await response.json();
            setCustomers(result);
            setFilteredCustomers(result); // Mostrar todos los productos inicialmente
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
            setError(errorMessage);
        }
    };

    // Cargar todos los productos al montar el componente
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtrar productos en tiempo real
    useEffect(() => {
        if (searchTerm) {
            const filtered = customers.filter((customer) =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCustomers(filtered);
        } else {
            setFilteredCustomers(customers); // Mostrar todos si no hay búsqueda
        }
    }, [searchTerm, customers]);

    // Seleccionar producto
    const handleSelectProduct = (customer: any) => {
        setSelectedCustomer(customer);
        setName(customer.name);
        setEmail(customer.email);
        setPhone(customer.phone);
    };

    // Actualizar producto
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCustomer) {
            setError('Selecciona un cliente para actualizar.');
            return;
        }

        const updatedProduct = {
            id: selectedCustomer._id,  // El ID del producto seleccionado
            name,
            email,
            phone,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/clientes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el cliente');
            }

            const result = await response.json();

            // Actualizar el estado local de los productos
            setCustomers((prev) =>
                prev.map((customer) => (customer._id === result._id ? result : customer))
            );

            setSuccessMessage('Cliente actualizado exitosamente.');
            setError('');
            // No restablecer `selectedProduct` para permitir más actualizaciones
            setName('');
            setEmail('');
            setPhone(undefined);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
            setError(errorMessage);
        }
    };

    // Botón para actualizar la lista de productos
    const handleRefresh = () => {
        fetchProducts(); // Llamar nuevamente para cargar los datos actualizados
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Actualizar Cliente</h2>

            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Buscador de productos */}
            <label className="block text-gray-700">Buscar Cliente</label>
            <input
                type="text"
                placeholder="Nombre del cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Botón para recargar productos */}
            <button
                onClick={handleRefresh}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
                Actualizar Lista de Clientes
            </button>

            {/* Lista de productos filtrados */}
            {filteredCustomers.length > 0 ? (
                <ul className="space-y-2">
                    {filteredCustomers.map((customer) => (
                        <li
                            key={customer._id}
                            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                            onClick={() => handleSelectProduct(customer)}
                        >
                            {customer.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No se encontraron productos.</p>
            )}

            {/* Formulario de actualización */}
            {selectedCustomer && (
                <form onSubmit={handleUpdate} className="space-y-4">
                    <label className="block text-gray-700">Nombre del Producto</label>
                    <input
                        type="text"
                        placeholder="Nombre del cliente"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />

                    <label className="block text-gray-700">Telefono</label>
                    <input
                        type="number"
                        placeholder="Telefono"
                        value={phone}
                        onChange={(e) => setPhone(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    >
                        Actualizar Cliente
                    </button>
                </form>
            )}
        </div>
    );
};

export default CustomerUpdateForm;