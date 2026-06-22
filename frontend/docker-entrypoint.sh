#!/bin/sh
set -e

CONSULTA_API_URL="${CONSULTA_API_URL:-http://localhost:3001/api}"

cat > /usr/share/nginx/html/js/config.js <<EOF
window.CONFIG = {
  consultaApi: '${CONSULTA_API_URL}',
};
EOF

echo "Frontend configurado com API: ${CONSULTA_API_URL}"
exec nginx -g 'daemon off;'
