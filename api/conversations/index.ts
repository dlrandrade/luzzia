// /api/conversations/index.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { userId, message } = await req.json()

  try {
    const saved = await prisma.conversation.create({
      data: { userId, message }
    })

    return Response.json(saved)
  } catch (e) {
    return new Response('Erro ao salvar mensagem', { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) return new Response('userId obrigatório', { status: 400 })

  const messages = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  return Response.json(messages)
}
