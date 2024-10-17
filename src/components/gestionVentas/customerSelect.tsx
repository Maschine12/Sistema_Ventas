"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Cliente {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

interface SeleccionClienteProps {
    onSeleccionar: (clienteId: string, clienteNombre: string) => void; // Cambiado para recibir nombre
}

const SeleccionCliente: React.FC<SeleccionClienteProps> = ({ onSeleccionar }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState<string>("Sin Cliente");
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [mostrandoPlaceholder, setMostrandoPlaceholder] = useState<boolean>(true);

    useEffect(() => {
        axios.get('http://localhost:3000/api/clientes')
            .then((response) => setClientes(response.data))
            .catch((error) => console.error("Error al obtener clientes:", error));
    }, []);

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.name.toLowerCase().includes(busqueda.toLowerCase()) && !mostrandoPlaceholder
    ).slice(0, 5);

    const manejarSeleccion = (cliente: Cliente) => {
        setClienteSeleccionado(cliente);
        setBusqueda(""); 
        onSeleccionar(cliente._id, cliente.name); // Envía ID y nombre del cliente
    };

    const volverABusqueda = () => {
        setClienteSeleccionado(null);
        setBusqueda("");
        setMostrandoPlaceholder(true);
    };

    const manejarCambioBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setBusqueda(valor);
        if (valor.trim() === "") {
            setMostrandoPlaceholder(true);
        } else {
            setMostrandoPlaceholder(false);
        }
    };

    const manejarBusqueda = () => {
        if (busqueda && !mostrandoPlaceholder) {
            const clienteEncontrado = clientes.find(cliente =>
                cliente.name.toLowerCase() === busqueda.toLowerCase()
            );
            if (clienteEncontrado) {
                manejarSeleccion(clienteEncontrado);
            }
        }
        setBusqueda("");
    };

    return (
        <div className="bg-white text-gray-900 p-4 rounded shadow-md col-span-2">
            <p className="font-semibold text-xl mb-4">Seleccione un cliente</p>
            {!clienteSeleccionado ? (
                <>
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={busqueda}
                        onChange={manejarCambioBusqueda}
                        className="justify-center w-50 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        onFocus={() => setMostrandoPlaceholder(false)}
                    />
                    <button
                        onClick={manejarBusqueda}
                        className="w-40 p-3 ml-2 bg-blue-500 text-white rounded mb-2"
                    >
                        Buscar
                    </button>
                    {!mostrandoPlaceholder && clientesFiltrados.length > 0 && (
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded">
                            {clientesFiltrados.map(cliente => (
                                <div
                                    key={cliente._id}
                                    onClick={() => manejarSeleccion(cliente)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {cliente.name}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="p-4 border border-gray-300 rounded mb-2">
                    <h2 className="font-bold text-lg mb-2">Cliente Seleccionado:</h2>
                    <p>Nombre: {clienteSeleccionado.name}</p>
                    <p>Email: {clienteSeleccionado.email}</p>
                    <p>Teléfono: {clienteSeleccionado.phone}</p>
                    <button onClick={volverABusqueda} className="mt-2 p-2 bg-blue-500 text-white rounded w-full">
                        Volver a Buscar
                    </button>
                </div>
            )}
        </div>
    );
};

export default SeleccionCliente;
