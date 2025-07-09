import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return new Response(JSON.stringify({ message: 'Chat thread ID is required' }), { status: 400 });
  }

  try {
    if (req.method === 'PUT') {
      const { messages } = await req.json();

      if (!Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ message: 'Messages are required' }), { status: 400 });
      }

      // Add new messages to the existing thread
      const transaction = await prisma.$transaction(
        messages.map((msg) =>
          prisma.chatMessage.create({
            data: {
              sender: msg.sender,
              text: msg.text,
              agentName: msg.agentName,
              chatThreadId: id,
            },
          })
        )
      );

      // Also update the `updatedAt` field of the thread
      await prisma.chatThread.update({
          where: { id },
          data: { updatedAt: new Date() }
      });

      return new Response(JSON.stringify(transaction), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response('Method Not Allowed', { status: 405 });
    }
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}
