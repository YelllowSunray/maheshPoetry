import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Generate static routes from filenames in public/images
export async function generateStaticParams() {
  const imagesDir = path.join(process.cwd(), 'public/images');
  const files = fs.readdirSync(imagesDir);
  return files
    .filter(file => file.endsWith('.png'))
    .map(file => {
      const title = file.replace('.png', '');
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { slug };
    });
}

// Get the actual title from a slug
async function getPoemTitle(slug: string): Promise<string | null> {
  const imagesDir = path.join(process.cwd(), 'public/images');
  const files = fs.readdirSync(imagesDir);
  const file = files.find(f => {
    const title = f.replace('.png', '');
    const fileSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return fileSlug === slug;
  });
  return file ? file.replace('.png', '') : null;
}

// Set dynamic page metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const title = await getPoemTitle(params.slug);
  return {
    title: title || 'Poem Not Found',
  };
}

// Page component
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page({ params }: Props) {
  const title = getPoemTitle(params.slug);
  
  if (!title) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-block mb-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          ← Back to Poems
        </Link>
        
        <div className="relative w-full aspect-[3/4] max-w-2xl mx-auto">
          <Image
            src={`/images/${title}.png`}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </main>
  );
}
