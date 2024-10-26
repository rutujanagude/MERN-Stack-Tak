import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import './App.css';

function App() {
  const [month, setMonth] = useState('March');  // Default month set to March
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [error, setError] = useState(null);  // State to capture errors

  // Fetch data from the backend combined API endpoint
  const fetchData = async () => {
    try {
        const { data } = await axios.get('http://localhost:5000/api/combined', { params: { month } });
        setTransactions(data.transactions);
        setStatistics(data.statistics);
        setBarChartData(data.barChart);
        setPieChartData(data.pieChart);
    } catch (err) {
        console.error('Error fetching data:', err);
        setError("An error occurred while fetching data. Please try again later.");
    }
};


  // Run fetchData whenever the month changes
  useEffect(() => {
    fetchData();
  }, [month]);

  return (
    <div className="app">
      <h1>MERN Stack Dashboard</h1>

      {/* Month selection dropdown */}
      <label htmlFor="month">Select Month: </label>
      <select
        id="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Display error message if there's an error */}
      {error && <p className="error">{error}</p>}

      {/* Render the components */}
      <TransactionTable transactions={transactions} />
      <Statistics statistics={statistics} />
      <BarChart data={barChartData} />
      <PieChart data={pieChartData} />
    </div>
  );
}

export default App;
