const pool = require('../db/pool');
const { cadastrarAnimal } = require('./animalClient');

function toResponse(row) {
  return {
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

async function criarConsulta({
  dataHora,
  motivo,
  observacoes,
  veterinario,
  animal,
}) {
  const animalSalvo = await cadastrarAnimal(animal);

  const result = await pool.query(
    `INSERT INTO consulta (data_hora, motivo, observacoes, veterinario, id_animal)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, data_hora, motivo, observacoes, veterinario, id_animal`,
    [
      new Date(dataHora),
      motivo,
      observacoes ?? null,
      veterinario,
      animalSalvo.id,
    ]
  );

  const row = result.rows[0];
  row.animal_nome = animalSalvo.nome;

  return {
    id: Number(row.id),
    ...toResponse(row),
  };
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

module.exports = { criarConsulta, buscarConsultaPorId };
