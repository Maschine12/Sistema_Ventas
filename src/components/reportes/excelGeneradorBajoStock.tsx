import React from 'react';
import * as XLSX from 'xlsx';

interface IProduct {
    name: string;
    category: string;
    priceSale: number;
    pricePurchase: number;
    stock: number;
    createdAt: Date | string;
}

interface ExcelGeneratorLowStockProps {
    products: IProduct[];
}

const ExcelGeneratorLowStock: React.FC<ExcelGeneratorLowStockProps> = ({ products }) => {
    const [fileName, setFileName] = React.useState('Stock'); // Cambiado a 'Stock'

    const handleGenerateExcel = () => {
        const data = products.map((product, index) => ({
            'Número': index + 1,
            'Nombre del Producto': product.name,
            'Categoría': product.category,
            'Precio de Venta': product.priceSale.toFixed(2),
            'Precio de Compra': product.pricePurchase.toFixed(2),
            'Stock': product.stock,
            'Fecha de Creación': product.createdAt instanceof Date ?
                product.createdAt.toLocaleDateString() :
                new Date(product.createdAt).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos con Bajo Stock');

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <>
            <p className='text-green-500 mb-1'>Nombre del Archivo Stock</p>
            <div className='space-x-2'>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Nombre del archivo"
                    className="border rounded p-3 bg-gray-50"
                />
                <button onClick={handleGenerateExcel} className="p-3 bg-blue-500 text-white rounded">
                    Excel de Stock
                </button>
            </div>
        </>
    );
};

export default ExcelGeneratorLowStock;
