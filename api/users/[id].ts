import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
        return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
    }

    try {
        if (req.method === 'PUT') {
            const { name, email, role, lastLogin } = await req.json();
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { name, email, role, lastLogin: lastLogin ? new Date(lastLogin) : undefined },
            });
            return new Response(JSON.stringify(updatedUser), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (req.method === 'DELETE') {
            await prisma.user.delete({
                where: { id },
            });
            return new Response(null, { status: 204 });
        } else {
            return new Response('Method Not Allowed', { status: 405 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
