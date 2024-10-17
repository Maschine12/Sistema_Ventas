"use client";
import { useState, useCallback } from "react";
import TablaProductos from "./productTable";
import SeleccionCliente from "./customerSelect";
import Carrito from "./carStore";
import RealizarVenta from "./saleAction";
import GenerarPDF from './generarPDF';

interface Producto {
    _id: string;
    name: string;
    priceSale: number;
    stock?: number;
}

const Venta: React.FC = () => {
    const [carrito, setCarrito] = useState<{ id: string; name: string; priceSale: number; cantidad: number; }[]>([]);
    const [clienteId, setClienteId] = useState<string>(""); // ID del cliente
    const [clienteNombre, setClienteNombre] = useState<string>(""); // Nombre del cliente
    const [tipoComprobante, setTipoComprobante] = useState<string>("Boleta");
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [descuento] = useState<number>(0); // Estado para el descuento

    const agregarProductoAlCarrito = useCallback((producto: Producto) => {
        const productoCarrito = {
            id: producto._id,
            name: producto.name,
            priceSale: producto.priceSale,
            cantidad: 1,
        };

        setCarrito(prevCarrito => {
            const productoExistente = prevCarrito.find(prod => prod.id === productoCarrito.id);
            if (productoExistente) {
                return prevCarrito.map(prod =>
                    prod.id === productoCarrito.id ? { ...prod, cantidad: prod.cantidad + 1 } : prod
                );
            }
            return [...prevCarrito, productoCarrito];
        });
    }, []);

    const modificarCantidadProducto = useCallback((productoId: string, nuevaCantidad: number) => {
        setCarrito(prevCarrito =>
            prevCarrito.map(prod =>
                prod.id === productoId ? { ...prod, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 } : prod
            )
        );
    }, []);

    const eliminarProductoDelCarrito = useCallback((productoId: string) => {
        setCarrito(prevCarrito => prevCarrito.filter(prod => prod.id !== productoId));
    }, []);

    return (
        <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">VENTAS</h1>
            <div className="space-y-4 grid gap-4 grid-cols-4 md:grid-cols-2">
                <div className="col-span-1">
                    <TablaProductos onAgregar={agregarProductoAlCarrito} />
                </div>
                <div className="col-span-1">
                    <div className="space-y-4">
                        <Carrito
                            carrito={carrito}
                            onModificarCantidad={modificarCantidadProducto}
                            onEliminarProducto={eliminarProductoDelCarrito}
                        />
                        <div className="grid grid-cols-3 gap-3">
                            <SeleccionCliente onSeleccionar={(id, nombre) => {
                                setClienteId(id);
                                setClienteNombre(nombre); // Almacena el nombre del cliente
                            }} />
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Comprobante:</label>
                                <select
                                    value={tipoComprobante}
                                    onChange={e => setTipoComprobante(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Boleta" className="w-50 p-3">Boleta</option>
                                    <option value="Factura" className="w-50 p-3">Factura</option>
                                </select>
                                <button
                                    onClick={() => {
                                        if (!clienteId) {
                                            setMensaje("Por favor, selecciona un cliente antes de generar el PDF.");
                                            return;
                                        }
                                        const productosParaPDF = carrito.map(producto => ({
                                            nombre: producto.name,
                                            cantidad: producto.cantidad,
                                            precio: producto.priceSale,
                                        }));
                                        GenerarPDF({ tipoComprobante, productos: productosParaPDF, clienteNombre });
                                        setMensaje("PDF generado con éxito.");
                                    }}
                                    className="mt-2 bg-green-500 text-white p-3 rounded w-full transition duration-300 ease-in-out hover:bg-green-600"
                                >
                                    Generar PDF
                                </button>
                            </div>
                        </div>
                        <RealizarVenta
                            carrito={carrito}
                            clienteId={clienteId}
                            descuento={descuento}
                            tipoComprobante={tipoComprobante}
                            onVentaRealizada={() => {
                                setCarrito([]); // Limpiar el carrito después de realizar la venta
                                setMensaje("Venta realizada con éxito.");
                            }}
                        />
                        {mensaje && <div className="text-green-500 bg-green-100 p-2 rounded">{mensaje}</div>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Venta;
