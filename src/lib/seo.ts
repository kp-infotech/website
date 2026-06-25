import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { getOriginalAssetUrl, isSvgAsset, urlFor } from './sanity';

export const SITE_URL = 'https://kpinfo.tech';
const SITE_ORIGIN = new URL(SITE_URL).origin;

// ---------------------------------------------------------------------------
// Canonical organization identity — single source of truth for NAP + entity.
// Used as schema values and as fallbacks when Sanity siteSettings are empty so
// every surface (footer, nav, contact, schema) agrees on one set of facts.
// ---------------------------------------------------------------------------
export const ORG_ID = `${SITE_URL}/#organization`;
export const ORG_NAME = 'KP Infotech';
export const ORG_EMAIL = 'info@kpinfo.tech';
export const ORG_PHONE = '+91 86182 79004';
export const ORG_LOCALITY = 'Ahmedabad';
export const ORG_REGION = 'Gujarat';
export const ORG_COUNTRY = 'India';
export const ORG_COUNTRY_CODE = 'IN';
export const ORG_ADDRESS_DISPLAY = 'Ahmedabad, Gujarat, India';
export const ORG_DESCRIPTION =
  'KP Infotech is a B2B operations technology partner building custom software, business automation, ERP & Odoo solutions, AI automation & agents, and cloud & DevOps for growing businesses.';

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

  const email = settings?.contactEmail || ORG_EMAIL;
  const telephone = settings?.contactPhone || ORG_PHONE;

  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: settings?.siteName || ORG_NAME,
    url: SITE_URL,
    logo: sanityImageUrl(settings?.logo, 512, 512),
    description: ORG_DESCRIPTION,
    email,
    telephone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: ORG_LOCALITY,
      addressRegion: ORG_REGION,
      addressCountry: ORG_COUNTRY_CODE,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone,
      email,
      areaServed: ['India', 'United States', 'United Kingdom', 'Europe'],
      availableLanguage: ['English'],
    },
    sameAs: socialLinks,
  };
}

export function websiteSchema(settings?: any): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: settings?.siteName || ORG_NAME,
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
  };
}

export function pageId(path: string): string {
  return `${canonicalUrl(path)}#webpage`;
}
