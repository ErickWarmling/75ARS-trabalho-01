function log(message, meta) {
  const suffix = meta !== undefined ? ` ${JSON.stringify(meta)}` : '';
  console.log(`[animal-api] ${message}${suffix}`);
}

module.exports = { log };
