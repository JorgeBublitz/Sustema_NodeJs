# 🏥 Hospital Management API – Sustema

API REST para gerenciamento de hospitais, construída com **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL**.  
Permite cadastrar e gerenciar **usuários, médicos, enfermeiros, secretários, pacientes e agendamentos (appointments)**.

---

## 🚀 Tecnologias

- **Node.js**
- **Express**
- **Prisma**
- **PostgreSQL**

---

## ⚡ Funcionalidades

- CRUD de **usuários** (ADMIN, SECRETARY, DOCTOR, NURSE)  
- CRUD de **pacientes**  
- CRUD de **consultas / agendamentos**  
- Criação de **dados de exemplo** (seed)  
- Relacionamentos entre **usuários, médicos, enfermeiros, secretários, pacientes e agendamentos**  

---

## 🛠️ Configuração

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
Crie um arquivo `.env` na raiz do projeto:  
```env
DATABASE_URL="postgresql://USER:SENHA@HOST:PORT/NOME_DO_BANCO?schema=public"
```

4. **Executar migrations**  
```bash
npx prisma migrate dev --name init
```
- Esse comando:
    - Cria todas as tabelas no banco de dados conforme definido no `schema.prisma`.
    - Popula o banco automaticamente com dados de exemplo (seed), incluindo usuários, médicos, enfermeiros, secretários, pacientes e agendamentos.

## 🏃 Executar a API

Para desenvolvimento com hot reload:  
```bash
npm run dev
```

A API estará disponível em [http://localhost:3000](http://localhost:3000) (ou porta definida no seu projeto).

---

## 🔧 Configurações adicionais

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

---

## 📝 Estrutura resumida

- `/src` → código fonte  
- `/src/controllers` → controladores da API  
- `/src/services` → regras de negócio  
- `/src/database` → configuração do Prisma e seed  
- `/prisma/schema.prisma` → modelo do banco de dados  

---

## 💻 Testando a API

Você pode testar usando **Postman** ou **Insomnia**:

- `GET /users` → lista todos os usuários  
- `POST /users` → cria um usuário (role, senha, etc.)  
- `GET /patients` → lista pacientes  
- `POST /appointments` → cria agendamento  

💡 Dica: use os exemplos do seed para testar imediatamente.
