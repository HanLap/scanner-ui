import { Button } from '@/components/ui/button';
import { FileNode } from '@/lib/filesystem';
import { X } from 'lucide-react';

type Props = {
	file: FileNode;
	onFileRemoved?: () => void;
	showRemove?: boolean;
};

export default function MergeItem({ file, onFileRemoved, showRemove }: Props) {
	return (
		<div className='h-16 rounded-md border bg-card p-2'>
			<div className='flex h-full items-center justify-between pl-2'>
				{file.name}
				{showRemove && (
					<Button
						variant='ghost'
						size='sm'
						className='w-fit'
						data-no-dnd='true'
						onClick={onFileRemoved}
					>
						<X className='w-4' />
					</Button>
				)}
			</div>
		</div>
	);
}
