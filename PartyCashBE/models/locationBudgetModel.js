const getLocationBudget = () => `
  SELECT lb.current_balance, l.name AS location_name, lb.updated_at, lb.last_updated_by
  FROM location_budget lb
  JOIN location l ON lb.location_id = l.id
  WHERE lb.location_id = $1
`;

const checkBudgetExists = () => `
  SELECT current_balance FROM location_budget WHERE location_id = $1 FOR UPDATE
`;

const insertNewBudget = () => `
  INSERT INTO location_budget (location_id, current_balance, updated_at, last_updated_by)
  VALUES ($1, $2, NOW(), $3)
`;

const incrementExistingBudget = () => `
  UPDATE location_budget
  SET current_balance = current_balance + $1, updated_at = NOW(), last_updated_by = $2
  WHERE location_id = $3
`;

const updateBudget = () => `
  UPDATE location_budget
  SET current_balance = $1, updated_at = NOW(), last_updated_by = $2
  WHERE location_id = $3
`;

const getAllBudgets = () => `
  SELECT lb.current_balance, lb.updated_at, lb.last_updated_by, lb.location_id, l.name AS location_name
  FROM location_budget lb
  JOIN location l ON lb.location_id = l.id
  ORDER BY l.name
`;
// Fetch all POS operations (is_pos = true)
function getPosOperations() {
  return `
    SELECT id, amount, type, description, created_at, user_id, location_id
    FROM operations
    WHERE is_pos = TRUE
    ORDER BY created_at DESC
    LIMIT 100
  `;
}

// Fetch all cash operations (is_pos = false)
function getCashOperations() {
  return `
    SELECT id, amount, type, description, created_at, user_id, location_id
    FROM operations
    WHERE is_pos = FALSE
    ORDER BY created_at DESC
    LIMIT 100
  `;
}
module.exports = {
  getLocationBudget,
  checkBudgetExists,
  insertNewBudget,
  incrementExistingBudget,
  updateBudget,
  getAllBudgets,
  getCashOperations,
  getPosOperations
};