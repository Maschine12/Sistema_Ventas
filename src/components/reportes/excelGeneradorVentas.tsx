import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface IProductoVenta {
    productId: string;
    name: string;
    cantidad: number;
}

interface IVenta {
    productos: IProductoVenta[];
    total: number;
    tipoComprobante: string;
    fecha: Date;
}

const ExcelGenerator: React.FC<{ sales: IVenta[]; startDate: string; endDate: string }> = ({ sales }) => {
    const [fileName, setFileName] = useState('Reporte Ventas');

    const handleGenerateExcel = () => {
        const data: { [key: string]: string | number }[] = [];
        let totalGeneral = 0; // Inicializamos la suma total

        sales.forEach((sale, index) => {
            data.push({
                'Número de Venta': index + 1,
                'Total': sale.total.toFixed(2),
                'Tipo de Comprobante': sale.tipoComprobante,
                'Fecha': sale.fecha instanceof Date ?
                    sale.fecha.toLocaleDateString() :
                    new Date(sale.fecha).toLocaleDateString(),
                'Producto': '',
                'Cantidad': '',
            });

            // Sumamos el total de la venta al total general
            totalGeneral += sale.total;

            sale.productos.forEach(prod => {
                data.push({
                    'Número de Venta': '',
                    'Total': '',
                    'Tipo de Comprobante': '',
                    'Fecha': '',
                    'Producto': prod.name,
                    'Cantidad': prod.cantidad,
                });
            });
        });

        // Agregamos la fila de suma total
        data.push({
            'Número de Venta': 'Total General',
            'Total': totalGeneral.toFixed(2),
            'Tipo de Comprobante': '',
            'Fecha': '',
            'Producto': '',
            'Cantidad': '',
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (

        <>
            <p className='text-green-500'>Nombre del Archivo Ventas</p>
            <div className='space-x-2'>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Nombre del archivo"
                    className="border rounded p-3 bg-gray-50"
                />
                <button onClick={handleGenerateExcel} className="bg-blue-500 text-white p-3 rounded">
                    Excel De Ventas
                </button>
            </div>
        </>
    );
};

export default ExcelGenerator;
