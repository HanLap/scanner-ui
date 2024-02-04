import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { readFile } from './filesystem';

const MIMETYPE_PDF = 'application/pdf';

export async function mergePdfs(fileNames: string[]) {
	const files = await Promise.all(fileNames.map((f) => readFile(f)));

	if (files.find((f) => f.mimeType !== MIMETYPE_PDF)) {
		return false;
	}

	const blobs = files.map(({ blob }) => blob);

	if (blobs.find((blob) => blob === undefined)) {
		return false;
	}

	const docs = await Promise.all(
		files.map(({ blob }) => PDFDocument.load(blob as Buffer)),
	);

	const result = await PDFDocument.create();
	const copies = await Promise.all(docs.map((doc) => copyPages(result, doc)));

	const maxPdfPages = copies.reduce(
		(acc, p) => (acc > p.length ? acc : p.length),
		0,
	);

	for (let i = 0; i < maxPdfPages; i++) {
		copies.forEach((pageList) => {
			const page = pageList[i];
			if (page) {
				result.addPage(page);
			}
		});
	}

	return result.save();
}

export async function interleavePdfs(front: string, back: string) {
	const [frontFile, backFile] = await Promise.all([
		readFile(front),
		readFile(back),
	]);

	if (
		frontFile.mimeType !== MIMETYPE_PDF ||
		backFile.mimeType !== MIMETYPE_PDF
	) {
		return false;
	}

	if (!frontFile.blob || !backFile.blob) {
		return false;
	}

	const frontPdf = await PDFDocument.load(frontFile.blob);
	const backPdf = await PDFDocument.load(backFile.blob);
	const resultPdf = await PDFDocument.create();

	const frontPages = await copyPages(resultPdf, frontPdf);
	const backPages = await copyPages(resultPdf, backPdf);

	const maxPdfPages =
		frontPages.length > backPages.length ? frontPages.length : backPages.length;

	for (let i = 0; i < maxPdfPages; i++) {
		const frontPage = frontPages[i];
		if (frontPage) resultPdf.addPage(frontPage);
		const backPage = backPages[backPages.length - 1 - i];
		if (backPage) resultPdf.addPage(backPage);
	}

	return resultPdf.save();
}

async function copyPages(to: PDFDocument, from: PDFDocument) {
	return to.copyPages(from, from.getPageIndices());
}
