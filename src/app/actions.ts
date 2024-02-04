'use server';

import { FileNode } from '@/lib/filesystem';

export async function mergeFiles(files: FileNode['id'][]) {
  console.log(files)
}
