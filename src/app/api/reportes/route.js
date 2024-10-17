import { NextResponse } from "next/server";
import { connectDB } from "@/utils/conection";
import Report from "@/app/models/Report"

// GET - Obtener todos los reportes
export async function GET() {
  await connectDB();
  const reportes = await Report.find().exec();
  return NextResponse.json(reportes, { status: 200 });
}

// POST - Crear un nuevo reporte
export async function POST(req) {
  await connectDB();
  const data = await req.json();
  await Report.create(data);
  return NextResponse.json({ message: "Registro creado" }, { status: 201 });
}

// PUT - Actualizar un reporte existente
export async function PUT(req) {
  await connectDB();
  const { id, ...data } = await req.json();
  const reporte = await Report.findByIdAndUpdate(id, data, { new: true });

  if (!reporte) {
    return NextResponse.json(
      { message: "Registro no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Registro actualizado", reporte },
    { status: 200 }
  );
}

// DELETE - Eliminar un reporte por ID
export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  const reporte = await Report.findByIdAndDelete(id);

  if (!reporte) {
    return NextResponse.json(
      { message: "Registro no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Registro eliminado" }, { status: 200 });
}
