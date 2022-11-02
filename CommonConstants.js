module.exports = {
  /**
   * Messages
   */
  //Message if fields are empty
  EMPTY_FIELDS: "Please provide all values",
  //Message if user record already exist in database
  USER_ALREADY_EXISTS: "User already exists",
  //Message if route record already exist in database
  ROUTE_ALREADY_EXISTS: "Route already exists",
  //message if credntials dont match
  INVALID_CREDENTIALS: "Invalid Credentials",
  //Message if delete is succesfull
  SUCCESSFULL_USER_DELETE: "Success! User Deleted.",
  //Success message
  SUCCESS: "success",
  //Error message
  ERROR: "error",
  //Message user not found
  USER_NOT_FOUND: "No user with id :",

  //Invalid credit add
  INVALID_CREDIT_ADD: "Can not add negative credit",

  //Invalid userId
  INVALID_USER_ID: "Invalid User Id Found",

  //Credit delete
  CREDIT_DELETE: "Success! Credit Deleted.",

  /**
   * PATHS
   */
  MANAGER_PATH: "/api/v1/manager",
  ROUTE_PATH: "/api/v1/route",
  CREDIT: "/api/v1/credit",
};
