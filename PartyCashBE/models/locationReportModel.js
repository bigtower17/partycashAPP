const getAllLocations = () => `
  SELECT id, name FROM location ORDER BY name
`;

const getStartingCashSum = () => `
  SELECT COALESCE(SUM(amount), 0) AS total
  FROM starting_cash
  WHERE location_id = $1 AND recovered_at IS NULL
`;

const getLocationBudget = () => `
  SELECT current_balance FROM location_budget WHERE location_id = $1
`;

const getOperationsByLocation = () => `
  SELECT id, type, amount, description, created_at
  FROM operations
  WHERE location_id = $1
  ORDER BY created_at DESC
`;

module.exports = {
  getAllLocations,
  getStartingCashSum,
  getLocationBudget,
  getOperationsByLocation
};
