import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const GraficaPieResiduo = ({ width = 600, height = 450, maximized = false, year, month }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regRes = await axios.get('http://localhost:3001/api/register');
        let registers = regRes.data;

        // Filtrar por año y mes usando date_in
        registers = registers.filter(reg => {
          const date = new Date(reg.date_in);
          const regYear = date.getFullYear();
          const regMonth = String(date.getMonth() + 1).padStart(2, '0');
          if (regYear !== Number(year)) return false;
          if (month && regMonth !== month) return false;
          return true;
        });

        // Agrupar por nombre de residuo usando dangerous_waste API
        const residuoCounts = {};
        await Promise.all(
          registers.map(async (reg) => {
            if (reg.dw_id) {
              try {
                const dwRes = await axios.get(`http://localhost:3001/api/dangerous_waste/${reg.dw_id}`);
                const nombre = dwRes.data.name_spanish || 'Sin nombre';
                residuoCounts[nombre] = (residuoCounts[nombre] || 0) + 1;
              } catch (e) {
                // Si hay error, lo ignoramos para ese registro
              }
            }
          })
        );

        // Preparar datos para la gráfica
        const labels = Object.keys(residuoCounts);
        const values = Object.values(residuoCounts);

        setData({
          labels,
          datasets: [
            {
              label: 'Registros por Residuo (Español)',
              data: values,
              backgroundColor: [
                '#191970',
                'rgb(0, 0, 0)',
                'rgba(60, 60, 60, 0.6)',
                'rgba(100, 100, 100, 0.6)',
                'rgba(150, 150, 150, 0.6)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError('Error al cargar la gráfica de residuos');
        console.error(err);
      }
    };

    fetchData();
  }, [year, month]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Cargando gráfica...</div>;
  if (data.labels.length === 0) return <div>No hay datos para este periodo.</div>;

  return (
    <Pie
      data={data}
      width={width}
      height={height}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          title: { display: true, text: 'Distribución por Nombre de Residuo (Español)' },
        },
      }}
    />
  );
};

export default GraficaPieResiduo;