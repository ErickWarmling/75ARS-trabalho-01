const { Router } = require('express');
const consultaController = require('../controllers/consultaController');

const router = Router();

router.get('/tutores', consultaController.listarTutores);
router.get('/animais', consultaController.listarAnimais);
router.get('/consultas', consultaController.listar);
router.post('/consultas', consultaController.cadastrar);
router.get('/consultas/:id', consultaController.buscarPorId);

module.exports = router;
