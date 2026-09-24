import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { api, login, loginAdmin, paciente, prisma, resetDatabase, SENHA } from "./helpers";

beforeEach(resetDatabase);
afterAll(() => prisma.$disconnect());

type Auth = Record<string, string>;

async function criarUsuario(auth: Auth, role: string, email: string, extra: Record<string, unknown> = {}) {
  const res = await api()
    .post("/api/user")
    .set(auth)
    .send({ name: `Usuário ${role}`, age: 30, gender: "MALE", email, password: SENHA, role, ...extra })
    .expect(201);
  return res.body;
}

describe("Autenticação", () => {
  it("faz login e /me não expõe a senha", async () => {
    const admin = await loginAdmin();
    const me = await api().get("/api/auth/me").set(admin).expect(200);
    expect(me.body.role).toBe("ADMIN");
    expect(me.body).not.toHaveProperty("password");
  });

  it("aceita e-mail com letras maiúsculas no cadastro e no login", async () => {
    const admin = await loginAdmin();
    await criarUsuario(admin, "SECRETARY", "Ana.Recepcao@Hospital.com");
    await api().post("/api/auth/login").send({ email: "ANA.RECEPCAO@hospital.com", password: SENHA }).expect(200);
  });

  it("rejeita credenciais inválidas e rotas sem token", async () => {
    await loginAdmin();
    await api().post("/api/auth/login").send({ email: "admin@hospital.com", password: "errada" }).expect(401);
    await api().get("/api/pacient").expect(401);
    await api().get("/api/pacient").set("Authorization", "Bearer invalido").expect(401);
  });
});

describe("Usuários e papéis", () => {
  it("cria médico com CRM e devolve datas como texto ISO (não objeto vazio)", async () => {
    const admin = await loginAdmin();
    const user = await criarUsuario(admin, "DOCTOR", "dr.house@hospital.com", {
      doctorData: { crmNumber: "12345", crmState: "PB", specialty: "Cardiologia", department: "SURGERY" },
    });

    expect(user.doctor.crmNumber).toBe("12345");
    expect(user).not.toHaveProperty("password");
    expect(typeof user.createdAt).toBe("string");
    expect(new Date(user.createdAt).toString()).not.toBe("Invalid Date");
  });

  it("retorna 409 para CRM duplicado", async () => {
    const admin = await loginAdmin();
    const crm = { crmNumber: "999", crmState: "SP", specialty: "Clínica", department: "EMERGENCY" };
    await criarUsuario(admin, "DOCTOR", "a@hospital.com", { doctorData: crm });
    const user = await criarUsuario(admin, "SECRETARY", "b@hospital.com");
    await api()
      .post("/api/doctor")
      .set(admin)
      .send({ userId: user.id, ...crm })
      .expect(409);
  });

  it("somente ADMIN gerencia usuários", async () => {
    const admin = await loginAdmin();
    await criarUsuario(admin, "SECRETARY", "sec@hospital.com");
    const secretaria = await login("sec@hospital.com");

    await api().get("/api/user").set(secretaria).expect(403);
    await api().get("/api/user").set(admin).expect(200);
  });

  it("retorna 404 ao atualizar usuário inexistente", async () => {
    const admin = await loginAdmin();
    await api().put("/api/user/999999").set(admin).send({ name: "Novo Nome" }).expect(404);
  });
});

describe("Pacientes", () => {
  it("secretária cadastra e atualiza paciente, inclusive alergias", async () => {
    const admin = await loginAdmin();
    await criarUsuario(admin, "SECRETARY", "sec@hospital.com");
    const secretaria = await login("sec@hospital.com");

    const criado = await api().post("/api/pacient").set(secretaria).send(paciente()).expect(201);
    const atualizado = await api()
      .put(`/api/pacient/${criado.body.id}`)
      .set(secretaria)
      .send({ allergy: "Dipirona", condition: "REST" })
      .expect(200);

    expect(atualizado.body.allergy).toBe("Dipirona");
    expect(atualizado.body.condition).toBe("REST");
  });

  it("médico lê pacientes mas não pode cadastrar", async () => {
    const admin = await loginAdmin();
    await criarUsuario(admin, "DOCTOR", "doc@hospital.com");
    const medico = await login("doc@hospital.com");

    await api().get("/api/pacient").set(medico).expect(200);
    await api().post("/api/pacient").set(medico).send(paciente()).expect(403);
  });

  it("valida dados, CPF duplicado, ID inválido e registro inexistente", async () => {
    const admin = await loginAdmin();
    await api().post("/api/pacient").set(admin).send({ name: "X" }).expect(400);
    await api().post("/api/pacient").set(admin).send(paciente()).expect(201);
    await api().post("/api/pacient").set(admin).send(paciente()).expect(409);
    await api().get("/api/pacient/abc").set(admin).expect(400);
    await api().get("/api/pacient/999999").set(admin).expect(404);
  });
});

describe("Agendamentos", () => {
  it("agenda consulta com médico e enfermeiro e aparece na agenda do médico", async () => {
    const admin = await loginAdmin();
    const medico = await criarUsuario(admin, "DOCTOR", "doc@hospital.com");
    const enfermeiro = await criarUsuario(admin, "NURSE", "nurse@hospital.com");
    const pac = await api().post("/api/pacient").set(admin).send(paciente()).expect(201);

    const consulta = await api()
      .post("/api/appointment")
      .set(admin)
      .send({
        dateTime: "2026-11-10T09:00:00Z",
        patientId: pac.body.id,
        doctorIds: [medico.doctor.id],
        nurseIds: [enfermeiro.nurse.id],
        notes: "Retorno",
      })
      .expect(201);

    expect(consulta.body.doctors).toHaveLength(1);
    expect(consulta.body.dateTime).toBe("2026-11-10T09:00:00.000Z");

    const agendaMedico = await api().get(`/api/doctor/${medico.doctor.id}`).set(admin).expect(200);
    expect(agendaMedico.body.appointments).toHaveLength(1);
    expect(agendaMedico.body.appointments[0].appointment.notes).toBe("Retorno");
  });

  it("aceita agendamento sem médicos (antes quebrava com 500)", async () => {
    const admin = await loginAdmin();
    const pac = await api().post("/api/pacient").set(admin).send(paciente()).expect(201);
    await api()
      .post("/api/appointment")
      .set(admin)
      .send({ dateTime: "2026-11-10T09:00:00Z", patientId: pac.body.id })
      .expect(201);
  });

  it("retorna 400 para paciente inexistente e 404 ao remover agendamento inexistente", async () => {
    const admin = await loginAdmin();
    await api()
      .post("/api/appointment")
      .set(admin)
      .send({ dateTime: "2026-11-10T09:00:00Z", patientId: 999999 })
      .expect(400);
    await api().delete("/api/appointment/999999").set(admin).expect(404);
  });

  it("remover paciente remove os agendamentos dele", async () => {
    const admin = await loginAdmin();
    const pac = await api().post("/api/pacient").set(admin).send(paciente()).expect(201);
    await api()
      .post("/api/appointment")
      .set(admin)
      .send({ dateTime: "2026-11-10T09:00:00Z", patientId: pac.body.id })
      .expect(201);

    await api().delete(`/api/pacient/${pac.body.id}`).set(admin).expect(204);
    expect(await prisma.appointment.count()).toBe(0);
  });
});

describe("Infraestrutura", () => {
  it("health check, 404 e JSON malformado", async () => {
    await api().get("/health").expect(200);
    await api().get("/api/nao-existe").expect(401);
    await api().post("/api/auth/login").set("Content-Type", "application/json").send('{"email":').expect(400);
  });
});
