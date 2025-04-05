function findUserByLogin() {
  return `
    SELECT * FROM users WHERE (email = $1 OR username = $1) AND is_deleted = false
  `;
}

function createUser() {
  return `
    INSERT INTO users (email, password, username)
    VALUES ($1, $2, $3)
    RETURNING id, email, username, role, created_at
  `;
}

function insertUser() {
  return `
    INSERT INTO users (username, email, role, is_deleted)
    VALUES ($1, $2, $3, false)
    RETURNING id, username, email, role
  `;
}

function selectUserById() {
  return `
    SELECT id, username, email, role FROM users
    WHERE id = $1 AND is_deleted = false
  `;
}

function selectUsersByIds() {
  return `
    SELECT id, username, email, role FROM users
    WHERE id = ANY($1) AND is_deleted = false
  `;
}

function updateUserRoleInDB() {
  return `
    UPDATE users
    SET role = $1
    WHERE id = $2 AND is_deleted = false
    RETURNING id, username, email, role
  `;
}

function softDeleteUser() {
  return `
    UPDATE users
    SET is_deleted = true
    WHERE id = $1 AND is_deleted = false
    RETURNING id
  `;
}

function selectAllUsers() {
  return `
    SELECT id, username, email, role FROM users
    WHERE is_deleted = false
    ORDER BY id
  `;
}

function updateUserPassword() {
  return `
    UPDATE users
    SET password = $1
    WHERE id = $2 AND is_deleted = false
    RETURNING id, username, email, role
  `;
}

module.exports = {
  findUserByLogin,
  createUser,
  insertUser,
  selectUserById,
  selectUsersByIds,
  updateUserRoleInDB,
  softDeleteUser,
  selectAllUsers,
  updateUserPassword
};
