'use client';

import { Button } from '@/components/ui/button';
import {
	ColumnDefinition,
	DataTable,
	SortOrder,
	colHelper,
} from '@/components/ui/data-table';
import { TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { dateFormat } from '@/lib/date';
import { KeyboardSensor, MouseSensor } from '@/lib/dnd';
import { FileNode } from '@/lib/filesystem';
import { cn } from '@/lib/utils';
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	closestCenter,
	useSensor,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Download } from 'lucide-react';
import { Route } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Draggable from './Draggable';
import MergeContainer from './MergeContainer';
import MergeItem from './MergeItem';

const columns: ColumnDefinition<FileNode>[] = [
	colHelper('name', { header: 'Name' }),
	colHelper('date', {
		header: 'Created',
		cell: ({ value }) => dateFormat.format(value),
	}),
	{
		id: 'actions',
		cell: ({ entry }) => (
			<div className='flex justify-end'>
				<Button
					variant='ghost'
					size='sm'
					title='download'
					data-no-dnd='true'
					asChild
				>
					<Link href={entry.url as Route}>
						<Download className='h-4 w-4' />
					</Link>
				</Button>
			</div>
		),
	},
];

export default function FileView({ files }: { files: FileNode[] }) {
	const [sort, setSort] = useState<SortOrder<FileNode> | undefined>(undefined);

	const [showMerge, setShowMerge] = useState(false);

	const [mergeList, setMergeList] = useState<FileNode[]>([]);
	const removeMergeList = (file: FileNode) =>
		setMergeList((list) => list.filter((f) => file.url !== f.url));

	const [activeDrag, setActiveDrag] = useState<FileNode | undefined>(undefined);

	function handleDragStart(event: DragStartEvent) {
		const file = event.active.data.current as FileNode;

		setActiveDrag(file);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		setActiveDrag(undefined);

		if (over && active.id !== over.id) {
			const file = active.data.current as FileNode;
			setMergeList((items) => {
				const oldIndex = items.findIndex(({ id }) => id === file.id);
				const newIndex = items.findIndex(({ id }) => id === over.id);

				if (oldIndex === -1) {
					return [...items, file];
				}

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	const mouseSensor = useSensor(MouseSensor);
	const keyboardSensor = useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates,
	});

	return (
		<>
			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				collisionDetection={closestCenter}
				sensors={[keyboardSensor, mouseSensor]}
			>
				<div className='flex w-full justify-end p-4'>
					<Toggle
						aria-label='Toggle Merge View'
						variant='outline'
						pressed={showMerge}
						onPressedChange={(pressed) => setShowMerge(pressed)}
					>
						Merge
					</Toggle>
				</div>
				<div className='flex grow overflow-y-auto overflow-x-hidden'>
					<div className='h-full grow overflow-y-auto px-12'>
						<DataTable
							columns={columns}
							data={files}
							sort={sort}
							disabledRows={mergeList}
							onSortChanged={setSort}
							className='w-full'
							rowKey={(entry) => entry.url}
							rowComponent={({ children, entry, disabled }) => (
								<Draggable
									id={entry.url}
									key={entry.url}
									disabled={!showMerge || disabled}
									data={entry}
								>
									{({ setNodeRef, attributes, listeners }) => (
										<TableRow
											ref={setNodeRef}
											className='aria-disabled:cursor-default aria-disabled:text-muted-foreground'
											{...listeners}
											{...attributes}
											suppressHydrationWarning
										>
											{children}
										</TableRow>
									)}
								</Draggable>
							)}
						/>
					</div>
					<div
						className={cn(
							'min-w-0 flex-[0_0_0] transition-all',
							showMerge && 'flex-[0_0_30rem]',
						)}
					>
						<MergeContainer
							open={showMerge}
							files={mergeList}
							onFileRemoved={removeMergeList}
						/>
					</div>
				</div>

				<DragOverlay>
					{!!activeDrag && <MergeItem file={activeDrag} />}
				</DragOverlay>
			</DndContext>
		</>
	);
}
