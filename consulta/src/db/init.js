const pool = require('./pool');

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS consulta (
      id BIGSERIAL PRIMARY KEY,
      data_hora TIMESTAMP NOT NULL,
      motivo VARCHAR(255) NOT NULL,
      observacoes TEXT,
      veterinario VARCHAR(255) NOT NULL,
      id_animal BIGINT NOT NULL REFERENCES animal(id)
    )
  `);
}

module.exports = { initDatabase };
