const pool = require('./pool');

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS animal (
      id BIGSERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      especie VARCHAR(255) NOT NULL,
      raca VARCHAR(255),
      id_dono BIGINT NOT NULL REFERENCES tutor(tutor_id)
    )
  `);
}

module.exports = { initDatabase };
