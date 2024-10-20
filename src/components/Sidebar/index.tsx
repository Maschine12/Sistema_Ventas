"use client";
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import { BookUser, Clipboard, FileChartColumn, Layout, LucideIcon, Menu, Package, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import Image from "next/image";
interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
    isCollapsed: boolean;
}

const SidebarLink = ({
    href,
    icon: Icon,
    label,
    isCollapsed
}: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname == href || (pathname === "/" && href === "/dashboard");
    return (
        <Link href={href} >
            <div className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center" : "justify-start px-8 py-4"} text-align
            hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${isActive ? "bg-blue-200 text-white py-6" : "py-4"}`}>

                <Icon className='w-6 h-6 !text-gray-700' />
                <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700`}>
                    {label}
                </span>
            </div>
        </Link>
    )
}


const Sidebar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );
    const toogleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
    };

    const sidebarClassNames = `fixed flex flex-col ${isSidebarCollapsed ? "w-0 md:w-20" : "w-72 md:w-64"} bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`

    return (
        <div className={sidebarClassNames}>
            {/* TOP LOGO*/}
            <div className={`flex flex-col-2 items-center justify-center gap-3 pt-3 ${isSidebarCollapsed ? "px-3" : "px-5"}`}>
                <div className='col-span-1'>
                    <Image src="/images/Logo.jpg" alt="Logo Empresa" width={150} height={150} className='border rounded-xl ' />
                    <h1 className={`${isSidebarCollapsed ? "hidden" : "block"} font-extrabold text-2xl text-center pb-3`}>Dynamics</h1>
                </div>
                <button className='md:hidden px-2 py-2 bg-gray-100 rounded-full hover:bg-blue-100' onClick={toogleSidebar}>
                    <Menu className='w-5 h-5' />
                </button>
            </div>

            {/* LINKS */}
            <div className='flex-grow'>
                {/* aqui los links */}
                <SidebarLink href='/dashboard' icon={Layout} label="Panel" isCollapsed={isSidebarCollapsed} />
                <SidebarLink href='/clientes' icon={BookUser} label="Clientes" isCollapsed={isSidebarCollapsed} />
                <SidebarLink href='/productos' icon={Clipboard} label="Productos" isCollapsed={isSidebarCollapsed} />
                <SidebarLink href='/proveedores' icon={Package} label="Proveedores" isCollapsed={isSidebarCollapsed} />
                <SidebarLink href='/reportes' icon={FileChartColumn} label="Reportes" isCollapsed={isSidebarCollapsed} />
                <SidebarLink href='/ventas' icon={ShoppingCart} label="Ventas" isCollapsed={isSidebarCollapsed} />
            </div>
            {/* Footer */}
            <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
                <p className='text-center text-xs text-gray-500'>
                    &copy; 2024 BrunoTech Dynamics.Inc
                </p>
            </div>
        </div>
    )
}

export default Sidebar