'use server';

import { FileNode } from '@/lib/filesystem';
import { interleavePdfs, mergePdfs } from '@/lib/pdf';

export async function mergeFiles(files: string[]) {
	return mergePdfs(files);
}

export async function interleaveFiles(files: string[]) {
	return interleavePdfs(files[0], files[1]);
}
