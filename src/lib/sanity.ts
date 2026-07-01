import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const sanityToken = import.meta.env.SSR
  ? import.meta.env.SANITY_API_TOKEN
  : undefined;
const shouldUseCdn = import.meta.env.PROD && !sanityToken;

if (!projectId) {
  throw new Error(
    'PUBLIC_SANITY_PROJECT_ID is not defined. ' +
    'Ensure environment variables are set in your hosting provider\'s dashboard.'
  );
}

export const client = createClient({
  projectId,
  dataset,
  token: sanityToken,
  perspective: 'published',
  useCdn: shouldUseCdn,
  apiVersion: '2024-01-01',
});

// Image URL builder
const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper to get responsive image URL
export function getImageUrl(
  source: SanityImageSource,
  width: number,
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  return urlFor(source).width(width).format(format).url();
}

// Helper for responsive image srcset
export function getImageSrcSet(
  source: SanityImageSource,
  widths: number[] = [400, 800, 1200, 1600],
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  return widths
    .map((w) => `${urlFor(source).width(w).format(format).url()} ${w}w`)
    .join(', ');
}

/**
 * Get the original asset URL without any transformations.
 * Useful for SVGs where you want the original vector file, not a raster conversion.
 *
 * Sanity asset ref format: image-{assetId}-{dimensions}-{format} or image-{assetId}-{format}
 * The assetId can contain hyphens, so we parse from the ends.
 */
export function getOriginalAssetUrl(source: SanityImageSource): string | null {
  if (!source) return null;

  // Handle different source formats
  const ref = typeof source === 'string'
    ? source
    : (source as any)?.asset?._ref || (source as any)?._ref;

  if (!ref || !ref.startsWith('image-')) return null;

  // Split the reference
  const parts = ref.split('-');
  if (parts.length < 3) return null;

  // Last part is always the format (svg, png, jpg, etc.)
  const format = parts[parts.length - 1];
  if (!/^(svg|png|jpg|jpeg|gif|webp)$/i.test(format)) return null;

  // Second-to-last might be dimensions (e.g., "800x600") or part of asset ID
  const secondToLast = parts[parts.length - 2];
  const hasDimensions = /^\d+x\d+$/.test(secondToLast);

  // Asset ID is everything between "image-" prefix and format/dimensions suffix
  const assetIdParts = hasDimensions
    ? parts.slice(1, -2)  // Skip "image" and last two (dimensions + format)
    : parts.slice(1, -1); // Skip "image" and last one (format only)

  const assetId = assetIdParts.join('-');

  if (!assetId) return null;

  // Construct the raw CDN URL
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}.${format}`;
}

/**
 * Check if a Sanity image asset is an SVG
 */
export function isSvgAsset(source: SanityImageSource): boolean {
  if (!source) return false;

  const ref = typeof source === 'string'
    ? source
    : (source as any)?.asset?._ref || (source as any)?._ref;

  return ref?.endsWith('-svg') || false;
}
