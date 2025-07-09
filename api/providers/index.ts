import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
    try {
        if (req.method === 'GET') {
            const providers = await prisma.apiProvider.findMany({
                orderBy: { createdAt: 'asc' },
            });
             if (providers.length === 0) {
                // Seed data if table is empty
                const seedData = [
                    { providerId: 'groq', name: 'Groq', apiKey: 'gsk_...', isActive: true, model: 'llama3-70b-8192' },
                    { providerId: 'gemini', name: 'Gemini', apiKey: 'aisk_...', isActive: true, model: 'gemini-2.5-flash' },
                    { providerId: 'openai', name: 'OpenAI', apiKey: 'sk_...', isActive: false, model: 'gpt-4o' },
                    { providerId: 'openrouter', name: 'OpenRouter', apiKey: 'sk_or_...', isActive: false, model: 'openrouter/anthropic/claude-3.5-sonnet' },
                ];
                await prisma.apiProvider.createMany({data: seedData});
                const newProviders = await prisma.apiProvider.findMany({
                    orderBy: { createdAt: 'asc' },
                });
                return new Response(JSON.stringify(newProviders), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(providers), {
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
