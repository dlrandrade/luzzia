import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, role = 'user' } = req.body

    try {
      const user = await prisma.user.create({
        data: { username, password, role },
      })
      return res.status(201).json(user)
    } catch (error) {
  console.error(error); // importante para Vercel logar
  return res.status(500).json({ error: error.message || 'Erro desconhecido' });
}
  } else {
    return res.status(405).json({ error: 'Método não permitido' })
  }
}
