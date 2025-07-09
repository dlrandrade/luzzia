import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
    try {
        if (req.method === 'GET') {
            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return new Response(JSON.stringify(users), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (req.method === 'POST') {
            const { name, email, role } = await req.json();
            const newUser = await prisma.user.create({
                data: { name, email, role, lastLogin: new Date() },
            });
            return new Response(JSON.stringify(newUser), {
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
