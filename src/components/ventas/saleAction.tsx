"use client";
import { useState } from "react";

interface ProductoCarrito {
    id: string;
    name: string;
    priceSale: number;
    cantidad: number;
}

interface PropsRealizarVenta {
    carrito: ProductoCarrito[];
    clienteId: string;
    descuento: number;
    tipoComprobante: string;
    onVentaRealizada: () => void; // Prop para manejar la señal
}

const RealizarVenta: React.FC<PropsRealizarVenta> = ({ carrito, clienteId, descuento, tipoComprobante, onVentaRealizada }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    // Función para calcular el total de la venta aplicando el descuento
    const calcularTotal = (carrito: ProductoCarrito[]) => {
        const totalSinDescuento = carrito.reduce((acc, producto) => acc + producto.priceSale * producto.cantidad, 0);
        return totalSinDescuento - (totalSinDescuento * (descuento / 100));
    };

    // Nueva función para actualizar el stock de varios productos en una sola petición
    const actualizarStock = async (productos: ProductoCarrito[]) => {
        try {
            const productosActualizar = productos.map((producto) => ({
                id: producto.id,
                cantidad: producto.cantidad, // Cantidad a restar del stock
            }));

            const respuesta = await fetch(`../api/productos`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productosActualizar),
            });

            if (!respuesta.ok) {
                throw new Error('Error al actualizar el stock de los productos');
            }

            const resultado = await respuesta.json();
            console.log('Stock actualizado con éxito:', resultado);

        } catch (error) {
            console.error('Error al actualizar el stock:', error);
            setError('Error al actualizar el stock: ' + error);
        }
    };

    // Función para manejar el proceso de venta
    const manejarVenta = async () => {
        if (!clienteId || carrito.length === 0) {
            setError("Faltan datos: cliente o carrito vacío");
            return;
        }

        const total = calcularTotal(carrito);

        setLoading(true);
        setError(null);
        setMensajeExito(null); // Reiniciar el mensaje de éxito

        try {
            const respuesta = await fetch('../api/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carrito, clienteId, total, tipoComprobante }),
            });

            if (!respuesta.ok) {
                throw new Error('Error al realizar la venta');
            }

            await actualizarStock(carrito); // Llamar a la función para actualizar el stock

            setMensajeExito('Venta realizada con éxito'); // Mensaje de éxito
            onVentaRealizada(); // Llamar a la función para manejar la venta realizada
        } catch (error) {
            console.error('Error en la venta:', error);
            setError('Error en la venta: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={manejarVenta} disabled={loading} className="bg-blue-500 p-4 w-full text-white px-4 py-2 rounded">
                {loading ? 'Cargando...' : 'Realizar Venta'}
            </button>
        </div>
    );
};

export default RealizarVenta;