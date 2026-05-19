#!/bin/sh
set -e

TUTOR_API_URL="${TUTOR_API_URL:-http://tutor:8080/api}"

echo "Aguardando API de tutores em ${TUTOR_API_URL}..."
until curl -sf "${TUTOR_API_URL}/tutores" > /dev/null; do
  sleep 2
done
echo "API de tutores disponível."

exec node src/index.js
