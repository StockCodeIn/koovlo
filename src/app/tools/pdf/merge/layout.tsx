import { Metadata } from "next";
import { generateToolMetadata, getToolSchemaMarkup } from "@/lib/toolMetadata";

export const metadata: Metadata = generateToolMetadata("pdf-merge");

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = getToolSchemaMarkup("pdf-merge");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}

