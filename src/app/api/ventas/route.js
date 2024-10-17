import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/conection";
import Sale from '@/models/Sale';

export async function GET() {
    await connectDB();
    const venta = await Sale.find().exec();
    return NextResponse.json(venta, { status: 200 });
}

export async function POST(req) {
    await connectDB();
    const data = await req.json();
    await Sale.create(data);
    return NextResponse.json({ message: 'Registro creado' }, { status: 201 });
}

export async function PUT(req) {
    await connectDB();
    const { id, ...data } = await req.json();
    const venta = await Sale.findByIdAndUpdate(id, data, { new: true });

    if (!venta) {
        return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registro actualizado', venta }, { status: 200 });
}

export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();
    const venta = await Sale.findByIdAndDelete(id);

    if (!venta) {
        return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registro eliminado' }, { status: 200 });
}
