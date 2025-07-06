import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password, image = null, role = 'user' } = req.body

    try {
      // Verifica se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return res.status(409).json({ error: 'Usuário já existe' })
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          image,
          role,
        },
      })

      return res.status(201).json(user)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: error.message || 'Erro interno' })
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido' })
  }
}
