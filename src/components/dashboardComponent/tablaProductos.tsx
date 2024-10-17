"use client";
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/redux';
import axios from 'axios';

interface Product {
    name: string;
    stock: number;
}

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 11;
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.add("light");
        }
    }, [isDarkMode]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('../api/productos');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getStatus = (stock: number) => {
        if (stock === 0) {
            return { text: 'Sin Stock', color: 'bg-red-500' };
        } else if (stock > 0 && stock <= 15) {
            return { text: 'Stock bajo', color: 'bg-orange-500' };
        } else {
            return { text: 'Stock normal', color: 'bg-green-500' };
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md rounded-lg max-h-[800px]">
            <table className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} w-full text-sm text-center`}>
                <thead className={`${isDarkMode ? "bg-gray-200 text-gray-500" : "text-gray-700 bg-gray-200"} text-xs uppercase`}>
                    <tr>
                        <th className="px-6 py-3">Nombre del Producto</th>
                        <th className="px-6 py-3">Stock</th>
                        <th className="px-6 py-3">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product, index) => (
                        <tr key={index} className={`${isDarkMode ? "bg-gray-300 border-gray-900 hover:bg-gray-400" : "bg-white hover:bg-gray-50 border-b"}`}>
                            <th className={`${isDarkMode ? "text-white" : "text-gray-900"} px-6 py-4 whitespace-nowrap`}>{product.name}</th>
                            <td className={`${isDarkMode ? "text-gray-700" : "text-gray-950"} px-6 py-4`}>{product.stock}</td>
                            <td className="px-6 py-4">
                                <div className={` ${isDarkMode ? "text-gray-800" : "text-gray-950"} flex justify-center items-center`}>
                                    <div className={`h-2.5 w-2.5 rounded-full ${getStatus(product.stock).color} me-2`}></div>
                                    {getStatus(product.stock).text}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center my-4">
                <button
                    className={`px-4 py-2 mx-1 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <button
                    className={`px-4 py-2 mx-1 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentProducts.length < productsPerPage}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ProductTable;
