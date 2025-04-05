function formatOperations(operations) {
    return operations.map(op => ({
      id: op.id,
      type: op.type,
      amount: Number(op.amount).toFixed(2),
      description: op.description || '-',
      created_at: new Date(op.created_at).toLocaleString()
    }));
  }
  
  module.exports = { formatOperations };
  