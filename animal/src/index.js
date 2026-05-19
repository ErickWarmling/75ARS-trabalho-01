require('dotenv').config();

const app = require('./app');
const { initDatabase } = require('./db/init');

const PORT = process.env.PORT || 3000;

async function start() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`API de animais rodando na porta ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Falha ao iniciar a API:', err);
  process.exit(1);
});
