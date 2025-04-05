const getSharedBudget = () => `
  SELECT current_balance FROM budget LIMIT 1
`;

const updateSharedBudgetAdd = () => `
  UPDATE budget
  SET current_balance = current_balance + $1, updated_at = NOW(), last_updated_by = $2
`;

const updateSharedBudgetSubtract = () => `
  UPDATE budget
  SET current_balance = current_balance - $1, updated_at = NOW(), last_updated_by = $2
`;

module.exports = {
  getSharedBudget,
  updateSharedBudgetAdd,
  updateSharedBudgetSubtract
};
