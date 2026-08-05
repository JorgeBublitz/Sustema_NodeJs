# 🏥 **Hospital Management API – Sustema**

API REST para gerenciamento de hospitais, construída com **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL**.  
Permite cadastrar e gerenciar **usuários, médicos, enfermeiros, secretários, pacientes e agendamentos**.

> ⚠️ **Atenção:** os dados do seed são **fictícios** (apenas para demonstração). Use credenciais reais via `.env` (ver `.env.example`).

## 🚀 **Tecnologias**

- **Node.js**
- **Express** 5
- **Prisma** (PostgreSQL)
- **JWT** (autenticação via `jsonwebtoken`)
- **Helmet** + **Express Rate Limit** (segurança)

## ⚡ **Funcionalidades**

- **Autenticação JWT** com login e controle de acesso por papel (ADMIN, SECRETARY, DOCTOR, NURSE)
- **Validação de entrada com Zod** em todos os endpoints (mensagens de erro em pt-BR)
- CRUD de **usuários** (ADMIN, SECRETARY, DOCTOR, NURSE) — senha **hasheada** com bcrypt e **nunca retornada** pela API
- CRUD de **pacientes**
- CRUD de **consultas / agendamentos**
- Criação de **dados de exemplo** (seed)
- Relacionamentos entre **usuários, médicos, enfermeiros, secretários, pacientes e agendamentos**

## 🔐 **Autenticação**

Todas as rotas (exceto `/api/auth/login`) exigem um token JWT:

```
Authorization: Bearer <seu-token>
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "123456"}'
```

Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "System Admin", "email": "admin@example.com", "role": "ADMIN", ... }
}
```

### Usuário autenticado

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <seu-token>"
```

### Papéis e permissões

| Rota                    | Leitura            | Escrita                        |
|-------------------------|--------------------|--------------------------------|
| `/api/user`             | ADMIN              | ADMIN                          |
| `/api/doctor`           | Autenticado        | ADMIN                          |
| `/api/nurse`            | Autenticado        | ADMIN                          |
| `/api/secretary`        | Autenticado        | ADMIN                          |
| `/api/pacient`          | Autenticado        | ADMIN, SECRETARY               |
| `/api/appointment`      | Autenticado        | ADMIN, SECRETARY               |

💡 Dica: o seed cria um usuário `admin@example.com` (senha `123456`) para testar.

### Erros de validação

Quando um campo é inválido, a API responde `400` com a lista de erros:

```json
{
  "message": "Dados inválidos.",
  "errors": [
    { "campo": "email", "mensagem": "E-mail inválido." },
    { "campo": "password", "mensagem": "A senha deve ter pelo menos 6 caracteres." }
  ]
}
```

### Criando usuário com dados de médico (exemplo)

Para criar um DOCTOR com CRM próprio (em vez do temporário), envie `doctorData`:

```bash
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "name": "Dr. Exemplo",
    "age": 40,
    "gender": "MALE",
    "email": "dr.exemplo@example.com",
    "password": "123456",
    "role": "DOCTOR",
    "doctorData": {
      "crmNumber": "CRM-12345",
      "crmState": "PB",
      "specialty": "Cardiology",
      "department": "EMERGENCY"
    }
  }'
```

💡 Quando os dados do perfil (CRM/COREN/turno) não são informados, são gerados valores temporários únicos por usuário (`TEMP-{id}`) — sem conflito ao criar vários médicos.

## 🛠️ **Configuração**

1. **Clonar o projeto**
```bash
git clone https://github.com/JorgeBublitz/Sustema_NodeJs.git
cd Sustema_NodeJs
code .  // Para abrir o VSCode
```

2. **Instalar dependências**
```bash
npm install
```

3. **Configurar banco de dados**
```bash
cp .env.example .env
```

4. **Executar migrations**
```bash
npx prisma migrate dev --name init
```

5. **Configurar o segredo JWT**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Cole o valor gerado em `JWT_SECRET` no `.env`.

## 🏃 **Executar a API**

```bash
npm run dev
```

A API estará disponível em [http://localhost:3000](http://localhost:3000).

## 🔧 **Configurações adicionais**

- **Mudar banco de dados:** altere a variável `DATABASE_URL` no `.env` e rode novamente:
```bash
npx prisma migrate dev
```

- **Reset do banco (apaga todos os dados):**
```bash
npx prisma migrate reset
```

- **Gerar / atualizar Prisma Client:**
```bash
npx prisma generate
```

## 📝 **Estrutura resumida**

- `/src` → código fonte
- `/src/controllers` → controladores da API
- `/src/services` → regras de negócio
- `/src/database` → configuração do Prisma
- `/prisma/schema.prisma` → modelo do banco de dados

## 💻 **Testando a API**

- `POST /api/auth/login` → autentica e retorna o token JWT
- `GET /api/auth/me` → dados do usuário autenticado (com token)
- `GET /api/user` → lista todos os usuários (ADMIN)
- `POST /api/user` → cria um usuário (role, senha, etc.) (ADMIN)
- `GET /api/pacient` → lista pacientes (autenticado)
- `POST /api/appointment` → cria agendamento (ADMIN ou SECRETARY)

💡 Dica: use os exemplos do seed para testar imediatamente.

---

## 📝 **Licença**

MIT
