const ANIMAL_API_URL =
  process.env.ANIMAL_API_URL || 'http://localhost:3000/api';

async function cadastrarAnimal({ nome, especie, raca, tutor }) {
  const response = await fetch(`${ANIMAL_API_URL}/animais`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, especie, raca, tutor }),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao cadastrar animal na API de animais');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return response.json();
}

module.exports = { cadastrarAnimal };
