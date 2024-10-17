import { Schema, model } from 'mongoose';

interface Invoice {
    customerId: string; // ID del cliente
    saleId: string; // ID de la venta asociada
    totalAmount: number; // Monto total
    generatedAt: Date; // Fecha de generación
    isSent: boolean; // Si la factura ha sido enviada
}

const invoiceSchema = new Schema<Invoice>({
    customerId: { type: String, required: true },
    saleId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    generatedAt: { type: Date, default: Date.now },
    isSent: { type: Boolean, default: false },
});

const Invoice = model<Invoice>('Invoice', invoiceSchema);
export default Invoice;
