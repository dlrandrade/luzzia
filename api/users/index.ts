// /api/users/index.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const data = await req.json()
  const { username, password, role = 'user' } = data

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password,
        role
      }
    })
    return Response.json(user)
  } catch (error) {
    return new Response('Erro ao criar usuário', { status: 500 })
  }
}
