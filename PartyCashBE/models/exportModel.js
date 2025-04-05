const getAllOperations = () => `
  SELECT o.id, o.type, o.amount::float AS amount, o.description, o.created_at,
         u.username AS user, l.name AS location
  FROM operations o
  LEFT JOIN users u ON o.user_id = u.id
  LEFT JOIN location l ON o.location_id = l.id
  ORDER BY o.created_at DESC
`;

const getAllLocations = () => `
  SELECT id, name FROM location ORDER BY name
`;

const getStartingCashTotal = () => `
  SELECT SUM(amount) AS total FROM starting_cash WHERE location_id = $1
`;

const getLocationBudget = () => `
  SELECT current_balance FROM location_budget WHERE location_id = $1
`;

const getOperationsCount = () => `
  SELECT COUNT(*) FROM operations WHERE location_id = $1
`;

const getOperationsByLocation = () => `
  SELECT type, amount, description, created_at
  FROM operations
  WHERE location_id = $1
  ORDER BY created_at ASC
`;

module.exports = {
  getAllOperations,
  getAllLocations,
  getStartingCashTotal,
  getLocationBudget,
  getOperationsCount,
  getOperationsByLocation,
};
