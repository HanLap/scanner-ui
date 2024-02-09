import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/ui/mode-toggle';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Scanner UI',
	description: 'Tool to merge and download scanned pdfs',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link rel='icon' href='/favicon.svg' type='image/svg+xml' sizes='any' />
			</head>
			<body className='w-sceen h-screen overflow-hidden'>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<div className='fixed bottom-4 right-4'>
						<ModeToggle />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
