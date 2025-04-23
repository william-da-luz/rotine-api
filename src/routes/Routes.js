const express = require('express');
const { register, login, getMe } = require('../controllers/auth.Controller.js');
const NotesController = require('../controllers/notes.controller.js');
const authMiddleware = require('../middleware/authMiddleware.js');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.get('/notes', authMiddleware, NotesController.findAll)
router.post('/notes', authMiddleware, NotesController.create);

module.exports = router;