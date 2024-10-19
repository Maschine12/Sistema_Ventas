"use client";
import React from 'react';
import ProductList from './productList';
import ProductForm from './productForm';
import ProductUpdateForm from './productUpdateForm';

const ProductosComponent: React.FC = () => {
    return (
        <>
            <div className='grid grid-cols-4 gap-10 py-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4'>
                <div className='col-span-4 sm:col-span-1 md:col-span-1 lg:col-span-2'>
                    <div>
                        <ProductList categoryFilter={''} />
                    </div>
                </div>
                <div className='pt-8 col-span-4 sm:col-span-1 md:col-span-1 lg:col-span-1 space-y-4'>
                    <ProductForm />
                </div>
                <div className='pt-8 col-span-4 sm:col-span-1 md:col-span-1 lg:col-span-1 space-y-4'>
                    <ProductUpdateForm />
                </div>
            </div>
        </>
    );
};

export default ProductosComponent;
