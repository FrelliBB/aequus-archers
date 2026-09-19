import type { ImageMetadata } from "astro";

const files = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/images/**/*.{jpg,jpeg,png,webp}",
	{ eager: true },
);

export function photo(path: string): ImageMetadata {
	const file = files[`/src/assets/images/${path}`];
	if (!file) throw new Error(`Image not found: src/assets/images/${path}`);
	return file.default;
}
