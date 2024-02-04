'use server';

import { FileNode } from '@/lib/filesystem';
import { interleavePdfs, mergePdfs } from '@/lib/pdf';

export async function mergeFiles(files: string[]) {
	console.log(files);
	return mergePdfs(files);
}

export async function interleaveFiles(files: string[]) {
	console.log(files);
	return interleavePdfs(files[0], files[1]);
}
