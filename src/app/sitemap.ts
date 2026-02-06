import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://koovlo.com'

  // Static pages
  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/terms', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/tools', priority: 0.9, changeFrequency: 'weekly' as const },
  ]

  // PDF Tools
  const pdfTools = [
    '/tools/pdf/merge',
    '/tools/pdf/compress',
    '/tools/pdf/rotate',
    '/tools/pdf/reorder',
    '/tools/pdf/to-image',
    '/tools/pdf/to-pdf',
    '/tools/pdf/watermark',
    '/tools/pdf/unlock',
    '/tools/pdf/to-word',
    '/tools/pdf/page-number',
    '/tools/pdf/grayscale',
    '/tools/pdf/metadata',
    '/tools/pdf/sign',
    '/tools/pdf/crop',
    '/tools/pdf/extract-pages',
    '/tools/pdf/duplicate-pages',
    '/tools/pdf/page-range-split',
    '/tools/pdf/change-page-size',
  ]

  // Image Tools
  const imageTools = [
    '/tools/image/resize',
    '/tools/image/compress',
    '/tools/image/convert',
    '/tools/image/add-watermark',
    '/tools/image/strip-metadata',
  ]

  // Education Tools
  const educationTools = [
    '/tools/education/percentage',
    '/tools/education/cgpa',
    '/tools/education/gpa',
    '/tools/education/grade',
    '/tools/education/attendance',
    '/tools/education/rank',
    '/tools/education/flashcard',
    '/tools/education/quiz-generator',
    '/tools/education/notes-organizer',
    '/tools/education/revision-planner',
  ]

  // Document Tools
  const documentTools = [
    '/tools/document/resume-builder',
    '/tools/document/invoice',
    '/tools/document/pdf-form-builder',
  ]

  // Text/Web Tools
  const textWebTools = [
    '/tools/text-web/word-counter',
    '/tools/text-web/case-converter',
    '/tools/text-web/json-formatter',
    '/tools/text-web/base64',
    '/tools/text-web/url-encode',
    '/tools/text-web/regex-tester',
    '/tools/text-web/lorem-ipsum',
    '/tools/text-web/text-summarizer',
    '/tools/text-web/text-to-speech',
  ]

  // Combine all tools
  const allTools = [
    ...pdfTools,
    ...imageTools,
    ...educationTools,
    ...documentTools,
    ...textWebTools,
  ]

  return [
    // Static pages
    ...staticPages.map(page => ({
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    // Tools
    ...allTools.map(tool => ({
      url: `${baseUrl}${tool}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}