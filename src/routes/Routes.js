const express = require('express');
const { register, login, getMe } = require('../controllers/auth.Controller.js');
const NotesController = require('../controllers/notes.controller.js');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);

router.post('/note', NotesController.createNote);

module.exports = router;