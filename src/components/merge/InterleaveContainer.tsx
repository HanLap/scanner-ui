import { Button } from '@/components/ui/button';
import { FileNode } from '@/lib/filesystem';
import { cn, download } from '@/lib/utils';
import { interleaveFiles } from './actions';
import { useDroppable } from '@dnd-kit/core';
import { useFormState, useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { SubmitButton } from '../submit-button';

type Props = {
	files: (FileNode | undefined)[];
	onFileRemoved: (file: FileNode) => void;
};

export function InterleaveContainer({ files, onFileRemoved }: Props) {
	const front = files[0];
	const back = files[1];

	const handleInterleaveFiles = async () => {
		if (!front || !back) return;

		const res = await interleaveFiles([front.url, back.url]);

		if (res !== false) {
			download(res);
		}
	};

	return (
		<div className='flex h-full flex-col'>
			<div className='grid grow grid-cols-1 grid-rows-2 gap-8 px-28 py-8'>
				<FileDrop
					id='interleave-front'
					file={front}
					placeholder='Front Pages'
				/>
				<FileDrop id='interleave-back' file={back} placeholder='Back Pages' />
			</div>
			<div className='flex items-center gap-4 p-6 pt-0'>
				<form action={handleInterleaveFiles}>
					<SubmitButton disabled={!front || !back} className='w-24'>
						Interleave
					</SubmitButton>
				</form>
			</div>
		</div>
	);
}

function FileDrop({
	id,
	file,
	placeholder,
}: {
	id: string;
	file: FileNode | undefined;
	placeholder: string;
}) {
	const { isOver, setNodeRef } = useDroppable({ id });
	return (
		<div
			ref={setNodeRef}
			className={cn(
				'flex min-h-full w-full flex-col gap-2 rounded-md border-2 border-dashed p-2',
				isOver && 'bg-primary',
			)}
		>
			{!file ? (
				<div className='flex grow items-center justify-center'>
					<h2 className='font-semibold text-foreground'>{placeholder}</h2>
				</div>
			) : (
				<>{file.name}</>
			)}
		</div>
	);
}
