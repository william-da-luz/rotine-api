const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { signToken, verifyToken } = require('../helper/jwt.js');
const { z } = require('zod');
const { request } = require('express');

//schema de validation Zod
const requestBody = z.object({
  username: z.string({ required_error: 'Username is required' }),
  password: z.string({ required_error: 'Password is required' }),
})

const register = async (req, res) => {
  const { username, password } = req.body;

  //zod validation
  try {
    requestBody.parse({ username, password });
  } catch (error) {
    console.log('Validation error:', error); // Debug para ver o erro exato
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0].message; // Só acessa se for ZodError
      return res.status(400).json({ message: errorMessage });
    }
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = signToken(user);
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    requestBody.parse({ username, password });
  } catch (error) {
    console.log('Validation error:', error);
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { username: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { register, login, getMe };