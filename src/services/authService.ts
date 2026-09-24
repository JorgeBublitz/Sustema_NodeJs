import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../database/prismaClient";
import { env } from "../config/env";
import { removePasswordDeep } from "../utils/sanitize.util";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

const authService = {
  /**
   * Autentica o usuário com e-mail/senha e retorna um token JWT.
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { doctor: true, nurse: true, secretary: true },
    });

    // Mensagem genérica para não revelar se o e-mail existe
    if (!user) {
      throw new AuthError("Credenciais inválidas.");
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      throw new AuthError("Credenciais inválidas.");
    }

    const token = jwt.sign(
      { sub: String(user.id), role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _senha, ...usuarioSemSenha } = user;

    return {
      token,
      user: removePasswordDeep(usuarioSemSenha),
    };
  },

  /**
   * Busca o usuário autenticado (usado pelo GET /me).
   */
  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctor: true, nurse: true, secretary: true },
    });

    if (!user) {
      throw new AuthError("Usuário não encontrado.", 404);
    }

    return removePasswordDeep(user);
  },
};

export default authService;
