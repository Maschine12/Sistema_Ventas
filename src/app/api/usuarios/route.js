import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/conection";
import User from '@/models/User';

export async function GET() {
    await connectDB();
    const usuario = await User.find().exec();
    return NextResponse.json(usuario, { status: 200 });
}

export async function POST(req) {
    await connectDB();
    const data = await req.json();
    await User.create(data);
    return NextResponse.json({ message: 'Registro creado' }, { status: 201 });
}

export async function PUT(req) {
    await connectDB();
    const { id, ...data } = await req.json();
    const usuario = await User.findByIdAndUpdate(id, data, { new: true });

    if (!usuario) {
        return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registro actualizado', cliente }, { status: 200 });
}

export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();
    const usuario = await User.findByIdAndDelete(id);

    if (!usuario) {
        return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registro eliminado' }, { status: 200 });
}
