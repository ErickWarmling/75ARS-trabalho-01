const { log } = require('../utils/logger');

const TUTOR_API_URL =
  process.env.TUTOR_API_URL || 'http://localhost:8080/api';

async function cadastrarTutor({ nome, telefone, email }) {
  log('Chamando API de tutores: POST /tutores', { nome });
  const response = await fetch(`${TUTOR_API_URL}/tutores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, telefone, email }),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao cadastrar tutor na API de tutores');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  const tutor = await response.json();
  log('Tutor cadastrado via API de tutores', { id: tutor.id });
  return tutor;
}

async function buscarTutorPorId(id) {
  log('Chamando API de tutores: GET /tutores/:id', { id });
  const response = await fetch(`${TUTOR_API_URL}/tutores/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao buscar tutor na API de tutores');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return response.json();
}

async function listarTutores() {
  log('Chamando API de tutores: GET /tutores');
  const response = await fetch(`${TUTOR_API_URL}/tutores`);

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao listar tutores na API de tutores');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return response.json();
}

module.exports = { cadastrarTutor, buscarTutorPorId, listarTutores };
