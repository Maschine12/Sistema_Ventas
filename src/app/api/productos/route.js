import { NextResponse } from "next/server";
import { connectDB } from "@/utils/conection";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  const producto = await Product.find().exec();
  return NextResponse.json(producto, { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  await Product.create(data);
  return NextResponse.json({ message: "Registro creado" }, { status: 201 });
}

export async function PUT(req) {
  await connectDB();
  const { id, ...data } = await req.json();
  const producto = await Product.findByIdAndUpdate(id, data, { new: true });

  if (!producto) {
    return NextResponse.json(
      { message: "Registro no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Registro actualizado", producto },
    { status: 200 }
  );
}

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  const producto = await Product.findByIdAndDelete(id);

  if (!producto) {
    return NextResponse.json(
      { message: "Registro no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Registro eliminado" }, { status: 200 });
}

export async function PATCH(req) {
  await connectDB();
  const productos = await req.json(); // Un array [{ id, cantidad }]

  // Crea las operaciones de actualización en bulk
  const bulkOps = productos.map((producto) => ({
    updateOne: {
      filter: { _id: producto.id },
      update: { $inc: { stock: -producto.cantidad } }, // Resta la cantidad del stock actual
    }
  }));

  // Ejecuta todas las operaciones en una sola llamada
  await Product.bulkWrite(bulkOps);

  return NextResponse.json({ message: "Stock actualizado" }, { status: 200 });
}
