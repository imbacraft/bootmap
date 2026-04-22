import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Extend Starlight's docs schema with bootmap.dev versioning and source fields.
// Enforced at build time — missing required fields fail the build.
const bootmapDocsSchema = () =>
	docsSchema({
		extend: z.object({
			minVersion: z.string().optional(),
			currentVersion: z.string().optional(),
			lastReviewed: z.string().optional(),
			officialSource: z.string().url().optional(),
			versionHistory: z
				.array(
					z.object({
						version: z.string(),
						change: z.string(),
					}),
				)
				.optional(),
		}),
	});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: bootmapDocsSchema() }),
};
