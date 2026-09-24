import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../database/prismaClient";
import { env } from "../config/env";
import { Role } from "../generated/prisma";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware de autenticação: exige um token JWT válido no header
 * `Authorization: Bearer <token>` e injeta o usuário em `req.user`.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token não fornecido. Faça login para continuar." });
    return;
  }

  const token = header.slice(7).trim();

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; role: Role };

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({ message: "Usuário do token não existe mais." });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

/**
 * Middleware de autorização: restringe o acesso por role.
 * Deve ser usado APÓS o `authenticate`.
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Não autenticado." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: `Acesso negado. Requer um dos papéis: ${allowedRoles.join(", ")}.`,
      });
      return;
    }

    next();
  };
}
