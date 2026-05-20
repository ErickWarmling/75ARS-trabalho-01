const { Router } = require('express');
const consultaController = require('../controllers/consultaController');

const router = Router();

router.post('/consultas', consultaController.cadastrar);
router.get('/consultas/:id', consultaController.buscarPorId);

module.exports = router;
