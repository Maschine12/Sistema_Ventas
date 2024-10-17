import { Trash } from "lucide-react";
import React, { useState } from "react";

interface ProductoCarrito {
    id: string;
    name: string;
    priceSale: number;
    cantidad: number;
}

interface CarritoProps {
    carrito: ProductoCarrito[];
    onModificarCantidad: (productoId: string, nuevaCantidad: number) => void;
    onEliminarProducto: (productoId: string) => void;
}

const Carrito: React.FC<CarritoProps> = ({ carrito, onModificarCantidad, onEliminarProducto }) => {
    const [descuento, setDescuento] = useState<number>(0); // Estado para el descuento
    const [pago, setPago] = useState<number | ''>(0); // Estado para el monto de pago

    const totalSinDescuento = carrito.reduce((acc, producto) => acc + producto.priceSale * producto.cantidad, 0);
    const totalConDescuento = totalSinDescuento - (totalSinDescuento * (descuento / 100));

    // Calcular el vuelto
    const vuelto = pago !== '' ? pago - totalConDescuento : 0;

    return (
        <div className="bg-white text-gray-900 p-4 rounded shadow-md">
            <h2 className="font-semibold text-xl mb-4">Carrito</h2>
            {carrito.length === 0 ? (
                <p className="text-gray-500">El carrito está vacío.</p>
            ) : (
                <div>
                    <ul>
                        {carrito.map((producto) => (
                            <li key={producto.id} className="flex flex-col my-2">
                                <span className="mb-1">{producto.name} - {producto.cantidad} - unidades</span>
                                <div className="flex justify-between items-center">
                                    <input
                                        type="number"
                                        value={producto.cantidad > 0 ? producto.cantidad : ''} // Mostrar vacío si es 0
                                        min={0} // Permitir cantidades desde 0
                                        step={0.1} // Permite incrementos de 0.1
                                        onChange={(e) => {
                                            const nuevaCantidad = e.target.value === '' ? 0 : Math.max(Number(e.target.value), 0); // Permitir que el input esté vacío
                                            onModificarCantidad(producto.id, nuevaCantidad);
                                        }}
                                        className="justify-center w-50 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none -moz-appearance-textfield"
                                    />
                                    <span className="text-gray-700 ml-2">Subtotal: S/. {(producto.priceSale * producto.cantidad).toFixed(1)}</span>
                                    <button
                                        onClick={() => onEliminarProducto(producto.id)}
                                        className="text-red-500 ml-4"
                                        disabled={producto.cantidad <= 0} // Deshabilitar si la cantidad es 0
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4">
                        <span className="font-semibold text-lg">Total: S/. {totalConDescuento.toFixed(1)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="mt-4">
                            <label className="block mb-2">Descuento:</label>
                            <input
                                type="number"
                                min="0" // Permitir solo valores no negativos
                                step="0.1" // Permitir valores decimales en el descuento
                                value={descuento}
                                onChange={e => setDescuento(Math.max(0, Number(e.target.value)))}
                                className="justify-center w-50 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none -moz-appearance-textfield" // Eliminando flechitas
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">Pago:</label>
                            <input
                                type="number"
                                min="0" // Permitir solo valores no negativos
                                step="0.1" // Permitir valores decimales en el pago
                                value={pago}
                                onChange={(e) => setPago(Number(e.target.value))}
                                className="justify-center w-50 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none -moz-appearance-textfield" // Eliminando flechitas
                            />
                        </div>
                    </div>
                    {/* Mostrar el vuelto solo si el pago es mayor que el total con descuento */}
                    {typeof pago === 'number' && pago > totalConDescuento && (
                        <div className="mt-3 ">
                            <span className="font-semibold text-2xl text-green-600">Vuelto: S/. {vuelto.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Carrito;
