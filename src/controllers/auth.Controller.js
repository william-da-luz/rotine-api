const bcrypt = require('bcryptjs');
const { signToken, verifyToken } = require('../helper/jwt.js');
const { z } = require('zod');
const userService = require('../service/user.service.js')


//schema de validation Zod
const registerValidationSchema = z.object({
  username: z.string({ required_error: 'Username is required' }),
  password: z.string({ required_error: 'Password is required' }),
}).strict()

const loginValidationSchema = z.object({
  username: z.string({ required_error: 'Username is required' }),
  password: z.string({ required_error: 'Password is required' }),
}).strict()


const register = async (req, res) => {
  try {
    const { username, password } = registerValidationSchema.parse(req.body); //as info que permito receber
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.create({ 
      username, 
      password: hashedPassword 
    });

    delete user.password
    const token = signToken(user);
    res.status(201).json({ token });

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0].message; // Só acessa se for ZodError
      return res.status(400).json({ message: errorMessage });
    }
    console.log(error);
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
};




const login = async (req, res) => {
  try {
    const { username, password } = loginValidationSchema.parse(req.body);
    const user = await userService.findOneByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    delete user.password //torna o valor user.password null, o token nao retorna o password no seu corpo
    const token = signToken(user);
    res.json({ token });

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }
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
    const user = await userService.findOneById( decoded.user.id )

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { register, login, getMe };