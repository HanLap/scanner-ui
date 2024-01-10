import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<Card>
				<CardHeader>
					<CardTitle>hihi</CardTitle>
					<CardDescription>hhoho</CardDescription>
				</CardHeader>
				<CardContent>blub</CardContent>
				<CardFooter>
					<Button variant='destructive'>Hi</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
