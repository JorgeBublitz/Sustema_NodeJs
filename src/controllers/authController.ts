import { Request, Response, NextFunction } from "express";
import authService, { AuthError } from "../services/authService";

const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ message: "Informe 'email' e 'password'." });
        return;
      }

      const result = await authService.login(email.trim().toLowerCase(), password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const user = await authService.getMe(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};

export { AuthError };
export default authController;
