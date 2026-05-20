const { log } = require('../utils/logger');

const ANIMAL_API_URL =
  process.env.ANIMAL_API_URL || 'http://localhost:3000/api';

async function cadastrarAnimal(animal) {
  log('Chamando API de animais: POST /animais', {
    nome: animal.nome,
    tutorId: animal.tutor?.id,
  });
  const response = await fetch(`${ANIMAL_API_URL}/animais`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(animal),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao cadastrar animal na API de animais');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  const resultado = await response.json();
  log('Animal cadastrado via API de animais', { id: resultado.id });
  return resultado;
}

async function buscarAnimalPorId(id) {
  log('Chamando API de animais: GET /animais/:id', { id });
  const response = await fetch(`${ANIMAL_API_URL}/animais/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao buscar animal na API de animais');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return response.json();
}

async function listarAnimais() {
  log('Chamando API de animais: GET /animais');
  const response = await fetch(`${ANIMAL_API_URL}/animais`);

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao listar animais na API de animais');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return response.json();
}

async function listarTutores() {
  log('Chamando API de animais: GET /tutores (encaminha para API de tutores)');
  const response = await fetch(`${ANIMAL_API_URL}/tutores`);

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao listar tutores via API de animais');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return response.json();
}

module.exports = {
  cadastrarAnimal,
  buscarAnimalPorId,
  listarAnimais,
  listarTutores,
};
