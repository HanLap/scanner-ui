export type FileNode = (FileEntry | Directory);

type FileEntry = {
	name: string;
	url: string;
	date: Date;
};

type Directory = {
	name: string;
	url: string;
	children: FileNode[];
	date: Date;
};

const nowWithMin = (min: number) => {
	const date = new Date();
	date.setMinutes(min);
	date.setSeconds(0);
	return date;
}

export async function getFileTree(): Promise<FileNode[]> {
	return [
		{
			name: 'Test1.pdf',
			url: 'https:localhost/test1.pdf',
			date: nowWithMin(1),
		},
		{
			name: 'Test2.pdf',
			url: 'https:localhost/test2.pdf',
			date: nowWithMin(2),
		},
		{
			name: 'Test3.pdf',
			url: 'https:localhost/test3.pdf',
			date: nowWithMin(3),
		},
		{
			name: 'Test4.pdf',
			url: 'https:localhost/test4.pdf',
			date: nowWithMin(4),
		},
		{
			name: 'Test5.pdf',
			url: 'https:localhost/test5.pdf',
			date: nowWithMin(5),
		},
	];
}
