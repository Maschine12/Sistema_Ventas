"use client";
import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { useAppSelector } from "../../app/redux";
import axios from "axios";

const ChartComponent: React.FC = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [ventasData, setVentasData] = useState<number[]>([]);
  const [comprasData, setComprasData] = useState<number[]>([]);
  const [utilidadesData, setUtilidadesData] = useState<number[]>([]);
  const [tiempo, setTiempo] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [ventasRes, comprasRes] = await Promise.all([
        axios.get("../api/ventas"),
        axios.get("../api/compras"),
      ]);

      const fechasAcumuladas: Record<string, { ventas: number; compras: number }> = {};
      const hoy = new Date();

      // Procesar las compras
      comprasRes.data.forEach((compra: { purchaseDate: string; totalAmount: number }) => {
        const fecha = new Date(compra.purchaseDate).toLocaleDateString();
        if (!fechasAcumuladas[fecha]) {
          fechasAcumuladas[fecha] = { ventas: 0, compras: 0 };
        }
        fechasAcumuladas[fecha].compras += compra.totalAmount;
      });

      // Procesar las ventas
      ventasRes.data.forEach((venta: { fecha: string; total: number }) => {
        const fecha = new Date(venta.fecha).toLocaleDateString();
        if (!fechasAcumuladas[fecha]) {
          fechasAcumuladas[fecha] = { ventas: 0, compras: 0 };
        }
        fechasAcumuladas[fecha].ventas += venta.total;
      });

      const ventasAcumuladas: number[] = [];
      const comprasAcumuladas: number[] = [];
      const utilidadesAcumuladas: number[] = [];
      let totalVentas = 0, totalCompras = 0;

      Object.keys(fechasAcumuladas).forEach(fecha => {
        totalVentas += fechasAcumuladas[fecha].ventas;
        totalCompras += fechasAcumuladas[fecha].compras;
        ventasAcumuladas.push(totalVentas);
        comprasAcumuladas.push(totalCompras);
        utilidadesAcumuladas.push(totalVentas - totalCompras);
      });

      setVentasData(ventasAcumuladas);
      setComprasData(comprasAcumuladas);
      setUtilidadesData(utilidadesAcumuladas);
      setTiempo(Object.keys(fechasAcumuladas));

    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const options = {
      chart: {
        height: "500px",
        type: "line",
        fontFamily: "Inter, sans-serif",
        toolbar: { show: false },
      },
      series: [
        { name: "Ventas", data: ventasData, color: isDarkMode ? "#007ea7" : "#fb8500" },
        { name: "Compras", data: comprasData, color: isDarkMode ? "#d62828" : "#023047" },
        { name: "Utilidades", data: utilidadesData, color: isDarkMode ? "#f77f00" : "#219ebc" },
      ],
      xaxis: {
        categories: tiempo,
        labels: {
          style: { cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400" },
        },
      },
      yaxis: { show: false},
      tooltip: { enabled: true, theme: isDarkMode ? "dark" : "light" },
      stroke: { curve: "smooth", width: 6 },
      dataLabels: { enabled: false },
      legend: { show: true },
    };

    const chartElement = document.getElementById("line-chart");
    if (chartElement) {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
      return () => chart.destroy();
    }
  }, [isDarkMode, ventasData, comprasData, utilidadesData, tiempo]);

  return (
    <div className={`${isDarkMode ? "dark" : "light"} w-full h-auto border border-gray-300 rounded-lg shadow p-4 md:p-6`}>
      <div className="flex justify-between mb-5">
        <p className={`${isDarkMode ? "text-gray-600" : "text-gray-700"} text-2xl leading-none font-bold py-2`}>
          Finanzas
        </p>
      </div>
      <div id="line-chart"></div>
    </div>
  );
};

export default ChartComponent;
