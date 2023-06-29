import pool from "./pool.js";

pool.on("connect", () => {
  console.log("Connected to DB");
});

/**
 * Create User Table
 */

const createUserTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
	(id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_admin BOOL DEFAULT(false),
    token VARCHAR,
    role VARCHAR DEFAULT 'user',
    avatar VARCHAR,
    phone VARCHAR(15),
    created_on DATE NOT NULL,
    updated_on DATE)`;

  pool
    .query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const userDropQuery = "DROP TABLE IF EXISTS users";

  pool
    .query(userDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};
/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
};

const dropAllTables = () => {
  dropUserTable();
};

pool.on("remove", () => {
  console.log("Client removed");
  process.exit(0);
});

export { createAllTables, dropAllTables };

require("make-runnable");
