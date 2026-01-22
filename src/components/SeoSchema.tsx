// src/components/SeoSchema.tsx
export default function SeoSchema({ name }: { name: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name,
          applicationCategory: "Utility",
          operatingSystem: "All",
        }),
      }}
    />
  );
}
