// /api/auth/login.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const user = await prisma.user.findFirst({
    where: { username, password }
  })

  if (!user) {
    return new Response('Credenciais inválidas', { status: 401 })
  }

  return Response.json({
    id: user.id,
    username: user.username,
    role: user.role
  })
}
