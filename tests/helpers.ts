import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app";
import prisma from "../src/database/prismaClient";

export const api = () => request(app);
export const SENHA = "Senha@123";

export async function resetDatabase() {
  await prisma.appointmentDoctor.deleteMany();
  await prisma.appointmentNurse.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.nurse.deleteMany();
  await prisma.secretary.deleteMany();
  await prisma.user.deleteMany();
}

/** Cria um ADMIN direto no banco e devolve o header de autenticação. */
export async function loginAdmin(email = "admin@hospital.com") {
  await prisma.user.create({
    data: { name: "Admin", age: 40, gender: "FEMALE", email, password: await bcrypt.hash(SENHA, 10), role: "ADMIN" },
  });
  return login(email);
}

export async function login(email: string) {
  const res = await api().post("/api/auth/login").send({ email, password: SENHA }).expect(200);
  return { Authorization: `Bearer ${res.body.token}` };
}

export const paciente = (cpf = "12345678901") => ({
  name: "Maria Souza",
  age: 35,
  cpf,
  gender: "FEMALE",
  birthDate: "1990-03-15",
  condition: "WAITING",
  location: "WARD",
});

export { prisma };
