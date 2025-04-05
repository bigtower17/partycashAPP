function validatePositiveNumber(value, field = 'value') {
    if (isNaN(value) || Number(value) <= 0) {
      throw new Error(`${field} must be a positive number`);
    }
  }
  
  function validateRequired(field, name) {
    if (field === undefined || field === null || field === '') {
      throw new Error(`${name} is required`);
    }
  }
  function validateAmount(amount) {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error('Invalid amount. Must be a positive number.');
    }
    return num;
  }

  const validRoles = ['admin', 'staff', 'auditor'];

function validateRole(role) {
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role value');
  }
}
function validateLocationName(name) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Location name is required and must be a non-empty string');
  }
  return name.trim();
}

  module.exports = {
    validatePositiveNumber,
    validateRequired,
    validateAmount,
    validateRole,
    validateLocationName
  };
  