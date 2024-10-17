import { Schema, model, models } from 'mongoose';

interface IProduct {
    name: string;
    category: string;
    priceSale: number;
    pricePurchase: number;
    stock: number;
    createdAt: Date;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    priceSale: { type: Number, required: true },
    pricePurchase: { type: Number, requerided: true },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Product = models.Product || model<IProduct>('Product', productSchema);
export default Product;
