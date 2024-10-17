import { Schema, model, models } from 'mongoose';

// Definimos la interfaz para los reportes
interface Report {
    reportType: string; // Tipo de reporte (ventas, inventario, etc.)
    generatedAt: Date;  // Fecha de generación
    data: Record<string, any>; // Ajustado para un objeto de datos genérico
}

// Creamos el esquema del reporte
const reportSchema = new Schema<Report>({
    reportType: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
    data: { type: Schema.Types.Mixed, required: true }, // Datos del reporte
});

// Verifica si el modelo ya ha sido compilado antes de definirlo nuevamente
const Report = models.Report || model<Report>('Report', reportSchema);

export default Report;
