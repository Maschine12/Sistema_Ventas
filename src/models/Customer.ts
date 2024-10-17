import { Schema, model, models } from 'mongoose';

interface ICustomer {
    name: string;
    email: string;
    phone: string;
    purchaseHistory: string[];
    createdAt: Date; // Nueva propiedad
}

const customerSchema = new Schema<ICustomer>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    purchaseHistory: [{ type: String }],
    createdAt: { type: Date, default: Date.now }, // Valor por defecto
});

// Verifica si el modelo ya existe antes de crearlo
const Customer = models.Customer || model<ICustomer>('Customer', customerSchema);

export default Customer;