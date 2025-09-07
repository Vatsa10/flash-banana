
'use server';
/**
 * @fileOverview A flow that generates a complete advertisement from a product image.
 *
 * - generateAd - A function that handles the ad generation process.
 * - GenerateAdInput - The input type for the generateAd function.
 * - GenerateAdOutput - The return type for the generateAd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The product image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  adText: z.string().optional().describe('Optional user-provided text to include in the ad image.'),
});
export type GenerateAdInput = z.infer<typeof GenerateAdInputSchema>;

const GenerateAdOutputSchema = z.object({
  headline: z.string().describe('A catchy, short headline for the advertisement.'),
  adCopy: z.string().describe('A paragraph of persuasive ad copy for the product.'),
  editedBase64Image: z
    .string()
    .describe(
      'The edited base64 encoded image with a professional, contextually relevant background. Format: data:<mimetype>;base64,<encoded_data>'
    ),
});
export type GenerateAdOutput = z.infer<typeof GenerateAdOutputSchema>;

export async function generateAd(input: GenerateAdInput): Promise<GenerateAdOutput> {
  return generateAdFlow(input);
}

const adGenerationPrompt = ai.definePrompt({
    name: 'adGenerationPrompt',
    input: {schema: z.object({
        imageDataUri: GenerateAdInputSchema.shape.imageDataUri,
    })},
    output: {schema: z.object({
        headline: GenerateAdOutputSchema.shape.headline,
        adCopy: GenerateAdOutputSchema.shape.adCopy,
        backgroundInstruction: z.string().describe("A concise instruction for an image model to create a new background for the product."),
    })},
    prompt: `You are a world-class advertising creative director.
    
    Analyze the product in the following image. Based on the product, generate:
    1. A catchy, short headline.
    2. A paragraph of persuasive ad copy.
    3. A concise instruction for an AI image model to generate a new, professional, and contextually relevant background for the product. For example, if it's a sneaker, suggest 'a clean, minimalist urban background with a soft shadow'.
    
    Image: {{media url=imageDataUri}}`
});


const generateAdFlow = ai.defineFlow(
  {
    name: 'generateAdFlow',
    inputSchema: GenerateAdInputSchema,
    outputSchema: GenerateAdOutputSchema,
  },
  async input => {
    // Step 1: Generate ad copy and a background instruction.
    const { output: adIdeas } = await adGenerationPrompt({ imageDataUri: input.imageDataUri });
    if (!adIdeas) {
        throw new Error("Failed to generate ad ideas.");
    }
    
    const { headline, adCopy, backgroundInstruction } = adIdeas;

    // Step 2: Construct the image generation prompt, including custom text if provided.
    let imageGenPrompt = `Place the main subject in ${backgroundInstruction}. Do not change the subject itself.`;
    if (input.adText) {
        imageGenPrompt += ` Then, tastefully overlay the following text onto the image: "${input.adText}"`;
    }

    // Step 3: Generate the new image.
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.imageDataUri}},
        {text: imageGenPrompt},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('No image was generated for the ad.');
    }

    return {
        headline,
        adCopy,
        editedBase64Image: media.url,
    };
  }
);