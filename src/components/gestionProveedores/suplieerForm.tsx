import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/redux';

const API_URL = 'http://localhost:3000/api/proveedores';

const SupplierForm: React.FC<{ supplier?: any; onClose: () => void }> = ({ supplier, onClose }) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    // Cambiar el tema
    useEffect(() => {
        const rootElement = document.documentElement;
        if (isDarkMode) {
            rootElement.classList.add("dark");
        } else {
            rootElement.classList.remove("light");
        }
    }, [isDarkMode]);

    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        ruc: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Lógica para llenar el formulario si hay un proveedor seleccionado
    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                contact: supplier.contact,
                email: supplier.email,
                ruc: supplier.ruc,
                phone: supplier.phone
            });
        } else {
            setFormData({ name: '', contact: '', email: '', ruc: '', phone: '' });
        }
    }, [supplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name, contact, email, ruc, phone } = formData;

        if (!name || !contact || !email || !ruc || !phone) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar el proveedor');
            }

            const result = await response.json();
            console.log('Proveedor guardado:', result);
            setMessage('Proveedor agregado exitosamente.');
            setError('');
            setFormData({ name: '', contact: '', email: '', ruc: '', phone: '' }); // Limpiar campos después de guardar
            onClose(); // Cerrar el formulario después de agregar
        } catch (err) {
            const errorMessage = 
                err instanceof Error ? err.message : 'Ocurrió un error al guardar el proveedor.';
            setError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-semibold">Añadir Proveedor</h2>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            <input type="text" name="contact" placeholder="Contacto" value={formData.contact} onChange={handleChange} required className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            <input type="text" name="ruc" placeholder="RUC" value={formData.ruc} onChange={handleChange} required className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Agregar Proveedor</button>
        </form>
    );
};

export default SupplierForm;
