// GROQ Queries for KP Infotech website

// ============================================
// Site Settings
// ============================================
export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    siteName,
    siteTagline,
    heroHeadline,
    logo,
    contactEmail,
    contactPhone,
    address,
    socialLinks,
    techStack,
    stats,
    footerText,
    defaultSeoTitle,
    defaultSeoDescription,
    defaultOgImage
  }
`;

// Page Heroes (singleton)
export const pageHeroesQuery = `
  *[_type == "pageHeroes"][0] {
    homeHero,
    aboutHero,
    contactHero,
    workHero,
    servicesHero,
    industriesHero,
    insightsHero
  }
`;

// Homepage data - fetches all data needed for the homepage
export const homepageDataQuery = `
{
  "siteSettings": *[_type == "siteSettings"][0] {
    siteName,
    siteTagline,
    heroHeadline,
    logo,
    contactEmail,
    contactPhone,
    address,
    socialLinks,
    defaultSeoTitle,
    defaultSeoDescription,
    defaultOgImage,
    techStack,
    stats
  },
  "services": *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    tagline,
    iconName,
    "iconCustom": coalesce(iconCustom, icon),
    heroImage
  },
  "industries": *[_type == "industry"] | order(order asc) {
    _id,
    title,
    slug,
    tagline,
    excerpt,
    iconName,
    "iconCustom": coalesce(iconCustom, icon)
  },
  "featuredWork": *[_type == "caseStudy" && featured == true] | order(_createdAt desc)[0...4] {
    _id,
    title,
    slug,
    client,
    thumbnailImage
  },
  "testimonials": *[_type == "testimonial" && featured == true] | order(_createdAt desc)[0...5] {
    _id,
    quote,
    "clientName": authorName,
    "clientRole": authorRole,
    "clientCompany": company,
    "clientPhoto": authorPhoto
  }
}
`;

// ============================================
// Services
// ============================================
export const allServicesQuery = `
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    tagline,
    excerpt,
    technologies,
    heroImage,
    iconName,
    "iconCustom": coalesce(iconCustom, icon)
  }
`;

export const serviceBySlugQuery = `
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    slug,
    tagline,
    excerpt,
    iconName,
    "iconCustom": coalesce(iconCustom, icon),
    heroImage,
    contentHeading,
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          reference->{
            _type,
            title,
            slug
          }
        }
      }
    },
    processHeading,
    process,
    techHeading,
    technologies,
    faqHeading,
    faqs,
    workHeading,
    relatedWork[]->{
      _id,
      title,
      slug,
      client,
      thumbnailImage,
      excerpt
    },
    seoTitle,
    seoDescription,
    order
  }
`;

export const featuredServicesQuery = `
  *[_type == "service"] | order(order asc)[0...4] {
    _id,
    title,
    slug,
    tagline,
    iconName,
    "iconCustom": coalesce(iconCustom, icon)
  }
`;

// ============================================
// Industries
// ============================================
export const allIndustriesQuery = `
  *[_type == "industry"] | order(order asc) {
    _id,
    title,
    slug,
    tagline,
    excerpt,
    iconName,
    "iconCustom": coalesce(iconCustom, icon)
  }
`;

export const industryBySlugQuery = `
  *[_type == "industry" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tagline,
    excerpt,
    iconName,
    "iconCustom": coalesce(iconCustom, icon),
    heroImage,
    challengesHeading,
    challengeQuote,
    challenges,
    solutionsHeading,
    solutionStatement,
    solutions,
    servicesHeading,
    workHeading,
    relatedWork[]->{
      _id,
      title,
      slug,
      client,
      thumbnailImage,
      excerpt
    },
    relatedServices[]->{
      _id,
      title,
      slug,
      tagline,
      "iconCustom": coalesce(iconCustom, icon),
      heroImage
    },
    seoTitle,
    seoDescription,
    order
  }
`;

// ============================================
// Case Studies
// ============================================
export const allCaseStudiesQuery = `
  *[_type == "caseStudy"] | order(coalesce(order, 999) asc, _createdAt desc) {
    _id,
    title,
    slug,
    client,
    year,
    excerpt,
    cardSize,
    thumbnailImage,
    industries[]->{
      _id,
      title,
      slug
    },
    services[]->{
      _id,
      title,
      slug
    },
    featured
  }
`;

export const featuredCaseStudiesQuery = `
  *[_type == "caseStudy" && featured == true] | order(_createdAt desc)[0...4] {
    _id,
    title,
    slug,
    client,
    thumbnailImage,
    industries[]->{
      _id,
      title,
      slug
    }
  }
`;

export const caseStudyBySlugQuery = `
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    client,
    year,
    excerpt,
    thumbnailImage,
    heroImage,
    industries[]->{
      _id,
      title,
      slug
    },
    services[]->{
      _id,
      title,
      slug
    },
    challenge[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          reference->{
            _type,
            title,
            slug
          }
        }
      }
    },
    approach[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          reference->{
            _type,
            title,
            slug
          }
        }
      }
    },
    resultsSummary,
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          reference->{
            _type,
            title,
            slug
          }
        }
      }
    },
    results,
    testimonial->{
      _id,
      quote,
      authorName,
      authorRole,
      company,
      companyLogo,
      authorPhoto
    },
    seoTitle,
    seoDescription,
    order,
    "nextProject": *[_type == "caseStudy" && slug.current != $slug] | order(coalesce(order, 999) asc, _createdAt desc)[0] {
      _id,
      title,
      slug,
      client,
      thumbnailImage
    }
  }
`;

// ============================================
// Blog Posts
// ============================================
export const allBlogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    readTime,
    category->{
      _id,
      title,
      slug
    },
    author->{
      _id,
      name,
      photo
    }
  }
`;

export const featuredBlogPostsQuery = `
  *[_type == "blogPost" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    readTime,
    category->{
      _id,
      title,
      slug
    }
  }
`;

export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    readTime,
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          reference->{
            _type,
            title,
            slug
          }
        }
      }
    },
    category->{
      _id,
      title,
      slug
    },
    author->{
      _id,
      name,
      role,
      photo,
      bio,
      linkedin,
      twitter
    },
    tags,
    seoTitle,
    seoDescription,
    "relatedPosts": *[_type == "blogPost" && slug.current != $slug && (
      category._ref == ^.category._ref ||
      count(tags[@in ^.^.tags]) > 0
    )] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      featuredImage,
      publishedAt,
      readTime
    }
  }
`;

export const blogPostsByCategoryQuery = `
  *[_type == "blogPost" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    readTime,
    category->{
      _id,
      title,
      slug
    }
  }
`;

// ============================================
// Blog Categories
// ============================================
export const allBlogCategoriesQuery = `
  *[_type == "blogCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }
`;

// ============================================
// Testimonials
// ============================================
export const allTestimonialsQuery = `
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    quote,
    "clientName": authorName,
    "clientRole": authorRole,
    "clientCompany": company,
    "clientPhoto": authorPhoto
  }
`;

export const featuredTestimonialsQuery = `
  *[_type == "testimonial" && featured == true] | order(_createdAt desc)[0...4] {
    _id,
    quote,
    "clientName": authorName,
    "clientRole": authorRole,
    "clientCompany": company,
    "clientPhoto": authorPhoto
  }
`;

// ============================================
// Team Members
// ============================================
export const allTeamMembersQuery = `
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    photo,
    bio,
    socialLinks
  }
`;

export const leadershipTeamQuery = `
  *[_type == "teamMember" && leadership == true] | order(order asc) {
    _id,
    name,
    role,
    photo,
    bio,
    socialLinks
  }
`;

// ============================================
// Job Listings
// ============================================
export const activeJobListingsQuery = `
  *[_type == "jobListing" && active == true] | order(_createdAt desc) {
    _id,
    title,
    slug,
    department,
    location,
    employmentType,
    experienceLevel,
    tagline
  }
`;

export const jobListingBySlugQuery = `
  *[_type == "jobListing" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    department,
    location,
    employmentType,
    experienceLevel,
    tagline,
    fullDescription,
    responsibilities,
    requirements,
    benefits,
    salaryRange,
    applicationUrl,
    seo
  }
`;
