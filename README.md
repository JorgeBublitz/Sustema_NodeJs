# 🏥 **Hospital Management API – Sustema**

API REST para gerenciamento de hospitais, construída com **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL**.  
Permite cadastrar e gerenciar **usuários, médicos, enfermeiros, secretários, pacientes e agendamentos**.

> ⚠️ **Atenção:** este repositório contém dados sensíveis de pacientes e é **privado**. Não torne público sem autorização.

## 🚀 **Tecnologias**

- **Node.js**
- **Express** 5
- **Prisma** (PostgreSQL)
- **JWT** (autenticação via `jsonwebtoken`)
- **Helmet** + **Express Rate Limit** (segurança)

## ⚡ **Funcionalidades**

- **Autenticação JWT** com login e controle de acesso por papel (ADMIN, SECRETARY, DOCTOR, NURSE)
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
