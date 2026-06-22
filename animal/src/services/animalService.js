const pool = require('../db/pool');
const {
  cadastrarTutor,
  buscarTutorPorId,
  listarTutores,
} = require('./tutorClient');
const { log } = require('../utils/logger');

function toResponse(row, { includeId = false } = {}) {
  const response = {
    nome: row.nome,
    especie: row.especie,
    raca: row.raca,
    tutor: {
      id: Number(row.id_dono),
    },
  };

  if (includeId) {
    response.id = Number(row.id);
  }

  return response;
}

async function resolverIdDono(tutor) {
  if (tutor.id) {
    const tutorExistente = await buscarTutorPorId(tutor.id);
    if (!tutorExistente) {
      const error = new Error('Tutor não encontrado');
      error.status = 404;
      throw error;
    }
    log('Vinculando animal a tutor existente', { id: tutorExistente.id });
    return Number(tutorExistente.id);
  }

  const tutorSalvo = await cadastrarTutor(tutor);
  return Number(tutorSalvo.id);
}

async function criarAnimal({ nome, especie, raca, tutor }) {
  const idDono = await resolverIdDono(tutor);

  log('Gravando animal no banco', { nome, idDono });
  const result = await pool.query(
    `INSERT INTO animal (nome, especie, raca, id_dono)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, especie, raca, id_dono`,
    [nome, especie, raca ?? null, idDono]
  );

  return {
    id: Number(result.rows[0].id),
    ...toResponse(result.rows[0]),
  };
}

async function listarAnimais() {
  const result = await pool.query(
    `SELECT id, nome, especie, raca, id_dono
     FROM animal
     ORDER BY id`
  );

  return result.rows.map((row) => toResponse(row, { includeId: true }));
}

async function buscarAnimalPorId(id) {
  const result = await pool.query(
    `SELECT id, nome, especie, raca, id_dono
     FROM animal
     WHERE id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return toResponse(result.rows[0], { includeId: true });
}

module.exports = {
  criarAnimal,
  listarAnimais,
  buscarAnimalPorId,
  listarTutores,
};
