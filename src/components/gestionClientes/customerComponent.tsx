"use client";
import React, { useState } from 'react';
import CustomerForm from './customerForm';
import CustomerList from './customerList';
import CustomerUpdate from './customerUpdate'

const CustomersComponent: React.FC = () => {

    return (
        <>
            <div className='grid grid-cols-4 gap-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4'>
                <div className='col-span-4 sm:col-span-1 md:col-span-1 lg:col-span-2'>
                    <div>
                        <CustomerList categoryFilter={''} />
                    </div>
                </div>
                <div className='pt-8 col-span-4 sm:col-span-1 md:col-span-1 lg:col-span-1'>
                    <div className='pt-8'></div>
                    <CustomerForm />
                </div>
                <div className='pt-8 col-span-4 sm:col-span-1 md:col-span-1 lg:col-span-1'>
                    <div className='pt-8'></div>
                    <CustomerUpdate />
                </div>
            </div>

        </>

    );
};

export default CustomersComponent;
