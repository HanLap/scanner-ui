'use client';

import { SortAsc, SortDesc } from 'lucide-react';
import { ComponentProps, Key, ReactNode, useMemo } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './table';

type CellArguments<Tentry> = {
	entry: Tentry;
};

export type ColumnDefinition<TEntry> = {
	id: any;
	header?: (() => ReactNode | string) | string;
	cell: (args: CellArguments<TEntry>) => ReactNode;
	sort?: (a: TEntry, b: TEntry) => number;
	headProps?: ComponentProps<typeof TableHead>;
	cellProps?: ComponentProps<typeof TableCell>;
};

type AccessorDefinition<TEntry, TValue extends TEntry[keyof TEntry]> = Omit<
	ColumnDefinition<TEntry>,
	'id' | 'cell'
> & {
	cell?: (args: CellArguments<TEntry> & { value: TValue }) => ReactNode;
};

function colHelper<TEntry, TKey extends keyof TEntry>(
	accessor: TKey,
	def: AccessorDefinition<TEntry, TEntry[TKey]>,
): ColumnDefinition<TEntry> {
	return {
		id: accessor,
		sort: (a, b) => (a[accessor] as any) - (b[accessor] as any),
		...def,
		cell: ({ entry }) => {
			const value = entry[accessor];

			return def.cell?.({ value, entry }) ?? (value as ReactNode);
		},
	};
}

export type SortOrder<TEntry> = {
	id: keyof TEntry;
	direction: 'ASC' | 'DESC';
};

type DataTableProps<TEntry> = {
	rowKey: (entry: TEntry) => Key | null | undefined;
	data: TEntry[];
	columns: ColumnDefinition<TEntry>[];
	disabledRows: TEntry[];
	className?: string;
	sort?: SortOrder<TEntry>;
	rowComponent?: (props: {
		children: ReactNode[];
		entry: TEntry;
		disabled: boolean;
	}) => ReactNode;
	onSortChanged: (sort: SortOrder<TEntry>) => void;
};

const DataTable = <T,>({
	className,
	columns,
	data,
	disabledRows,
	rowKey,
	sort,
	rowComponent,
	onSortChanged,
}: DataTableProps<T>) => {
	const header = useMemo(
		() =>
			columns.map(({ id, header, sort: sortFn }) => (
				<TableHead
					key={id}
					className={
						sortFn &&
						'cursor-pointer hover:bg-accent hover:text-accent-foreground'
					}
					onClick={() => {
						if (!sortFn) return;
						if (!sort || sort.id !== id || sort.direction === 'ASC') {
							onSortChanged({ id, direction: 'DESC' });
						} else {
							onSortChanged({ id, direction: 'ASC' });
						}
					}}
				>
					<span className='flex items-center gap-2'>
						{sort &&
							sort.id === id &&
							(sort?.direction === 'ASC' ? (
								<SortAsc className='w-4' />
							) : (
								<SortDesc className='w-4' />
							))}
						{typeof header === 'function' ? header() : header}
					</span>
				</TableHead>
			)),
		[columns, sort, onSortChanged],
	);

	const sorted = useMemo(() => {
		if (!sort) return data;

		const col = columns.find(({ id }) => id === sort.id);
		if (!col) return data;

		const sortAsc = data.toSorted(col.sort);

		return sort.direction === 'ASC' ? sortAsc : sortAsc.toReversed();
	}, [columns, data, sort]);

	const body = useMemo(
		() =>
			sorted.map((entry, i) => {
				const key = rowKey(entry);
				const children = columns.map((colDef) => (
					<TableCell key={colDef.id}>{colDef.cell({ entry })}</TableCell>
				));
				const disabled = !!disabledRows.find((row) => key === rowKey(row));

				if (rowComponent) {
					return rowComponent({ children, entry, disabled });
				}

				return <TableRow key={key}>{children}</TableRow>;
			}),
		[sorted, columns, rowKey, disabledRows, rowComponent],
	);

	return (
		<Table className={className}>
			<TableHeader>
				<TableRow>{header}</TableRow>
			</TableHeader>
			<TableBody>{body}</TableBody>
		</Table>
	);
};

export { DataTable, colHelper };
