import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const imagesDir = path.join(process.cwd(), 'public/images');
  const files = fs.readdirSync(imagesDir);
  return files
    .filter((file: string) => file.endsWith('.png'))
    .map((file: string) => {
      const title = file.replace('.png', '');
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { slug };
    });
}

function getPoemTitles() {
  const imagesDir = path.join(process.cwd(), 'public/images');
  const files = fs.readdirSync(imagesDir);
  return files
    .filter(file => file.endsWith('.png'))
    .map(file => {
      const title = file.replace('.png', '');
      // Generate slug by first converting to lowercase, then replacing non-alphanumeric chars
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { title, slug };
    });
}

export default function Home() {
  const poems = getPoemTitles();

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-center mb-12 text-gray-800">Poetry Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem) => (
            <Link 
              href={`/poem/${poem.slug}`}
              key={poem.slug}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            >
              <h2 className="text-xl font-serif text-gray-800 hover:text-gray-600 transition-colors duration-200">
                {poem.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
