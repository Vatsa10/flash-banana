
"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Download, Image as ImageIcon, Loader2, Sparkles, Wand2, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { generateEditedImage } from '@/ai/flows/generate-edited-image';
import { parseImageEditRequest } from '@/ai/flows/parse-image-edit-requests';
import { getImageEditSuggestions } from '@/ai/flows/get-image-edit-suggestions';
import { generateAd, GenerateAdOutput } from '@/ai/flows/generate-ad';

// Helper function to read file as data URL
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export function ImageEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [editRequest, setEditRequest] = useState<string>('');
  const [adText, setAdText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [adContent, setAdContent] = useState<Omit<GenerateAdOutput, 'editedBase64Image'> | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await toBase64(file);
        setOriginalImage(base64);
        setEditedImage(null);
        setSuggestions([]);
        setEditRequest('');
        setAdContent(null);
        setAdText('');
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload image. Please try another file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSuggestEdits = async () => {
    if (!originalImage) {
      toast({
        title: 'No Image',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const { suggestions } = await getImageEditSuggestions({ imageDataUri: originalImage });
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast({
        title: 'Suggestion Failed',
        description: 'Could not generate suggestions for the image.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerateEdit = async () => {
    if (!originalImage) {
      toast({ title: 'No Image', description: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    if (!editRequest.trim()) {
      toast({ title: 'No Request', description: 'Please enter what you want to change.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setEditedImage(null);
    setAdContent(null);

    try {
      const { instructions } = await parseImageEditRequest({ request: editRequest });
      const { editedBase64Image } = await generateEditedImage({
        base64Image: originalImage,
        editInstruction: instructions,
      });
      setEditedImage(editedBase64Image);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({ title: 'Generation Failed', description: 'Could not generate the edited image. Please try a different request.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateAd = async () => {
    if (!originalImage) {
      toast({ title: 'No Image', description: 'Please upload an image first.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setEditedImage(null);
    setAdContent(null);

    try {
      const { editedBase64Image, headline, adCopy } = await generateAd({
        imageDataUri: originalImage,
        adText: adText,
      });
      setEditedImage(editedBase64Image);
      setAdContent({ headline, adCopy });
    } catch (error) {
      console.error('Error generating ad:', error);
      toast({ title: 'Ad Generation Failed', description: 'Could not generate the ad. Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'flash-banana-edit.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const isLoading = isGenerating || isSuggesting;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 xl:col-span-3">
          <Card className="sticky top-8 shadow-lg rounded-xl border-border/60 bg-card/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Flash-Banana</CardTitle>
              <CardDescription className="font-body pt-2 text-base">
                AI-powered creative workflows for your images.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
              <Button onClick={triggerFileUpload} variant="outline" className="w-full">
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Image
              </Button>

              <Separator />

              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Creative Editor</TabsTrigger>
                  <TabsTrigger value="ad">Ad Generator</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-headline text-sm font-medium">Get Suggestions</label>
                      <Button onClick={handleSuggestEdits} disabled={isLoading || !originalImage} variant="outline" className="w-full">
                        {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Suggest Edits
                      </Button>
                    </div>

                    {suggestions.length > 0 && (
                      <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left h-auto whitespace-normal"
                            onClick={() => setEditRequest(suggestion)}
                          >
                            {`${index + 1}. ${suggestion}`}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label htmlFor="editRequest" className="font-headline text-sm font-medium">
                      Your Edit Request
                    </label>
                    <Textarea
                      id="editRequest"
                      value={editRequest}
                      onChange={(e) => setEditRequest(e.target.value)}
                      placeholder="e.g., 'Make the sky dramatic and add a rainbow'"
                      rows={4}
                      className="font-body text-base bg-transparent"
                    />
                  </div>
                  <Button onClick={handleGenerateEdit} disabled={isLoading || !originalImage} className="w-full font-headline text-lg py-6">
                    {isGenerating && !adContent ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                    Generate
                  </Button>
                </TabsContent>
                <TabsContent value="ad" className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <label htmlFor="adText" className="font-headline text-sm font-medium">
                        Custom Ad Text (Optional)
                        </label>
                        <Textarea
                        id="adText"
                        value={adText}
                        onChange={(e) => setAdText(e.target.value)}
                        placeholder="e.g., 'Summer Sale: 50% Off!'"
                        rows={2}
                        className="font-body text-base bg-transparent"
                        />
                    </div>
                     <Button onClick={handleGenerateAd} disabled={isLoading || !originalImage} className="w-full font-headline text-lg py-6">
                        {isGenerating && adContent !== null ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Megaphone className="mr-2 h-5 w-5" />}
                        Generate Ad
                    </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-8 xl:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImageContainer title="Original" imageSrc={originalImage} />
            <div className="space-y-4">
              <ImageContainer
                title="Edited"
                imageSrc={editedImage}
                isLoading={isGenerating}
                actionButton={
                  editedImage && (
                    <Button onClick={handleDownload} variant="outline" size="sm" className="absolute top-4 right-4 bg-background/80 hover:bg-background shadow-md">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )
                }
              />
              {adContent && !isGenerating && (
                <Card className="shadow-lg rounded-xl border-border/60 bg-card/80 backdrop-blur-xl animate-in fade-in">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{adContent.headline}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-base">{adContent.adCopy}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface ImageContainerProps {
  title: string;
  imageSrc: string | null;
  isLoading?: boolean;
  actionButton?: React.ReactNode;
}

function ImageContainer({ title, imageSrc, isLoading = false, actionButton }: ImageContainerProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-center font-headline text-xl font-semibold text-muted-foreground">{title}</h2>
      <Card className="aspect-square w-full rounded-xl shadow-md overflow-hidden relative transition-all duration-300 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-center h-full bg-transparent">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-primary transition-opacity duration-300 animate-in fade-in">
              <Loader2 className="h-12 w-12 animate-spin" />
              <p className="font-body">Enhancing your image...</p>
            </div>
          ) : imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-opacity duration-500 animate-in fade-in"
              data-ai-hint={title.toLowerCase()}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <ImageIcon className="h-16 w-16" />
              <p className="font-body text-center p-4">Upload an image to get started</p>
            </div>
          )}
          {actionButton}
        </div>
      </Card>
    </div>
  );
}

    
