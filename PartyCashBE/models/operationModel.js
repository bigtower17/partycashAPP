// src/models/operationModel.js

function insertOperation() {
  return `
    INSERT INTO operations (user_id, type, amount, description, location_id, is_pos)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;
}


function updateSharedBudget() {
  return `
    UPDATE budget
    SET current_balance = current_balance + $1,
        updated_at = NOW(),
        last_updated_by = $2
    WHERE is_shared = TRUE
  `;
}
 

function updateSharedBudgetWithdraw() {
  return `
    UPDATE budget
    SET current_balance = current_balance - $1, updated_at = NOW(), last_updated_by = $2
    WHERE id = 1
  `;
}

function upsertLocationBudget() {
  return `
    INSERT INTO location_budget (location_id, current_balance, updated_at, last_updated_by)
    VALUES ($1, $2, NOW(), $3)
    ON CONFLICT (location_id) DO UPDATE
    SET current_balance = location_budget.current_balance + $2,
        updated_at = NOW(),
        last_updated_by = $3
  `;
}

function insertWithdrawal() {
  return `
    INSERT INTO operations (user_id, type, amount, description)
    VALUES ($1, 'withdrawal', $2, $3)
    RETURNING id
  `;
}


function getBudgetBalance() {
  return `
    SELECT current_balance FROM budget LIMIT 1
  `;
}

function getLastOperations() {
  return `
    SELECT description, amount, type, created_at, user_id 
    FROM operations 
    ORDER BY created_at DESC 
    LIMIT 100
  `;
}

function getOperationsWithLocation() {
  return `
    SELECT 
      o.id, o.amount, o.type, o.description, o.created_at, 
      o.user_id, o.location_id, l.name AS location_name 
    FROM operations o
    LEFT JOIN location l ON o.location_id = l.id
    ORDER BY o.created_at DESC
    LIMIT 100
  `;
}

function checkLocationExists() {
  return `
    SELECT id FROM location WHERE id = $1
  `;
}
function checkLocationBudgetExists() {
  return `
    SELECT 1 FROM location_budget WHERE location_id = $1 FOR UPDATE
  `;
}

function insertLocationBudget() {
  return `
    INSERT INTO location_budget (location_id, current_balance, updated_at, last_updated_by)
    VALUES ($1, $2, NOW(), $3)
  `;
}

function updateSharedBudgetByAmount() {
  return `
    UPDATE budget
    SET current_balance = current_balance + $1,
        updated_at = NOW(),
        last_updated_by = $2
    WHERE is_shared = TRUE
  `;
}

// If you want to unify your getBudgetBalance() to also look for is_shared = TRUE:
function getBudgetBalance() {
  return `
    SELECT current_balance 
    FROM budget
    WHERE is_shared = TRUE
    LIMIT 1
  `;
}


module.exports = {
  insertOperation,
  updateSharedBudget,
  updateSharedBudgetWithdraw,
  upsertLocationBudget,
  insertWithdrawal,
  getBudgetBalance,
  getLastOperations,
  getOperationsWithLocation,
  checkLocationExists,
  checkLocationBudgetExists,
  insertLocationBudget,
  updateSharedBudgetByAmount,
  getBudgetBalance,

};
