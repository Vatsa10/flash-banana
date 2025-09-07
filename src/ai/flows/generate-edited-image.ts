'use server';

/**
 * @fileOverview A flow that generates an edited image based on a user's request.
 *
 * - generateEditedImage - A function that handles the image editing process.
 * - GenerateEditedImageInput - The input type for the generateEditedImage function.
 * - GenerateEditedImageOutput - The return type for the generateEditedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEditedImageInputSchema = z.object({
  base64Image: z
    .string()
    .describe(
      "The base64 encoded image to edit. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  editInstruction: z.string().describe('The instruction for editing the image.'),
});
export type GenerateEditedImageInput = z.infer<typeof GenerateEditedImageInputSchema>;

const GenerateEditedImageOutputSchema = z.object({
  editedBase64Image: z
    .string()
    .describe(
      'The edited base64 encoded image with MIME type. Format: data:<mimetype>;base64,<encoded_data>'
    ),
});
export type GenerateEditedImageOutput = z.infer<typeof GenerateEditedImageOutputSchema>;

export async function generateEditedImage(
  input: GenerateEditedImageInput
): Promise<GenerateEditedImageOutput> {
  return generateEditedImageFlow(input);
}

const generateEditedImageFlow = ai.defineFlow(
  {
    name: 'generateEditedImageFlow',
    inputSchema: GenerateEditedImageInputSchema,
    outputSchema: GenerateEditedImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.base64Image}},
        {text: input.editInstruction},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('No image was generated.');
    }

    return {editedBase64Image: media.url!};
  }
);
