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

const GraficaBarra = ({ width = 400, height = 300, maximized = false, year, month }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fecha_inicio = `${year}-01-01`;
        let fecha_fin = `${year}-12-31`;
        if (month) {
          // If month is selected, restrict to that month
          fecha_inicio = `${year}-${month}-01`;
          // Get last day of month
          const lastDay = new Date(year, Number(month), 0).getDate();
          fecha_fin = `${year}-${month}-${lastDay}`;
        }
        const body = { fecha_inicio, fecha_fin };
        const res = await axios.post('http://localhost:3001/api/register/por-fecha', body);
        const apiData = res.data;

        const labels = apiData.map(item => item.month);
        const values = apiData.map(item => item.total_quantity);

        setData({
          labels,
          datasets: [
            {
              label: 'Cantidad total por mes',
              data: values,
              backgroundColor: '#191970',
              borderColor: '#191970',
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
  }, [year, month]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Cargando gráfica...</div>;

  return (
    <Bar
      data={data}
      width={width}
      height={height}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Registros por Mes' },
        },
      }}
    />
  );
};

export default GraficaBarra;