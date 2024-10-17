import { useAppSelector } from '@/app/redux';
import React, { useEffect, useState } from 'react';

interface ProductFormProps {
    customer?: {
        _id: string;
        name: string;
        email: string;
        phone: number;
    } | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ customer }) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    // Efecto para cambiar el tema
    useEffect(() => {
        const rootElement = document.documentElement;
        if (isDarkMode) {
            rootElement.classList.add("dark");
        } else {
            rootElement.classList.add("light");
        }
    }, [isDarkMode]);

    // Estados locales para los campos del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState<number | undefined>(undefined);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Mensaje de éxito o error

    // Rellenar el formulario si hay un producto
    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setEmail(customer.email);
            setPhone(customer.phone);
        } else {
            setName('');
            setEmail('');
            setPhone(undefined);
        }
    }, [customer]);

    // Manejo de la lógica de envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación simple de los campos
        if (!name || !email || !phone === undefined) {
            setError('Por favor, completa todos los campos.');
            setMessage(''); // Limpiar el mensaje de éxito al haber un error
            return;
        }

        const newCustomer = {
            name,
            email,
            phone,
        };

        try {
            const method = customer ? 'PUT' : 'POST';
            const url = customer
                ? `../api/clientes/${customer._id}`
                : '../api/clientes';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomer),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el cliente');
            }

            const result = await response.json();
            //console.log('Producto guardado:', result);
            setMessage(`Cliente ${customer ? 'actualizado' : 'registrado'} exitosamente.`);
            setError(''); // Limpiar el error

            // Limpiar campos después de guardar
            setName('');
            setEmail('');
            setPhone(undefined);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
            setError(errorMessage);
            setMessage(''); // Limpiar el mensaje de éxito al haber un error
        }
    };

    // Limpiar mensajes después de 3 segundos
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
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">
                {customer ? 'Editar Cliente' : 'Añadir Cliente'}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <label className="block text-gray-700">Nombre del Cliente</label>
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

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none transition-all">
                {customer ? 'Actualizar Cliente' : 'Registrar Cliente'}
            </button>
        </form>
    );
};

export default ProductForm;
