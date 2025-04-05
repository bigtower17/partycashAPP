const getAssignedStartingCash = () => `
  SELECT sc.amount, sc.created_at, u.username AS assigned_by
  FROM starting_cash sc
  LEFT JOIN users u ON sc.assigned_by = u.id
  WHERE sc.location_id = $1
`;

const getAllStartingCash = () => `
  SELECT 
    sc.id, sc.location_id, l.name AS location, sc.amount, sc.created_at,
    u.username AS assigned_by,
    ru.username AS recovered_by,
    sc.recovered_at, sc.recovery_notes
  FROM starting_cash sc
  LEFT JOIN users u ON sc.assigned_by = u.id
  LEFT JOIN users ru ON sc.recovered_by = ru.id
  LEFT JOIN location l ON sc.location_id = l.id
  ORDER BY sc.created_at DESC
`;

const insertStartingCash = () => `
  INSERT INTO starting_cash (location_id, amount, assigned_by)
  VALUES ($1, $2, $3)
  RETURNING id, created_at
`;

const updateLocationBudgetAdd = () => `
  UPDATE location_budget
  SET current_balance = current_balance + $1, updated_at = NOW(), last_updated_by = $2
  WHERE location_id = $3
`;

const updateLocationBudgetSubtract = () => `
  UPDATE location_budget
  SET current_balance = current_balance - $1, updated_at = NOW(), last_updated_by = $2
  WHERE location_id = $3
`;

const insertOperation = () => `
  INSERT INTO operations (user_id, type, amount, description, location_id)
  VALUES ($1, $2, $3, $4, $5)
`;

const selectForRecovery = () => `
  SELECT sc.*, l.name AS location_name
  FROM starting_cash sc
  JOIN location l ON sc.location_id = l.id
  WHERE sc.id = $1 AND sc.recovered_at IS NULL
  FOR UPDATE
`;

const updateStartingCashRecovery = () => `
  UPDATE starting_cash
  SET recovered_at = NOW(), recovered_by = $1, recovery_notes = $2
  WHERE id = $3
`;

module.exports = {
  getAssignedStartingCash,
  getAllStartingCash,
  insertStartingCash,
  updateLocationBudgetAdd,
  updateLocationBudgetSubtract,
  insertOperation,
  selectForRecovery,
  updateStartingCashRecovery,
  
};
