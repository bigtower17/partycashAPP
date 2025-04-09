/**
 * Returns a SQL string used to find a user by login.
 */
function findUserByLoginQuery() {
  return `
    SELECT * FROM users
    WHERE (email = $1 OR username = $1)
      AND is_deleted = false
  `;
}

/**
 * Returns a SQL string for creating a new auth user (with password).
 */
function createUserQuery() {
  return `
    INSERT INTO users (email, password, username, role, is_deleted)
    VALUES ($1, $2, $3, $4, false)
    RETURNING id, email, username, role, created_at
  `;
}

/**
 * Returns a SQL string for creating a user via the admin panel (without password).
 */
function insertUser() {
  return `
    INSERT INTO users (username, email, role, is_deleted)
    VALUES ($1, $2, $3, false)
    RETURNING id, username, email, role
  `;
}

/**
 * Returns a SQL string to select a user by id.
 */
function selectUserById() {
  return `
    SELECT id, username, email, role
    FROM users
    WHERE id = $1 AND is_deleted = false
  `;
}

/**
 * Returns a SQL string to select multiple users by ids.
 */
function selectUsersByIds() {
  return `
    SELECT id, username, email, role
    FROM users
    WHERE id = ANY($1) AND is_deleted = false
  `;
}

/**
 * Returns a SQL string to update a user's role.
 */
function updateUserRoleInDB() {
  return `
    UPDATE users
    SET role = $1
    WHERE id = $2 AND is_deleted = false
    RETURNING id, username, email, role
  `;
}

/**
 * Returns a SQL string to soft delete a user.
 */
function softDeleteUser() {
  return `
    UPDATE users
    SET is_deleted = true
    WHERE id = $1 AND is_deleted = false
    RETURNING id
  `;
}

/**
 * Returns a SQL string to select all users.
 */
function selectAllUsers() {
  return `
    SELECT id, username, email, role
    FROM users
    WHERE is_deleted = false
    ORDER BY id
  `;
}

/**
 * Returns a SQL string to update a user's password.
 */
function updateUserPassword() {
  return `
    UPDATE users
    SET password = $1
    WHERE id = $2 AND is_deleted = false
    RETURNING id, username, email, role
  `;
}
module.exports = {
findUserByLoginQuery,
createUserQuery,
insertUser,
selectUserById,
selectUsersByIds,
updateUserRoleInDB,
softDeleteUser,
selectAllUsers,
updateUserPassword,
};
