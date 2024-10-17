import { NextResponse } from "next/server";
import { connectDB } from "@/utils/conection";
import Supplier from "@/models/Supplier";

export async function GET() {
  try {
    await connectDB();
    const proveedores = await Supplier.find().exec();
    return NextResponse.json(proveedores, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener proveedores", error },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    await Supplier.create(data);
    return NextResponse.json({ message: "Registro creado" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear registro", error },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();
    const proveedor = await Supplier.findByIdAndUpdate(id, data, { new: true });

    if (!proveedor) {
      return NextResponse.json(
        { message: "Registro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Registro actualizado", proveedor },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error al actualizar registro", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    const proveedor = await Supplier.findByIdAndDelete(id);

    if (!proveedor) {
      return NextResponse.json(
        { message: "Registro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Registro eliminado" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error al eliminar registro", error },
      { status: 500 }
    );
  }
}
