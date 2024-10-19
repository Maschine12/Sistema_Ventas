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

  const saveDailyData = (ventas: number, compras: number) => {
    const today = new Date().toLocaleDateString();
    const dailyData = { fecha: today, ventas, compras };
    // Guardar los datos en localStorage o en un API
    localStorage.setItem('dailyData', JSON.stringify(dailyData));
  };

  const fetchData = async () => {
    try {
      const [ventasRes, comprasRes] = await Promise.all([
        axios.get("../api/ventas"),
        axios.get("../api/compras"),
      ]);

      const comprasOrdenadas = comprasRes.data.sort(
        (a: { purchaseDate: string }, b: { purchaseDate: string }) =>
          new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
      );

      const primeraFecha = new Date(comprasOrdenadas[0].purchaseDate);
      const hoy = new Date();
      const fechasAcumuladas: Record<string, { ventas: number; compras: number }> = {};

      for (let d = primeraFecha; d <= hoy; d.setDate(d.getDate() + 1)) {
        const fechaFormateada = d.toLocaleDateString();

        const ventasDelDia = ventasRes.data
          .filter((venta: { fecha: string }) => new Date(venta.fecha).toLocaleDateString() === fechaFormateada)
          .reduce((acc: number, venta: { total: number }) => acc + venta.total, 0);

        const comprasDelDia = comprasOrdenadas
          .filter((compra: { purchaseDate: string }) => new Date(compra.purchaseDate).toLocaleDateString() === fechaFormateada)
          .reduce((acc: number, compra: { totalAmount: number }) => acc + compra.totalAmount, 0);

        if (!fechasAcumuladas[fechaFormateada]) {
          fechasAcumuladas[fechaFormateada] = { ventas: 0, compras: 0 };
        }
        fechasAcumuladas[fechaFormateada].ventas += ventasDelDia;
        fechasAcumuladas[fechaFormateada].compras += comprasDelDia;
      }

      const ventasAcumuladas: number[] = [];
      const comprasAcumuladas: number[] = [];
      const utilidadesAcumuladas: number[] = [];
      const fechasFormateadas = Object.keys(fechasAcumuladas);

      let totalVentas = 0;
      let totalCompras = 0;

      fechasFormateadas.forEach((fecha) => {
        totalVentas += fechasAcumuladas[fecha].ventas;
        totalCompras += fechasAcumuladas[fecha].compras;

        ventasAcumuladas.push(totalVentas);
        comprasAcumuladas.push(totalCompras);
        utilidadesAcumuladas.push(totalVentas - totalCompras);
      });

      setVentasData(ventasAcumuladas);
      setComprasData(comprasAcumuladas);
      setUtilidadesData(utilidadesAcumuladas);
      setTiempo(fechasFormateadas);

      // Guardar los últimos datos de ventas y compras al final del día
      saveDailyData(totalVentas, totalCompras);
      
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    fetchData();

    const dayInMillis = 24 * 60 * 60 * 1000; // Milisegundos en un día
    const intervalId = setInterval(() => {
      fetchData();
    }, dayInMillis);

    return () => clearInterval(intervalId); // Limpiar intervalo al desmontar
  }, []);

  useEffect(() => {
    const maxValue = Math.max(...ventasData, ...comprasData, ...utilidadesData);

    const options = {
      chart: {
        height: "500px",
        width: "100%",
        type: "line",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: "Ventas",
          data: ventasData,
          color: isDarkMode ? "#007ea7" : "#fb8500",
        },
        {
          name: "Compras",
          data: comprasData,
          color: isDarkMode ? "#d62828" : "#023047",
        },
        {
          name: "Utilidades",
          data: utilidadesData,
          color: isDarkMode ? "#f77f00" : "#219ebc",
        },
      ],
      xaxis: {
        categories: tiempo,
        labels: {
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
          },
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        min: -50,
        max: maxValue + 20,
        show: false,
      },
      grid: {
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -26,
        },
      },
      tooltip: {
        enabled: true,
        theme: isDarkMode ? "dark" : "light",
        style: {
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
          background: isDarkMode ? "dark" : "light",
          color: isDarkMode ? "dark" : "light",
        },
        x: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
        width: 6,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
      },
    };

    const chartElement = document.getElementById("line-chart");
    if (chartElement) {
      const chart = new ApexCharts(chartElement, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [isDarkMode, ventasData, comprasData, utilidadesData, tiempo]);

  return (
    <div className={`${isDarkMode ? "dark" : "light"} w-full h-auto border border-gray-300 rounded-lg shadow p-4 md:p-6`}>
      <div className="flex justify-between mb-5">
        <div>
          <p className={`${isDarkMode ? "text-gray-600":"text-gray-700"} text-2xl leading-none font-bold py-2`}>Finanzas</p>
        </div>
      </div>
      <div id="line-chart"></div>
    </div>
  );
};

export default ChartComponent;
