import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime-types';

export type FileNode = FileEntry | Directory;

type FileEntry = {
	name: string;
	url: string;
	date: Date;
};

type Directory = {
	name: string;
	url: string;
	children: FileNode[];
	date: Date;
};

const nowWithMin = (min: number) => {
	const date = new Date();
	date.setMinutes(min);
	date.setSeconds(0);
	return date;
};

export async function getFileTree(): Promise<FileNode[]> {
	const dir = await fs.readdir(process.env.FILE_ROOT);

	const items = await Promise.all(
		dir.map(async (fileName) => {
			const filePath = path.join(process.env.FILE_ROOT, fileName);

			return { name: fileName, stats: await fs.lstat(filePath) };
		}),
	);

	const files = items.filter(({ stats }) => stats.isFile());

	return files.map((file) => ({
		name: file.name,
		url: path.join('/file', file.name),
		date: file.stats.mtime,
	}));
}

export async function readFile(fileName: string): Promise<{
	mimeType: string | false;
	blob?: Buffer;
}> {
	const filePath = path.join(process.env.FILE_ROOT, fileName);
	const mimeType = mime.lookup(filePath);

	try {
		const blob = await fs.readFile(filePath);

		return { mimeType, blob };
	} catch (e) {
		return { mimeType };
	}
}
