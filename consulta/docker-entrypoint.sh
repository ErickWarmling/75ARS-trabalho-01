#!/bin/sh
set -e

ANIMAL_API_URL="${ANIMAL_API_URL:-http://animal:3000/api}"

echo "Aguardando API de animais em ${ANIMAL_API_URL}..."
until code=$(curl -s -o /dev/null -w "%{http_code}" "${ANIMAL_API_URL}/animais/1") && [ "$code" = "200" ] || [ "$code" = "404" ]; do
  sleep 2
done
echo "API de animais disponível."

exec node src/index.js
