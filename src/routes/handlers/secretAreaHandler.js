function handleSecretArea(req, res, next) {
  res.status(200).send("Welcome  to the secret area!");
}
module.exports = { handleSecretArea };
