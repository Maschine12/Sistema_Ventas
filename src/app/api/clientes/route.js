import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/conection";
import Customer from '@/models/Customer';

export async function GET() {
    await connectDB();
    const cliente = await Customer.find().exec();
    return NextResponse.json(cliente, { status: 200 });
}

export async function POST(req) {
    await connectDB();
    const data = await req.json();
    await Customer.create(data);
    return NextResponse.json({ message: 'Registro creado' }, { status: 201 });
}

export async function PUT(req) {
    await connectDB();
    const { id, ...data } = await req.json();
    const cliente = await Customer.findByIdAndUpdate(id, data, { new: true });
    
    if (!cliente) {
        return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registro actualizado', cliente }, { status: 200 });
}

export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();
    const cliente = await Customer.findByIdAndDelete(id);
    
    if (!cliente) {
        return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registro eliminado' }, { status: 200 });
}
