import { ImageEditor } from '@/components/image-editor';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative">
      <Navbar />
      <div className="flex-grow pt-20">
        <ImageEditor />
      </div>
    </main>
  );
}
