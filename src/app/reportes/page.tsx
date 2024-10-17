"use client"
import React, { useState } from 'react';
import ReportComponent from '../../components/reportes/reportesComponent';

interface Usuario {
  rol: 'administrador' | 'vendedor';
  nombre: string;
}

const usuarioAdmin: Usuario = { rol: 'administrador', nombre: 'Admin' };

const Home: React.FC = () => {
  const [usuario] = useState<Usuario>(usuarioAdmin);

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Reportes</h1>
      <div className="flex mb-2 p-1">
        <ReportComponent />
      </div>
    </>
  );
};

export default Home;
