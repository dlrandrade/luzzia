import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
        return new Response(JSON.stringify({ message: 'Provider ID is required' }), { status: 400 });
    }

    try {
        if (req.method === 'PUT') {
            const { apiKey, isActive, model } = await req.json();
            const updatedProvider = await prisma.apiProvider.update({
                where: { id },
                data: { apiKey, isActive, model },
            });
            return new Response(JSON.stringify(updatedProvider), {
                status: 200,
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
