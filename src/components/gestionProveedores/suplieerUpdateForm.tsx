"use client"
import { useAppSelector } from '@/app/redux';
import React, { useEffect, useState } from 'react';

const SuplieerUpdateForm: React.FC = () => {
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
    const [suplieers, setSuplieers] = useState<any[]>([]);
    const [filteredSuplieers, setFilteredSuplieers] = useState<any[]>([]);
    const [selectedSuplieers, setSelectedSuplieers] = useState<any | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estados para el formulario de actualización
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [ruc, setRuc] = useState('');
    const [phone, setPhone] = useState('');

    // Función para cargar productos desde la base de datos
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/proveedores');
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            const result = await response.json();
            setSuplieers(result);
            setFilteredSuplieers(result); // Mostrar todos los productos inicialmente
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
            const filtered = suplieers.filter((supllieer) =>
                supllieer.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSuplieers(filtered);
        } else {
            setFilteredSuplieers(suplieers); // Mostrar todos si no hay búsqueda
        }
    }, [searchTerm, suplieers]);

    // Seleccionar producto
    const handleSelectProduct = (suplieer: any) => {
        setSuplieers(suplieer);
        setName(suplieer.name);
        setContact(suplieer.contact);
        setEmail(suplieer.email);
        setRuc(suplieer.ruc);
        setPhone(suplieer.phone);
    };

    // Actualizar producto
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSuplieers) {
            setError('Selecciona un cliente para actualizar.');
            return;
        }

        const updatedSuplieer = {
            id: selectedSuplieers._id,  // El ID del producto seleccionado
            name,
            contact,
            email,
            ruc,
            phone,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/proveedores`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSuplieer),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el cliente');
            }

            const result = await response.json();

            // Actualizar el estado local de los productos
            setSuplieers((prev) =>
                prev.map((suplieer) => (suplieer._id === result._id ? result : suplieer))
            );

            setSuccessMessage('Proveedor actualizado exitosamente.');
            setError('');
            // No restablecer `selectedProduct` para permitir más actualizaciones
            setName('');
            setContact('');
            setEmail('');
            setRuc('');
            setPhone('');

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
            <h2 className="text-2xl font-semibold text-gray-700">Actualizar Proveedor</h2>

            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Buscador de productos */}
            <label className="block text-gray-700">Buscar Proveedor</label>
            <input
                type="text"
                placeholder="Nombre del Proveedor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Botón para recargar productos */}
            <button
                onClick={handleRefresh}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
                Actualizar Lista de Proveedores
            </button>

            {/* Lista de productos filtrados */}
            {filteredSuplieers.length > 0 ? (
                <ul className="space-y-2">
                    {filteredSuplieers.map((suplieer) => (
                        <li
                            key={suplieer._id}
                            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                            onClick={() => handleSelectProduct(suplieer)}
                        >
                            {suplieer.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No se encontraron productos.</p>
            )}

            {/* Formulario de actualización */}
            {selectedSuplieers && (
                <form onSubmit={handleUpdate} className="space-y-4">
                    <label className="block text-gray-700">Nombre del Empresa</label>
                    <input
                        type="text"
                        placeholder="Nombre del Cliente"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block text-gray-700">Nombre del Contacto</label>
                    <input
                        type="text"
                        placeholder="Contacto"
                        value={name}
                        onChange={(e) => setContact(e.target.value)}
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
                    <label className="block text-gray-700">RUC</label>
                    <input
                        type="text"
                        placeholder="RUC"
                        value={email}
                        onChange={(e) => setRuc(e.target.value)}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />

                    <label className="block text-gray-700">Telefono</label>
                    <input
                        type="text"
                        placeholder="Telefono"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />


                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    >
                        Actualizar Proveedor
                    </button>
                </form>
            )}
        </div>
    );
};

export default SuplieerUpdateForm;