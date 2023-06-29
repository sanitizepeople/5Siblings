import moment from "moment";
import dbQuery from "../db/dev/dbQuery.js";

import { hashPassword, isValidEmail, validatePassword, isEmpty, generateUserToken } from "../helpers/validations.js";

import { errorMessage, successMessage, status } from "../helpers/status.js";

/**
 * Create a Admin
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */

const createAdmin = async (req, res) => {
  const { email, username, password, role, avatar, phone } = req.body;

  // const {is_admin} = req.user;
  const isAdmin = true;
  const created_on = moment(new Date());

  if (isEmpty(email) || isEmpty(username) || isEmpty(password)) {
    errorMessage.error = "Email, username, password field cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  if (!isValidEmail(email)) {
    errorMessage.error = "Please enter a valid email";
    return res.status(status.bad).send(errorMessage);
  }

  if (!validatePassword(password)) {
    errorMessage.error = "Password must be at least 8 characters";
    return res.status(status.bad).send(errorMessage);
  }

  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
		users(email, username, password, is_admin, role, avatar, phone, created_on)
		VALUES($1, $2, $3, $4, $5, $6, $7, $8)
  		returning *`;

  const values = [email, username, hashedPassword, isAdmin, role, avatar, phone, created_on];

  try {
    const { row } = await dbQuery.query(createUserQuery, values);
    const dbResponse = row[0];
    delete dbResponse.password;
    const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.username, dbResponse.is_admin);
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      errorMessage.error = "Admin with that Email or Username already exist";
      return res.status(status.conflict).send(errorMessage);
    }
  }
};

const updateUser2Admin = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;

  const { is_admin } = req.user;

  if (!is_admin === true) {
    errorMessage.error = "Unauthorized";
    return res.status(status.bad).send(errorMessage);
  }

  if (isAdmin === "") {
    errorMessage.error = "Admin status is needed";
    return res.status(status.bad).send(errorMessage);
  }

  const findUserQuery = `SELECT * FROM users WHERE id=$1`;
  const updateUser = `UPDATE users
		SET is_admin=$1 WHERE id=$2
		returning *`;

  try {
    const { row } = await dbQuery.query(findUserQuery, [id]);
    const dbResponse = row[0];

    if (!dbResponse) {
      errorMessage.error = "User cannot be found";
      return res.status(status.notfound).send(errorMessage);
    }

    const values = [isAdmin, id];

    const response = await dbQuery.query(updateUser, values);
    const dbResult = response.row[0];
    delete dbResult.password;
    successMessage.data = dbResult;
    console.log(dbResult);
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Not Success";
    return res.status(status.error).send(errorMessage);
  }
};

export { createAdmin, updateUser2Admin };
