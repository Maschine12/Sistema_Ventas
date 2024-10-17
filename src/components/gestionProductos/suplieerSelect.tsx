"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Proveedor {
    _id: string;
    name: string;
    ruc: string;
    phone: string; // Asegúrate de que este campo exista en tu API
}

interface SeleccionProveedorProps {
    onSeleccionar: (proveedor: Proveedor) => void; // Cambiado para pasar el proveedor completo
}

const SeleccionProveedor: React.FC<SeleccionProveedorProps> = ({ onSeleccionar }) => {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [busqueda, setBusqueda] = useState<string>("Sin Proveedor");
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
    const [mostrandoPlaceholder, setMostrandoPlaceholder] = useState<boolean>(true);

    useEffect(() => {
        axios.get('http://localhost:3000/api/proveedores')
            .then(response => {
                setProveedores(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los proveedores:', error);
            });
    }, []);

    const manejarSeleccion = (proveedor: Proveedor) => {
        setProveedorSeleccionado(proveedor);
        setBusqueda(proveedor.name); // Cambiar búsqueda al nombre del proveedor
        onSeleccionar(proveedor); // Pasa el proveedor completo en lugar de solo el ID
    };

    const manejarBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
        setMostrandoPlaceholder(e.target.value === '');
    };

    return (
        <div>
            <input
                type="text"
                value={busqueda}
                onChange={manejarBusqueda}
                placeholder="Buscar Proveedor"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {mostrandoPlaceholder && <p className="text-gray-500"></p>}
            <ul className="mt-2">
                {proveedores.filter(proveedor =>
                    proveedor.name.toLowerCase().includes(busqueda.toLowerCase())
                ).map((proveedor) => (
                    <li
                        key={proveedor._id}
                        onClick={() => manejarSeleccion(proveedor)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                        {proveedor.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SeleccionProveedor;
