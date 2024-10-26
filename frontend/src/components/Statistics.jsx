function Statistics({ statistics }) {
  return (
    <div className="statistics">
      <div>Total Sale Amount: ${statistics.totalSaleAmount}</div>
      <div>Total Sold Items: {statistics.soldItems}</div>
      <div>Total Not Sold Items: {statistics.unsoldItems}</div>
    </div>
  );
}

export default Statistics;
