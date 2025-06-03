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

const GraficaPieArticulo = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get all registers
        const regRes = await axios.get('http://localhost:3001/api/register');
        const registers = regRes.data;

        // 2. Get dangerous_waste info for each register
        const articleCounts = {};
        await Promise.all(
          registers.map(async (reg) => {
            if (reg.dw_id) {
              try {
                const dwRes = await axios.get(`http://localhost:3001/api/dangerous_waste/${reg.dw_id}`);
                const article = dwRes.data.article || 'Sin artículo';
                articleCounts[article] = (articleCounts[article] || 0) + 1;
              } catch (e) {
                // Si hay error, lo ignoramos para ese registro
              }
            }
          })
        );

        // 3. Prepare data for Pie chart
        const labels = Object.keys(articleCounts);
        const values = Object.values(articleCounts);

        setData({
          labels,
          datasets: [
            {
              label: 'Registros por Artículo',
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
        setError('Error al cargar la gráfica de artículos');
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
          title: { display: true, text: 'Distribución por Artículo' },
        },
      }}
    />
  );
};

export default GraficaPieArticulo;