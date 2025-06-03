import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los scales y componentes necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaBarra = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const body = {
          fecha_inicio: `${currentYear}-01-01`,
          fecha_fin: `${currentYear}-12-31`
        };
        const res = await axios.post('http://localhost:3001/api/register/por-fecha', body);
        const apiData = res.data;

        // apiData es un array de objetos [{ month: "2025-01", total_quantity: 1.23 }, ...]
        const labels = apiData.map(item => item.month);
        const values = apiData.map(item => item.total_quantity);

        setData({
          labels,
          datasets: [
            {
              label: 'Cantidad total por mes',
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError('Error al cargar la gráfica');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Cargando gráfica...</div>;

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Registros por Mes' },
        },
      }}
    />
  );
};

export default GraficaBarra;