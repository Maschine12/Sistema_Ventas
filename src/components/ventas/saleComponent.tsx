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
    const [clienteId, setClienteId] = useState<string>("");
    const [clienteNombre, setClienteNombre] = useState<string>("");
    const [tipoComprobante, setTipoComprobante] = useState<string>("Boleta");
    const [ruc, setRuc] = useState<string>("");
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [descuento] = useState<number>(0);
    const [pdfVisible, setPdfVisible] = useState<boolean>(false);

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
            <div className="grid grid-cols-3 gap-6 ">
                <div className="col-span-2 ">
                    <TablaProductos onAgregar={agregarProductoAlCarrito} />
                </div>
                <div className="col-span-1">
                    <div className="space-y-4">
                        <Carrito
                            carrito={carrito}
                            onModificarCantidad={modificarCantidadProducto}
                            onEliminarProducto={eliminarProductoDelCarrito}
                        />
                        <div className="grid grid-cols-3 gap-3 space-y-4">
                            <SeleccionCliente onSeleccionar={(id, nombre) => {
                                setClienteId(id);
                                setClienteNombre(nombre);
                            }} />
                            <div className="space-y-3 bg-gray-50 shadow-sm rounded-lg p-3 ">
                                <label className="font-semibold text-xl mb-4">Tipo de Comprobante:</label>
                                <select
                                    value={tipoComprobante}
                                    onChange={e => {
                                        setTipoComprobante(e.target.value);
                                        if (e.target.value !== "Factura") setRuc("");
                                    }}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Boleta">Boleta</option>
                                    <option value="Factura">Factura</option>
                                    <option value="Cotización">Cotización</option>
                                </select>
                                {tipoComprobante === "Factura" && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">RUC:</label>
                                        <input
                                            type="text"
                                            value={ruc}
                                            onChange={e => setRuc(e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}

                                    <GenerarPDF
                                        tipoComprobante={tipoComprobante}
                                        productos={carrito.map(producto => ({
                                            nombre: producto.name,
                                            cantidad: producto.cantidad,
                                            precio: producto.priceSale,
                                        }))}
                                        clienteNombre={clienteNombre}
                                        ruc={ruc}
                                    />
                            </div>
                        </div>
                        <RealizarVenta
                            carrito={carrito}
                            clienteId={clienteId}
                            descuento={descuento}
                            tipoComprobante={tipoComprobante}
                            onVentaRealizada={() => {
                                setCarrito([]);
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
