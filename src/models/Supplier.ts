import { Schema, model, models } from 'mongoose';

interface ISupplier {
    name: string;
    contact: string;
    email: string;
    ruc: string;
    phone: string;
    createdAt: Date;
}

const supplierSchema = new Schema<ISupplier>({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    ruc: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});


const Supplier = models.Supplier || model<ISupplier>('Supplier', supplierSchema);

export default Supplier;
