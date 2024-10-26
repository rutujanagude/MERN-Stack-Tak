function TransactionTable({ transactions }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Sold</th>
          <th>Date of Sale</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr key={transaction._id}>
            <td>{transaction.title}</td>
            <td>{transaction.description}</td>
            <td>{transaction.price}</td>
            <td>{transaction.sold ? 'Yes' : 'No'}</td>
            <td>{transaction.dateOfSale}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;
