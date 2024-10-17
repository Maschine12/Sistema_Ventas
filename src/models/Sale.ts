import mongoose, { Schema, Document } from 'mongoose';

interface IProductoVenta {
    productId: string;
    name: string;
    cantidad: number;
}

export interface IVenta extends Document {
    clienteId: string;
    productos: IProductoVenta[];
    total: number;
    tipoComprobante: string; // 'Factura', 'Boleta', 'Cotización'
    fecha: Date;
}

const ProductoVentaSchema: Schema = new Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    cantidad: { type: Number, required: true }
});

const VentaSchema: Schema = new Schema({
    clienteId: { type: String, required: true },
    productos: [ProductoVentaSchema],
    total: { type: Number, required: true },
    tipoComprobante: { type: String, enum: ['Factura', 'Boleta', 'Cotización'], required: true },
    fecha: { type: Date, default: Date.now }
});

const Venta = mongoose.models.Sales || mongoose.model<IVenta>('Sales', VentaSchema);

export default Venta;
