import { Schema, model } from 'mongoose';

interface IPaymentMethod {
    name: string;
    isActive: boolean;
}

const paymentMethodSchema = new Schema<IPaymentMethod>({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
});

const PaymentMethod = model<IPaymentMethod>('PaymentMethod', paymentMethodSchema);
export default PaymentMethod;
