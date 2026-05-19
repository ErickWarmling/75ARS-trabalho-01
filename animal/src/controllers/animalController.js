const animalService = require('../services/animalService');

function validarCadastro(body) {
  const erros = [];

  if (!body.nome || typeof body.nome !== 'string') {
    erros.push('nome é obrigatório');
  }
  if (!body.especie || typeof body.especie !== 'string') {
    erros.push('especie é obrigatório');
  }
  if (!body.tutor || typeof body.tutor !== 'object') {
    erros.push('tutor é obrigatório');
  } else {
    if (!body.tutor.nome || typeof body.tutor.nome !== 'string') {
      erros.push('tutor.nome é obrigatório');
    }
    if (!body.tutor.telefone || typeof body.tutor.telefone !== 'string') {
      erros.push('tutor.telefone é obrigatório');
    }
    if (!body.tutor.email || typeof body.tutor.email !== 'string') {
      erros.push('tutor.email é obrigatório');
    }
  }

  return erros;
}

async function cadastrar(req, res, next) {
  try {
    const erros = validarCadastro(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos', erros });
    }

    const animal = await animalService.criarAnimal({
      nome: req.body.nome,
      especie: req.body.especie,
      raca: req.body.raca,
      tutor: req.body.tutor,
    });

    return res.status(201).json(animal);
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ mensagem: 'id inválido' });
    }

    const animal = await animalService.buscarAnimalPorId(id);
    if (!animal) {
      return res.status(404).json({ mensagem: 'Animal não encontrado' });
    }

    return res.json(animal);
  } catch (error) {
    next(error);
  }
}

module.exports = { cadastrar, buscarPorId };
