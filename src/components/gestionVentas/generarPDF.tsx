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
}

const GenerarPDF: React.FC<PDFProps> = ({ tipoComprobante, productos, clienteNombre }) => {
    const generarPDF = () => {
        const doc = new jsPDF();

        // Título del PDF
        doc.text(`Comprobante de ${tipoComprobante}`, 10, 10);
        doc.text(`Cliente: ${clienteNombre}`, 10, 20);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 30);

        // Tabla de productos
        let y = 40;
        doc.text('Producto', 10, y);
        doc.text('Cantidad', 80, y);
        doc.text('Precio', 120, y);
        doc.text('Total', 160, y);

        productos.forEach((producto, index) => {
            y += 10;
            doc.text(producto.nombre, 10, y);
            doc.text(producto.cantidad.toString(), 80, y);
            doc.text(`S/. ${producto.precio.toFixed(2)}`, 120, y);
            doc.text(`S/. ${(producto.cantidad * producto.precio).toFixed(2)}`, 160, y);
        });

        // Total general
        const totalGeneral = productos.reduce((acc, producto) => acc + (producto.cantidad * producto.precio), 0);
        y += 20;
        doc.text(`Total General: S/. ${totalGeneral.toFixed(2)}`, 10, y);

        // Guardar el PDF con el nombre del cliente y tipo de comprobante
        doc.save(`${tipoComprobante} - ${clienteNombre}.pdf`);
    };

    return (
        <div>
            <button onClick={generarPDF}>Generar PDF</button>
        </div>
    );
};

export default GenerarPDF;
