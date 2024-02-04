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
import { useEffect, useState } from 'react';
import Draggable from '../components/Draggable';
import MergeContainer from '@/components/merge/MergeContainer';
import MergeItem from '@/components/merge/MergeItem';

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
					<Link href={`/file/${entry.url}` as Route}>
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

	const [mergeList, setMergeList] = useState<(FileNode | undefined)[]>([]);
	const removeMergeList = (file: FileNode) =>
		setMergeList((list) => list.filter((f) => file.url !== f?.url));

	const [activeDrag, setActiveDrag] = useState<FileNode | undefined>(undefined);

	function handleDragStart(event: DragStartEvent) {
		const file = event.active.data.current as FileNode;

		setActiveDrag(file);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		setActiveDrag(undefined);

		if (!over) {
			return;
		}

		if (over.id === 'concat' && active.id !== over.id) {
			const file = active.data.current as FileNode;
			setMergeList((items) => {
				const oldIndex = items.findIndex((f) => f?.id === file.id);
				const newIndex = items.findIndex((f) => f?.id === over.id);

				if (oldIndex === -1) {
					return [...items, file];
				}

				return arrayMove(items, oldIndex, newIndex);
			});
		}

		if (over.id === 'interleave-front') {
			const file = active.data.current as FileNode;
			setMergeList((items) => [file, ...items.slice(1)]);
		}

		if (over.id === 'interleave-back') {
			const file = active.data.current as FileNode;
			setMergeList((items) => [items[0], file, ...items.slice(2)]);
		}
	}

	const mouseSensor = useSensor(MouseSensor);
	const keyboardSensor = useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates,
	});

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			collisionDetection={closestCenter}
			sensors={[keyboardSensor, mouseSensor]}
		>
			<div className='flex w-full justify-end border-b-2 p-4'>
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
				<div className='h-full grow overflow-y-auto p-4 px-12'>
					<DataTable
						columns={columns}
						data={files}
						sort={sort}
						disabledRows={mergeList.filter(Boolean) as FileNode[]}
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
	);
}
