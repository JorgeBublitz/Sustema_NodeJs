import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma";

export function validateUser(req: Request, res: Response, next: NextFunction): void {
    const { name, email, password, role } = req.body;

    if (typeof name !== "string" || name.trim() === "") {
        res.status(400).json({ message: "O campo 'name' é obrigatório e não pode estar vazio." });
        return;
    }

    if (typeof email !== "string" || !email.includes("@")) {
        res.status(400).json({ message: "E-mail inválido." });
        return;
    }

    if (typeof password !== "string" || password.length < 6) {
        res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
        return;
    }

    if (role && !Object.values(Role).includes(role)) {
        res.status(400).json({ message: `O campo 'role' deve ser um dos seguintes: ${Object.values(Role).join(", ")}` });
        return;
    }

    next();
}
