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

const GraficaPieResponsable = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/register');
        const registers = res.data;

        // Contar ocurrencias por responsable
        const responsibleCounts = {};
        registers.forEach(reg => {
          const responsible = reg.responsible || 'Sin responsable';
          responsibleCounts[responsible] = (responsibleCounts[responsible] || 0) + 1;
        });

        const labels = Object.keys(responsibleCounts);
        const values = Object.values(responsibleCounts);

        setData({
          labels,
          datasets: [
            {
              label: 'Registros por Responsable',
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)'
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError('Error al cargar la gráfica de responsables');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Cargando gráfica...</div>;

  return (
    <Pie
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom' },
          title: { display: true, text: 'Distribución por Responsable' },
        },
      }}
    />
  );
};

export default GraficaPieResponsable;