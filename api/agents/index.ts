import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
    try {
        if (req.method === 'GET') {
            const agents = await prisma.agent.findMany({
                orderBy: { createdAt: 'asc' },
            });
            return new Response(JSON.stringify(agents), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (req.method === 'POST') {
            const { name, description, prompt } = await req.json();
            const newAgent = await prisma.agent.create({
                data: { name, description, prompt },
            });
            return new Response(JSON.stringify(newAgent), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response('Method Not Allowed', { status: 405 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
