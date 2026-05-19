const { Router } = require('express');
const animalController = require('../controllers/animalController');

const router = Router();

router.post('/animais', animalController.cadastrar);
router.get('/animais/:id', animalController.buscarPorId);

module.exports = router;
