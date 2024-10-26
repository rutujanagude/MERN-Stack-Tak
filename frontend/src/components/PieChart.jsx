import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        label: 'Categories',
        data: data.map(item => item.count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FFCD56', '#4D5360', '#F7464A', '#46BFBD'
        ]
      }
    ]
  };

  return (
    <div className="pie-chart">
      <Pie data={chartData} />
    </div>
  );
}

export default PieChart;
