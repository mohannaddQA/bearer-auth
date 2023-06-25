const { UsersTable } = require("../../auth/models/index");

async function handleGetUsers(req, res, next) {
  try {
    let userRecords = await UsersTable.findAll({});
    const list = userRecords.map((user) => user.username);
    res.status(200).json(list);
  } catch (e) {
    next(e);
  }
}

module.exports = { handleGetUsers };
