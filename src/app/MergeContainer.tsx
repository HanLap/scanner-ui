import { Button } from '@/components/ui/button';
import { FileNode } from '@/lib/filesystem';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Draggable from './Draggable';
import MergeItem from './MergeItem';
import { mergeFiles } from './actions';

type Props = {
	files: FileNode[];
	onFileRemoved: (file: FileNode) => void;
	open: boolean;
};

export default function MergeContainer({ files, onFileRemoved, open }: Props) {
	const { isOver, setNodeRef } = useDroppable({ id: 'droppable' });

	const handleMergeFiles = async () => {
		const res = await mergeFiles(files.map(({ id }) => id));
		console.log(res);
	};

	return (
		<aside className='h-full overflow-hidden p-8 pl-0 transition-all'>
			<div className='flex h-full min-w-[28rem] flex-col overflow-hidden border-l-2'>
				<div className='p-6'>
					<h3 className='text-2xl font-semibold'>Merge Files</h3>
				</div>
				<div className='grow p-6 pt-0'>
					<div
						ref={setNodeRef}
						className={cn(
							'flex min-h-full w-full flex-col gap-2 rounded-md border-2 border-dashed p-2',
							isOver && 'bg-primary',
						)}
					>
						<SortableContext
							items={files}
							strategy={verticalListSortingStrategy}
						>
							{files.length < 1 ? (
								<div className='flex grow items-center justify-center'>
									<h2 className='font-semibold text-foreground'>
										Drag File here
									</h2>
								</div>
							) : (
								files.map((file) => (
									<Draggable key={file.url} id={file.url} data={file}>
										<MergeItem
											key={file.url}
											file={file}
											onFileRemoved={() => onFileRemoved(file)}
											showRemove
										/>
									</Draggable>
								))
							)}
						</SortableContext>
					</div>
				</div>
				<div className='flex items-center p-6 pt-0'>
					<Button variant='outline' onClick={handleMergeFiles}>
						Merge
					</Button>
				</div>
			</div>
		</aside>
	);
}
