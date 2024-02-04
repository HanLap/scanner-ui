import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime-types';
import { UniqueIdentifier } from '@dnd-kit/core';

export type FileNode = FileEntry | Directory;

type FileEntry = {
	id: UniqueIdentifier
	name: string;
	url: string;
	date: Date;
};

type Directory = {
	id: UniqueIdentifier
	name: string;
	url: string;
	children: FileNode[];
	date: Date;
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
		id: path.join('/file', file.name),
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
