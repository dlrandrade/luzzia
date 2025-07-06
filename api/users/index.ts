import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    try {
      const userExists = await prisma.user.findUnique({ where: { email } });

      if (userExists) {
        return res.status(409).json({ error: "Usuário já existe." });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  } else {
    return res.status(405).json({ error: "Método não permitido." });
  }
}
