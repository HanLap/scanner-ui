import { getFileTree } from '@/lib/filesystem';
import FileView from './FileView';

export default async function Home() {
	const files = await getFileTree();
	return (
		<main className='h-screen w-screen flex flex-col'>
			<FileView files={files} />
		</main>
	);
}
