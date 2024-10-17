"use client";
import React, { useState } from 'react';
import CustomerForm from './customerForm';
import CustomerList from './customerList';
import CustomerUpdate from './customerUpdate'

const CustomersComponent: React.FC = () => {

    return (
        <>
            <h1 className="text-2xl font-bold">GESTIÓN DE CLIENTES</h1>
            <div className='grid grid-cols-5 gap-4 py-2'>
                <div className='col-span-3'>
                    <CustomerList categoryFilter={''} />
                </div>
                <div className='col-span-1 mt-11 h-auto'>
                    <div className='p-2'>
                    </div>
                    <CustomerForm />
                </div>
                <div className='col-span-1 mt-11 h-auto'>
                    <div className='p-2'>
                    </div>
                    <CustomerUpdate />
                </div>
            </div>

        </>
    );
};

export default CustomersComponent;
