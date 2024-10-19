import React from 'react';
import jsPDF from 'jspdf';

interface ProductoParaPDF {
    nombre: string;
    cantidad: number;
    precio: number;
}

interface PDFProps {
    tipoComprobante: string;
    productos: ProductoParaPDF[];
    clienteNombre: string;
    ruc?: string; // Añadir el RUC como prop opcional
}

const GenerarPDF: React.FC<PDFProps> = ({ tipoComprobante, productos, clienteNombre, ruc }) => {
    const generarPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4', true); // true para mantener proporciones de página

        // Establecer márgenes según el formato APA
        const margin = 40; // Margen en puntos
        const pageWidth = doc.internal.pageSize.getWidth(); // Ancho de la página

        // Título del PDF
        const fecha = new Date().toLocaleDateString();
        doc.setFontSize(20); // Tamaño de fuente para el título
        doc.text('Dynamics', margin, margin); // Título en la parte superior con margen

        doc.setFontSize(12); // Tamaño de fuente para el resto del texto
        doc.text(`${tipoComprobante}`, margin, margin + 30);
        doc.text(`Cliente: ${clienteNombre}`, margin, margin + 50);
        if (ruc) doc.text(`RUC: ${ruc}`, margin, margin + 70);
        doc.text(`Fecha: ${fecha}`, margin, margin + 90);

        // Tabla de productos
        let y = margin + 120; // Comenzar después del encabezado
        const headers = ['Producto', 'Cantidad', 'Precio', 'Total'];

        const columnWidth = (pageWidth - margin * 2) / headers.length; // Ancho de cada columna, considerando márgenes

        headers.forEach((header, index) => {
            doc.text(header, margin + index * columnWidth, y);
        });

        y += 20; // Espaciado entre encabezado y datos

        productos.forEach(({ nombre, cantidad, precio }) => {
            const total = cantidad * precio;
            const datos = [
                nombre,
                cantidad.toString(),
                `S/. ${precio.toFixed(2)}`,
                `S/. ${total.toFixed(2)}`
            ];

            datos.forEach((dato, index) => {
                doc.text(dato, margin + index * columnWidth, y);
            });

            y += 20; // Incrementa la posición Y para cada fila
        });

        // Total
        const totalGeneral = productos.reduce((acc, { cantidad, precio }) => acc + (cantidad * precio), 0);
        const semiTotalIGV = totalGeneral / 1.18; // Total con IGV
        const igv = totalGeneral * 0.18;
        y += 20; // Espacio
        doc.text(`Total antes de impuestos: S/. ${semiTotalIGV.toFixed(2)}`, margin, y);
        y += 20; // Espacio antes del IGV
        doc.text(`IGV (18%): S/. ${igv.toFixed(2)}`, margin, y);
        y += 20; // Espacio antes de mostrar el total
        doc.text(`Total General: S/. ${totalGeneral.toFixed(2)}`, margin, y);



        // Guardar el PDF con el nombre del cliente y tipo de comprobante
        doc.save(`${tipoComprobante} - ${clienteNombre}.pdf`);
    };

    return (
        <button onClick={generarPDF} className='bg-green-500 p-3 w-full text-gray-50 px-4 py-2 rounded'>
            Generar PDF
        </button>
    );
};

export default GenerarPDF;
