const pool = require('../db/pool');
const { cadastrarTutor } = require('./tutorClient');

function toResponse(row) {
  return {
    nome: row.nome,
    especie: row.especie,
    raca: row.raca,
    tutor: {
      id: Number(row.id_dono),
    },
  };
}

async function criarAnimal({ nome, especie, raca, tutor }) {
  const tutorSalvo = await cadastrarTutor(tutor);

  const result = await pool.query(
    `INSERT INTO animal (nome, especie, raca, id_dono)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, especie, raca, id_dono`,
    [nome, especie, raca ?? null, tutorSalvo.id]
  );

  return {
    id: Number(result.rows[0].id),
    ...toResponse(result.rows[0]),
  };
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

  return toResponse(result.rows[0]);
}

module.exports = { criarAnimal, buscarAnimalPorId };
