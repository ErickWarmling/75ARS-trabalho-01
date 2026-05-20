const pool = require('../db/pool');
const {
  cadastrarAnimal,
  buscarAnimalPorId,
  listarAnimais,
  listarTutores,
} = require('./animalClient');
const { log } = require('../utils/logger');

function toResponse(row) {
  return {
    id: Number(row.id),
    dataHora: row.data_hora.toISOString(),
    motivo: row.motivo,
    observacoes: row.observacoes,
    veterinario: row.veterinario,
    animal: {
      id: Number(row.id_animal),
      nome: row.animal_nome,
    },
  };
}

async function resolverAnimal(animal) {
  if (animal.id) {
    const animalExistente = await buscarAnimalPorId(animal.id);
    if (!animalExistente) {
      const error = new Error('Animal não encontrado');
      error.status = 404;
      throw error;
    }
    log('Vinculando consulta a animal existente', { id: animalExistente.id });
    return {
      id: animalExistente.id,
      nome: animalExistente.nome,
    };
  }

  const animalSalvo = await cadastrarAnimal(animal);
  return {
    id: animalSalvo.id,
    nome: animalSalvo.nome,
  };
}

async function criarConsulta({
  dataHora,
  motivo,
  observacoes,
  veterinario,
  animal,
}) {
  const animalResolvido = await resolverAnimal(animal);

  log('Gravando consulta no banco', {
    idAnimal: animalResolvido.id,
    veterinario,
  });
  const result = await pool.query(
    `INSERT INTO consulta (data_hora, motivo, observacoes, veterinario, id_animal)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, data_hora, motivo, observacoes, veterinario, id_animal`,
    [
      new Date(dataHora),
      motivo,
      observacoes ?? null,
      veterinario,
      animalResolvido.id,
    ]
  );

  const row = result.rows[0];
  row.animal_nome = animalResolvido.nome;

  return toResponse(row);
}

async function listarConsultas() {
  const result = await pool.query(
    `SELECT c.id, c.data_hora, c.motivo, c.observacoes, c.veterinario, c.id_animal,
            a.nome AS animal_nome
     FROM consulta c
     INNER JOIN animal a ON a.id = c.id_animal
     ORDER BY c.data_hora DESC`
  );

  return result.rows.map((row) => toResponse(row));
}

async function buscarConsultaPorId(id) {
  const result = await pool.query(
    `SELECT c.id, c.data_hora, c.motivo, c.observacoes, c.veterinario, c.id_animal,
            a.nome AS animal_nome
     FROM consulta c
     INNER JOIN animal a ON a.id = c.id_animal
     WHERE c.id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return toResponse(result.rows[0]);
}

module.exports = {
  criarConsulta,
  listarConsultas,
  buscarConsultaPorId,
  listarAnimais,
  listarTutores,
};
