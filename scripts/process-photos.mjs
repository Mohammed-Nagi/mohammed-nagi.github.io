#!/usr/bin/env node
// Reads photos-src/, applies EXIF-orientation rotation, strips all metadata,
// downsizes to a 2800px long edge, and writes JPEG + WebP pairs into
// src/assets/photos/. Never touches photos-src/.

import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'photos-src');
const OUT_DIR = path.join(PROJECT_ROOT, 'src', 'assets', 'photos');

const MAX_EDGE = 2800;
const JPEG_QUALITY = 90;
const WEBP_QUALITY = 82;

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.heic', '.heif', '.avif']);

function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	const kb = bytes / 1024;
	if (kb < 1024) return `${kb.toFixed(0)} KB`;
	return `${(kb / 1024).toFixed(2)} MB`;
}

function numericSort(a, b) {
	const na = parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
	const nb = parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
	if (na !== nb) return na - nb;
	return a.localeCompare(b);
}

async function listInputFiles() {
	const entries = await readdir(SRC_DIR, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
		.map((entry) => entry.name)
		.sort(numericSort);
}

async function processFile(fileName) {
	const inputPath = path.join(SRC_DIR, fileName);
	const baseName = path.parse(fileName).name;
	const jpegPath = path.join(OUT_DIR, `${baseName}.jpg`);
	const webpPath = path.join(OUT_DIR, `${baseName}.webp`);

	const inputStat = await stat(inputPath);
	const inputMeta = await sharp(inputPath).metadata();

	// .rotate() with no args bakes in the EXIF orientation; not calling
	// .withMetadata() afterwards means the output carries no EXIF/GPS/etc.
	const pipeline = sharp(inputPath)
		.rotate()
		.resize({
			width: MAX_EDGE,
			height: MAX_EDGE,
			fit: 'inside',
			withoutEnlargement: true,
		});

	const jpegInfo = await pipeline.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(jpegPath);
	const webpInfo = await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);

	console.log(
		`${fileName}: ${inputMeta.width}x${inputMeta.height} (${formatBytes(inputStat.size)}) -> ` +
			`${baseName}.jpg ${jpegInfo.width}x${jpegInfo.height} (${formatBytes(jpegInfo.size)}), ` +
			`${baseName}.webp ${webpInfo.width}x${webpInfo.height} (${formatBytes(webpInfo.size)})`
	);

	return jpegInfo.size + webpInfo.size;
}

async function main() {
	await mkdir(OUT_DIR, { recursive: true });

	const files = await listInputFiles();
	if (files.length === 0) {
		console.log(`No images found in ${SRC_DIR}`);
		return;
	}

	let totalOutputSize = 0;
	let failures = 0;

	for (const fileName of files) {
		try {
			totalOutputSize += await processFile(fileName);
		} catch (error) {
			failures += 1;
			console.error(`Failed to process ${fileName}: ${error.message}`);
		}
	}

	const succeeded = files.length - failures;
	console.log('');
	console.log(
		`Processed ${succeeded}/${files.length} images. Total output size: ${formatBytes(totalOutputSize)}.`
	);
	if (failures > 0) {
		process.exitCode = 1;
	}
}

main();
