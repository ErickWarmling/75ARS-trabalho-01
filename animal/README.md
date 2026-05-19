# API de Animais

API Node.js para cadastro e consulta de animais (pets) da clínica veterinária. Utiliza o mesmo banco PostgreSQL da API de tutores (`75ARS`) e delega o cadastro de donos à API Spring Boot.

## Execução com Docker (recomendado)

Na raiz do repositório (`75ARS-trabalho-01`):

```bash
docker compose up --build
```

Serviços disponíveis:

| Serviço  | URL                          |
|----------|------------------------------|
| Tutores  | http://localhost:8080/api    |
| Animais  | http://localhost:3000/api    |
| Postgres | localhost:5432 (banco 75ARS) |

## Execução local

### Pré-requisitos

- Node.js 18+
- PostgreSQL com o banco `75ARS` (mesma configuração da API `tutor`)
- API de tutores em execução (Spring Boot, porta 8080)

### Configuração

```bash
cd animal
npm install
cp .env.example .env
```

Variáveis de ambiente (`.env`):

| Variável        | Padrão                                              |
|-----------------|-----------------------------------------------------|
| `PORT`          | `3000`                                              |
| `DATABASE_URL`  | `postgresql://postgres:admin@localhost:5432/75ARS` |
| `TUTOR_API_URL` | `http://localhost:8080/api`                       |

```bash
npm start
```

## Endpoints

### POST `/api/animais`

Cadastra o tutor na API Spring e, em seguida, grava o animal.

**Request:**

```json
{
  "nome": "Rex",
  "especie": "Cao",
  "raca": "Labrador",
  "tutor": {
    "nome": "Joao Silva",
    "telefone": "11999999999",
    "email": "joao@email.com"
  }
}
```

**Response (201):** animal criado com `id` e dados do tutor.

### GET `/api/animais/:id`

**Response (200):**

```json
{
  "nome": "Rex",
  "especie": "Cao",
  "raca": "Labrador",
  "tutor": {
    "id": 1
  }
}
```

## Modelo de dados

Tabela `animal` (mesmo banco `75ARS`):

| Coluna   | Tipo    |
|----------|---------|
| id       | bigint  |
| nome     | string  |
| especie  | string  |
| raca     | string  |
| id_dono  | bigint  | FK → `tutor.tutor_id`
