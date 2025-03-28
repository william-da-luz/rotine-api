const jwt = require('jsonwebtoken');

const signToken = (user) => { //passar o objeto user inteiro
  return jwt.sign({ id: user }, process.env.JWT_SECRET, { expiresIn: '1h' });//passar o user ao inves de user.id
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { signToken, verifyToken };