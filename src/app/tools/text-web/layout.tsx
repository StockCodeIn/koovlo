import type { Metadata } from "next";
import ToolsNav from "@/components/ToolsNav";

export const metadata: Metadata = {
  title: "Text and Web Tools - Koovlo",
  description:
    "A collection of free online text and web tools including word counter, case converter, text to speech, JSON formatter, and more.",
  keywords: [
    " text tools", "web tools", "word counter", "case converter", "text to speech", "JSON formatter", "online utilities"
  ],
  openGraph: {
    title: "Text and Web Tools - Koovlo",
    description:
        "A collection of free online text and web tools including word counter, case converter, text to speech, JSON formatter, and more.",
    url: "https://www.koovlo.com/tools/text-web",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function textWebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <ToolsNav />
    <section >
      <div>{children}</div>
    </section>
    </>
  );
}
