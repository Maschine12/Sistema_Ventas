"use client";
import React from "react";
import { Menu, Bell, Sun, Settings, Moon } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state/index";
import { usePathname } from "next/navigation"; // Importar el hook

const Navbar = () => {
    const dispatch = useAppDispatch();
    const pathname = usePathname(); // Obtener la ruta actual

    // Obtener los estados desde Redux
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };
    const toggleDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode)); // Usar isDarkMode
    };

    // Lógica para determinar el título
    const getTitle = () => {
        switch (pathname) {
            case "/dashboard":
                return "Panel";
            case "/clientes":
                return "Gestión de Clientes";
            case "/productos":
                return "Gestión de Productos";
            case "/proveedores":
                return "Gestión de Proveedores";
            case "/reportes":
                return "Reportes";
            case "/ventas":
                return "Ventas";
            default:
                return "DYNAMICS";
        }
    };

    return (
        <div className="flex justify-between items-center w-full mb-7">
            {/* Left side */}
            <div className="flex justify-between items-center gap-5">
                <button className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100" onClick={toggleSidebar}>
                    <Menu className="w-4 h-4" />
                </button>
            </div>
            <div>
                <h1 className="font-extrabold text-3xl text-center">{getTitle()}</h1>
            </div>
            {/* Right side */}
            <div className="flex justify-between items-center gap-5">
                <div className="hidden md:flex justify-between items-center gap-5">
                    <div>
                        <button onClick={toggleDarkMode}>
                            {isDarkMode ? (
                                <Sun className="cursor-pointer text-gray-500 " size={24} />
                            ) : (
                                <Moon className="cursor-pointer text-gray-500" size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
