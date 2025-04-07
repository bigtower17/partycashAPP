const insertQuote = () => `
  INSERT INTO quotes (user_id, name, notes, amount, status)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id
`;

const updateQuoteById = () => `
  UPDATE quotes
  SET name = $1, notes = $2, amount = $3, updated_at = NOW()
  WHERE id = $4 AND status = $5 AND deleted = false
  RETURNING id
`;

const softDeleteQuote = () => `
  UPDATE quotes
  SET deleted = true, updated_at = NOW()
  WHERE id = $1 AND deleted = false
  RETURNING id
`;

const lockPendingQuote = () => `
  SELECT * FROM quotes
  WHERE id = $1 AND status = $2 AND deleted = false
  FOR UPDATE
`;

const insertVirtualDeposit = () => `
  INSERT INTO operations (user_id, type, amount, description, location_id)
  VALUES ($1, 'deposit_virtual', $2, $3, $4)
`;

const fetchBudgetForUpdate = () => `
  SELECT id, current_balance FROM budget LIMIT 1 FOR UPDATE
`;

const updateCentralBudget = () => `
  UPDATE budget
  SET current_balance = current_balance - $1, updated_at = NOW(), last_updated_by = $2
  WHERE id = $3
`;

const insertWithdrawalOperation = () => `
  INSERT INTO operations (user_id, type, amount, description)
  VALUES ($1, 'withdrawal', $2, $3)
`;

const markQuoteAsPaid = () => `
  UPDATE quotes
  SET status = $1, paid_by = $2, updated_at = NOW(), location_id = $3
  WHERE id = $4
`;


const getAllQuotes = () => `
  SELECT q.*, l.name AS location_name
  FROM quotes q
  LEFT JOIN location l ON q.location_id = l.id
  WHERE q.deleted = false
  ORDER BY q.created_at DESC
`;


const getQuoteByIdQuery = () => `
  SELECT * FROM quotes WHERE id = $1 AND deleted = false
`;

module.exports = {
  insertQuote,
  updateQuoteById,
  softDeleteQuote,
  lockPendingQuote,
  insertVirtualDeposit,
  fetchBudgetForUpdate,
  updateCentralBudget,
  insertWithdrawalOperation,
  markQuoteAsPaid,
  getAllQuotes,
  getQuoteByIdQuery
};
