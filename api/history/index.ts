import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
  try {
    if (req.method === 'GET') {
      const threads = await prisma.chatThread.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      const history = threads.map(thread => ({
        id: thread.id, // HistoryItem ID
        type: thread.type,
        title: thread.title,
        summary: thread.summary,
        chatThreadId: thread.id, // Reference to the chat thread
      }));

      const chats = threads.reduce((acc, thread) => {
        acc[thread.id] = thread.messages.map(msg => ({
          id: msg.id,
          sender: msg.sender,
          text: msg.text,
          agentName: msg.agentName,
        }));
        return acc;
      }, {} as Record<string, any[]>);

      return new Response(JSON.stringify({ history, chats }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (req.method === 'POST') {
      const { title, type, summary, messages } = await req.json();

      const newThread = await prisma.chatThread.create({
        data: {
          title,
          type,
          summary,
          messages: {
            create: messages.map((msg: any) => ({
              sender: msg.sender,
              text: msg.text,
              agentName: msg.agentName,
            })),
          },
        },
      });
      
      const newHistoryItem = {
          id: newThread.id,
          type: newThread.type,
          title: newThread.title,
          summary: newThread.summary,
          chatThreadId: newThread.id,
      };

      return new Response(JSON.stringify({ newHistoryItem, newChatThreadId: newThread.id }), {
        status: 201,
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
