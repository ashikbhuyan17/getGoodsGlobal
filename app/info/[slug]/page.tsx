import { decodeSlug } from "@/lib/decodeSlug";
import { fetcher } from "@/lib/fetcher";
import { notFound } from "next/navigation";

async function InfoPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pages: any = await fetcher("/pages");

  const page = pages?.data?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => decodeSlug(p?.slug) === decodeSlug(slug)
  );

  if (!page) notFound();

  return (
    <div className="min-h-screen bg-background px-2">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-balance">
            {page?.title}
          </h1>

          <div
            className="content-html"
            dangerouslySetInnerHTML={{ __html: page?.description }}
          />
        </article>
      </main>
    </div>
  );
}

export default InfoPage;
