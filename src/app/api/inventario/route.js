import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/conection";
import Inventory from '@/app/models/Inventory';

export async function GET() {
    await connectDB();
    const inventario = await Inventory.find().exec();
    return NextResponse.json(inventario, { status: 200 });
}

export async function POST(req) {
    await connectDB();
    const data = await req.json();
    await Inventory.create(data);
    return NextResponse.json({ message: 'Registro creado' }, { status: 201 });
}

export async function PUT(req) {
    await connectDB();
    const { id, ...data } = await req.json();
    const inventario = await Inventory.findByIdAndUpdate(id, data, { new: true });
    
    if (!inventario) {
        return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registro actualizado', facElectronica }, { status: 200 });
}

export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();
    const inventario = await Inventory.findByIdAndDelete(id);
    
    if (!inventario) {
        return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registro eliminado' }, { status: 200 });
}
