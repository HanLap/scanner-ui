import { readFile } from '@/lib/filesystem';

export async function GET(
	_: Request,
	{ params }: { params: { slug: string } },
) {
	const { mimeType, blob } = await readFile(params.slug);

	if (!blob) {
		return new Response('Not Found', { status: 404 });
	}

	if (!mimeType) {
		return new Response('Unkown Mime-Type', {
			status: 500,
		});
	}

	return new Response(blob, {
		headers: { 'Content-Type': mimeType },
	});
}
