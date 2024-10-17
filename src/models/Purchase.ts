import { Schema, model, models } from 'mongoose';

interface IPurchase {
    supplierName: string;
    supplierRuc: string;
    supplierPhone: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    purchaseDate: Date;
}

const purchaseSchema = new Schema<IPurchase>({
    supplierName: { type: String, required: true },
    supplierRuc: { type: String, required: true },
    supplierPhone: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    purchaseDate: { type: Date, default: Date.now },
});

// Verifica si el modelo ya ha sido definido y si no, lo define
const Purchase = models.Purchases || model<IPurchase>('Purchases', purchaseSchema);

export default Purchase;
