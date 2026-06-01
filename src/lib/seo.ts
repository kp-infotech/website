import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { getOriginalAssetUrl, isSvgAsset, urlFor } from './sanity';

export const SITE_URL = 'https://kpinfo.tech';
const SITE_ORIGIN = new URL(SITE_URL).origin;

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined };

export type JsonLdNode = Record<string, JsonValue | undefined>;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(input?: string | URL | null): string {
  if (!input) return SITE_URL;

  const raw = input instanceof URL ? input.href : input;
  return new URL(raw, SITE_ORIGIN).href;
}

export function canonicalUrl(input?: string | URL | null): string {
  const url = new URL(input ? String(input) : SITE_URL, SITE_ORIGIN);
  url.protocol = 'https:';
  url.host = new URL(SITE_URL).host;
  url.search = '';
  url.hash = '';

  const lastSegment = url.pathname.split('/').filter(Boolean).at(-1);
  const hasFileExtension = !!lastSegment && /\.[a-z0-9]+$/i.test(lastSegment);
  if (!hasFileExtension && !url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }

  return url.href;
}

export function sanityImageUrl(source?: SanityImageSource | null, width = 1200, height = 630): string | undefined {
  if (!source) return undefined;

  try {
    if (isSvgAsset(source)) {
      return getOriginalAssetUrl(source) || undefined;
    }

    return urlFor(source).width(width).height(height).fit('crop').format('jpg').url();
  } catch {
    return undefined;
  }
}

export function seoImageUrl(
  pageImage?: string | SanityImageSource | null,
  defaultImage?: SanityImageSource | null,
  fallbackImage?: string | null
): string | undefined {
  if (typeof pageImage === 'string' && pageImage.trim()) {
    return absoluteUrl(pageImage);
  }

  const pageSanityImage = pageImage ? sanityImageUrl(pageImage as SanityImageSource) : undefined;
  const defaultSanityImage = sanityImageUrl(defaultImage);
  const fallback = fallbackImage ? absoluteUrl(fallbackImage) : undefined;

  return pageSanityImage || defaultSanityImage || fallback;
}

export function removeEmpty<T extends JsonValue | undefined>(value: T): T | undefined {
  if (value === undefined || value === null || value === '') return undefined;

  if (Array.isArray(value)) {
    const items = value
      .map((item) => removeEmpty(item))
      .filter((item): item is JsonValue => item !== undefined);

    return (items.length > 0 ? items : undefined) as T | undefined;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, removeEmpty(item as JsonValue)] as const)
      .filter(([, item]) => item !== undefined);

    return (entries.length > 0 ? Object.fromEntries(entries) : undefined) as T | undefined;
  }

  return value;
}

export function jsonLdGraph(nodes: Array<JsonLdNode | undefined | null>): JsonLdNode | undefined {
  const graph = nodes
    .map((node) => removeEmpty(node as JsonValue) as JsonLdNode | undefined)
    .filter((node): node is JsonLdNode => !!node);

  if (graph.length === 0) return undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdNode | undefined {
  if (items.length === 0) return undefined;

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function organizationSchema(settings?: any): JsonLdNode {
  const socialLinks = settings?.socialLinks
    ? Object.values(settings.socialLinks).filter((url): url is string => typeof url === 'string' && url.length > 0)
    : [];

  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: settings?.siteName || 'KP Infotech',
    url: SITE_URL,
    logo: sanityImageUrl(settings?.logo, 512, 512),
    email: settings?.contactEmail,
    telephone: settings?.contactPhone,
    address: settings?.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressCountry: 'IN',
        }
      : undefined,
    sameAs: socialLinks,
  };
}

export function websiteSchema(settings?: any): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: settings?.siteName || 'KP Infotech',
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function pageId(path: string): string {
  return `${canonicalUrl(path)}#webpage`;
}
