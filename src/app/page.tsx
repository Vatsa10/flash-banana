import { ImageEditor } from '@/components/image-editor';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-grow">
        <ImageEditor />
      </div>
      <footer className="py-4">
        <div className="relative flex overflow-x-hidden text-sm text-muted-foreground">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
          </div>

          <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
            <span className="mx-4">Made by Vatsa Joshi</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
