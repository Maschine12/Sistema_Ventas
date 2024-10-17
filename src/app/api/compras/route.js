import { NextResponse } from "next/server";
import { connectDB } from "@/utils/conection";
import Purchase from "@/models/Purchase";

export async function GET() {
  await connectDB();
  const compras = await Purchase.find().exec();
  return NextResponse.json(compras, { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  await Purchase.create(data);
  return NextResponse.json({ message: "Registro creado" }, { status: 201 });
}

export async function PUT(req) {
  await connectDB();
  const { id, ...data } = await req.json();
  const compras = await Purchase.findByIdAndUpdate(id, data, { new: true });

  if (!compras) {
    return NextResponse.json(
      { message: "Registro no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Registro actualizado", compras },
    { status: 200 }
  );
}

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  const compras = await Purchase.findByIdAndDelete(id);

  if (!compras) {
    return NextResponse.json(
      { message: "Registro no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Registro eliminado" }, { status: 200 });
}
