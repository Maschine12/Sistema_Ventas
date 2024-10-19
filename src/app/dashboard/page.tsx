"use client";

import React, { useEffect, useState } from 'react';
import ChartComponent from "@/components/dashboardComponent/chartComponent";
import Card_Finanzas from '../../components/dashboardComponent/card-finanzas';
import { Banknote, HandCoins, HeartPulse, ShoppingCart } from 'lucide-react';
import ProductTable from "@/components/dashboardComponent/tablaProductos";
import Card_Ratio from '@/components/dashboardComponent/card-ratio';

const Dashboard = () => {
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalCompras, setTotalCompras] = useState(0);
  const [utilidad, setUtilidad] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [isVentasUp, setIsVentasUp] = useState(true);
  const [isComprasUp, setIsComprasUp] = useState(true);
  const [isUtilidadUp, setIsUtilidadUp] = useState(false);
  const [isRatioUp, setIsRatioUp] = useState(false);
  const [indicadorVentas, setIndicadorVentas] = useState(0);
  const [indicadorCompras, setIndicadorCompras] = useState(0);

  const updateCardStatus = (ventas: number, compras: number, utilidad: number, ratio: number) => {
    setIsVentasUp(ventas > compras);
    setIsComprasUp(compras > ventas);
    setIsUtilidadUp(utilidad > 0);
    setIsRatioUp(ratio > 1);
    setIndicadorVentas(ventas - compras);
    setIndicadorCompras(ventas - compras);
  };

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ventas');
        const data = await response.json();

        // Sumar los totales de las ventas
        const total = data.reduce((accumulator: number, venta: { total: number; }) =>
          accumulator + (venta.total || 0), 0);
        setTotalVentas(Number(total.toFixed(2))); // Redondear a 2 decimales
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    const fetchCompras = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/compras');
        const data = await response.json();

        // Sumar los totales de las compras asegurándose de que son números
        const total = data.reduce((accumulator: number, compra: { totalAmount: number; }) => {
          return accumulator + (compra.totalAmount || 0); // Asegúrate de que sea un número, o suma 0 si no hay
        }, 0);
        setTotalCompras(Number(total.toFixed(2))); // Redondear a 2 decimales
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      }
    };

    fetchVentas();
    fetchCompras();
  }, []);

  useEffect(() => {
    // Calcular utilidad y ratio cuando se actualizan las ventas o compras
    const calculatedUtilidad = Number((totalVentas - totalCompras).toFixed(2));
    const calculatedRatio = totalCompras > 0 ? Number((totalVentas / totalCompras).toFixed(4)) : 0;

    setUtilidad(calculatedUtilidad);
    setRatio(calculatedRatio);

    // Actualizar el estado de las tarjetas con los valores calculados
    updateCardStatus(totalVentas, totalCompras, calculatedUtilidad, calculatedRatio);
  }, [totalVentas, totalCompras]);

  return (
    <>
      {/* Tarjetas de Finanzas */}
      <div className='mx-auto py-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full'>
        <Card_Finanzas icon={<ShoppingCart />} mount={(totalVentas.toFixed(2)).toString()} desc={'Ventas'} up={isVentasUp} p={(indicadorVentas.toFixed(2)).toString()} />
        <Card_Finanzas icon={<Banknote />} mount={(totalCompras.toFixed(2)).toString()} desc={'Compras'} up={isComprasUp} p={(indicadorCompras.toFixed(2)).toString()} />
        <Card_Finanzas icon={<HandCoins />} mount={utilidad.toString()} desc={'Utilidades'} up={isUtilidadUp} p={(((ratio - 1).toFixed(4)).toString())} />
        <Card_Ratio icon={<HeartPulse />} mount={ratio.toString()} desc={'Ratio de Desempeño'} up={isRatioUp} p={(((ratio - 1) * 100).toFixed(4)).toString()} />
      </div>

      {/* Gráfico y Tabla de Usuarios */}
      <div className='grid grid-cols-4 gap-4 py-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4'>
        <div className='col-span-4 sm:col-span-1 md:col-span-1 lg:col-span-3'>
          <ChartComponent />
        </div>
        <div className='col-span-4 sm:col-span-1 md:col-span-1 lg:col-span-1'>
          <ProductTable />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
