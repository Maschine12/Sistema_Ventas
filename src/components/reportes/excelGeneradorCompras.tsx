import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface IPurchase {
    supplierName: string;
    supplierRuc: string;
    supplierPhone: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    purchaseDate: Date;
}

const ExcelGeneratorCompras: React.FC<{ purchases: IPurchase[]; startDate: string; endDate: string }> = ({ purchases }) => {
    const [fileName, setFileName] = useState('Reporte Compras');

    const handleGenerateExcel = () => {
        const data: { [key: string]: string | number }[] = [];
        let totalGeneral = 0; // Inicializamos la suma total

        purchases.forEach((purchase, index) => {
            data.push({
                'Número de Compra': index + 1,
                'Nombre del Proveedor': purchase.supplierName,
                'RUC del Proveedor': purchase.supplierRuc,
                'Teléfono del Proveedor': purchase.supplierPhone,
                'Fecha de Compra': purchase.purchaseDate instanceof Date ?
                    purchase.purchaseDate.toLocaleDateString() :
                    new Date(purchase.purchaseDate).toLocaleDateString(),
                'Producto': purchase.productName,
                'Cantidad': purchase.quantity,
                'Monto Total': purchase.totalAmount.toFixed(2),
            });

            // Sumamos el total de la compra al total general
            totalGeneral += purchase.totalAmount;
        });

        // Agregamos la fila de suma total
        data.push({
            'Número de Compra': 'Total General',
            'Nombre del Proveedor': '',
            'RUC del Proveedor': '',
            'Teléfono del Proveedor': '',
            'Fecha de Compra': '',
            'Producto': '',
            'Cantidad': '',
            'Monto Total': totalGeneral.toFixed(2),
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Compras');

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <>
            <p className='text-green-500'>Nombre del Archivo Compras</p>
            <div className='space-x-2'>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Nombre del archivo"
                    className="border rounded p-3 bg-gray-50"
                />
                <button onClick={handleGenerateExcel} className="p-3 bg-blue-500 text-white rounded">
                    Excel De Compras
                </button>
            </div>
        </>
    );
};

export default ExcelGeneratorCompras;
