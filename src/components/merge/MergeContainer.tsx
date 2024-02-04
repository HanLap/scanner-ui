import { FileNode } from '@/lib/filesystem';
import { ConcatContainer } from './ConcatContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterleaveContainer } from './InterleaveContainer';

type Props = {
	files: (FileNode | undefined)[];
	onFileRemoved: (file: FileNode) => void;
	open: boolean;
};

export default function MergeContainer({ files, onFileRemoved, open }: Props) {
	return (
		<aside className='flex h-full flex-col overflow-hidden border-l-2 p-8 transition-all'>
			<Tabs defaultValue='interleave' className='grow flex-col'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='concat'>Concat</TabsTrigger>
					<TabsTrigger value='interleave'>Interleave</TabsTrigger>
				</TabsList>

				<TabsContent
					value='concat'
					className='flex h-full min-w-[20rem] flex-col overflow-hidden data-[state=inactive]:h-0'
				>
					<ConcatContainer
						files={files.filter(Boolean) as FileNode[]}
						onFileRemoved={onFileRemoved}
					/>
				</TabsContent>
				<TabsContent
					value='interleave'
					className='state-[state=inactive]:h-0 flex h-full min-w-[20rem] flex-col overflow-hidden'
				>
					<InterleaveContainer files={files} onFileRemoved={onFileRemoved} />
				</TabsContent>
			</Tabs>
		</aside>
	);
}
