import { getFileTree } from '@/lib/filesystem';
import FileView from './FileView';

export default async function Home() {
	const files = await getFileTree();
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<FileView files={files} />
		</main>
	);
}
