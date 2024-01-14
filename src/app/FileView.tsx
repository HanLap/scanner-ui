'use client';

import { Button } from '@/components/ui/button';
import {
	ColumnDefinition,
	DataTable,
	SortOrder,
	colHelper,
} from '@/components/ui/data-table';
import { dateFormat } from '@/lib/date';
import { FileNode } from '@/lib/filesystem';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const columns: ColumnDefinition<FileNode>[] = [
	colHelper('name', { header: 'Name' }),
	colHelper('date', {
		header: 'Created',
		cell: ({ value }) => dateFormat.format(value),
	}),
	{
		id: 'actions',
		cell: ({ entry }) => (
			<div className="flex justify-end">
				<Button variant='ghost' size='sm' title='download' asChild>
					<Link href={entry.url}>
						<Download className='h-4 w-4' />
					</Link>
				</Button>
			</div>
		),
	},
];

export default function FileView({ files }: { files: FileNode[] }) {
	const [sort, setSort] = useState<SortOrder<FileNode> | undefined>(undefined);

	return (
		<>
			<DataTable
				columns={columns}
				data={files}
				rowKey={(file) => file.url}
				sort={sort}
				onSortChanged={setSort}
			/>
		</>
	);
}
