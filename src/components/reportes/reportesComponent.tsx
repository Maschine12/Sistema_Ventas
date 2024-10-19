import React, { useEffect, useState } from 'react';
import DateRangePicker from './datePicker';
import ExcelGeneratorVentas from './excelGeneradorVentas';
import ExcelGeneratorCompras from './excelGeneradorCompras';
import ExcelGeneratorLowStock from './excelGeneradorBajoStock';

interface IProductoVenta {
    productId: string;
    name: string;
    cantidad: number;
    precioUnitario: number;
}

interface IVenta {
    productos: IProductoVenta[];
    total: number;
    tipoComprobante: string;
    fecha: Date;
}

interface IPurchase {
    supplierName: string;
    supplierRuc: string;
    supplierPhone: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    purchaseDate: Date;
}

interface IProduct {
    name: string;
    category: string;
    priceSale: number;
    pricePurchase: number;
    stock: number;
    createdAt: Date | string;
}

const ReportComponent: React.FC = () => {
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [sales, setSales] = useState<IVenta[]>([]);
    const [purchases, setPurchases] = useState<IPurchase[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<IProduct[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/ventas');
            const data: IVenta[] = await response.json();
            const salesWithPrices = data.map(sale => ({
                ...sale,
                productos: sale.productos.map(prod => ({
                    ...prod,
                    precioUnitario: prod.precioUnitario || 0,
                })),
            }));
            setSales(salesWithPrices);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const fetchPurchases = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/compras');
            const data: IPurchase[] = await response.json();
            setPurchases(data);
        } catch (error) {
            console.error('Error fetching purchases:', error);
        }
    };

    const fetchLowStockProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/productos'); // Ajusta la URL si es necesario
            const data: IProduct[] = await response.json();
            const lowStock = data.filter(product => product.stock < 10);
            setLowStockProducts(lowStock);
        } catch (error) {
            console.error('Error fetching low stock products:', error);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchPurchases();
        fetchLowStockProducts(); // Llama a la nueva función para obtener productos de bajo stock
    }, []);

    const handleDateChange = (start: string, end: string) => {
        setDateRange({ start, end });
        if (new Date(start) > new Date(end)) {
            setError('La fecha inicial debe ser menor o igual a la fecha de fin.');
        } else {
            setError(null);
        }
    };

    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.fecha);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return saleDate >= startDate && saleDate <= endDate;
    });

    const filteredPurchases = purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.purchaseDate);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return purchaseDate >= startDate && purchaseDate <= endDate;
    });

    return (

        <>
            <div className='p-3 grid grid-cols-2 gap-2 w-full'>
                <div className="bg-gray-100 rounded p-3 w-full">
                    <DateRangePicker onDateChange={handleDateChange} />
                    {error && <p className="text-red-500">{error}</p>}
                    {dateRange.start && dateRange.end && !error ? (
                        <div className='grid grid-cols-1 space-y-2'>
                            <ExcelGeneratorVentas sales={filteredSales} startDate={dateRange.start} endDate={dateRange.end} />
                            <ExcelGeneratorCompras purchases={filteredPurchases} startDate={dateRange.start} endDate={dateRange.end} />
                        </div>
                    ) : (
                        !error && <p className="text-red-500">Por favor, selecciona un rango de fechas.</p>
                    )}
                </div>
                <div className='mx-5 bg-gray-100 rounded p-3 w-full'>
                    <h1 className="text-2xl font-bold mb-4">Reporte de Productos Stock Bajo</h1>
                    <ExcelGeneratorLowStock products={lowStockProducts} />
                </div>
            </div>
        </>
    );
};

export default ReportComponent;
