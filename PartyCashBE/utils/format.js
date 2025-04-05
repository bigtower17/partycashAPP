function formatCurrency(value) {
    const amount = Number(value);
    return isNaN(amount) ? '0.00' : amount.toFixed(2);
  }
  function formatOperationRow(op) {
    return {
      id: op.id,
      type: op.type,
      amount: formatCurrency(op.amount),
      description: op.description || '',
      created_at: new Date(op.created_at).toLocaleString(),
      user: op.user || '',
      location: op.location || '',
    };
  }
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString();
  }
  
  module.exports = {
    formatCurrency,
    formatOperationRow,
    formatDate,
  };
  