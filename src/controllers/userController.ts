import { Request, Response, NextFunction } from "express";
import userService, { UserWithRelations } from "../services/userService";

const userController = {
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users: UserWithRelations[] = await userService.getAllUsers();
            const sanitized = users.map(({ passwordHash, ...rest }) => rest);
            res.json(sanitized);
        } catch (err) {
            next(err);
        }
    },

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const user: UserWithRelations | null = await userService.getUserById(id);
            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }

            const { passwordHash, ...sanitized } = user;
            res.json(sanitized);
        } catch (err) {
            next(err);
        }
    },

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password, role } = req.body;
            const user: UserWithRelations = await userService.createUser({ name, email, password, role });

            if (!password) {
                res.status(400).json({ message: "Senha é obrigatória." });
                return;
            }

            const { passwordHash: _, ...sanitized } = user;
            res.status(201).json(sanitized);
        } catch (err: any) {
            if (err.code === "P2002") {
                res.status(409).json({ message: "Já existe um usuário com este e-mail." });
            } else {
                next(err);
            }
        }
    },

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const { name, email, password, role } = req.body;
            const user: UserWithRelations = await userService.updateUserById(id, { name, email, password, role });

            const { passwordHash: _, ...sanitized } = user;
            res.json(sanitized);
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Usuário não encontrado." });
            } else if (err.code === "P2002") {
                res.status(409).json({ message: "Já existe um usuário com este e-mail." });
            } else {
                next(err);
            }
        }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            await userService.deleteUser(id);
            res.status(204).send();
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Usuário não encontrado." });
            } else {
                next(err);
            }
        }
    },
};

export default userController;
