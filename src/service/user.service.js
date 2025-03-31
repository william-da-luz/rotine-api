
const prisma = require('../config/database');

async function create(data) {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
    },
  });
  return user;
}


async function findOneByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
}

async function findOneById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { username: true, createdAt: true},
  });
  return user;
}


module.exports = {
  create,
  findOneByUsername,
  findOneById
};