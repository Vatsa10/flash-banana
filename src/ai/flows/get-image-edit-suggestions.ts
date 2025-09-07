'use server';
/**
 * @fileOverview Image edit suggestions flow.
 *
 * - getImageEditSuggestions - A function that suggests edits for an image.
 * - GetImageEditSuggestionsInput - The input type for the getImageEditSuggestions function.
 * - GetImageEditSuggestionsOutput - The return type for the getImageEditSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetImageEditSuggestionsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to edit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GetImageEditSuggestionsInput = z.infer<typeof GetImageEditSuggestionsInputSchema>;

const GetImageEditSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested edits for the image.'),
});
export type GetImageEditSuggestionsOutput = z.infer<typeof GetImageEditSuggestionsOutputSchema>;

export async function getImageEditSuggestions(
  input: GetImageEditSuggestionsInput
): Promise<GetImageEditSuggestionsOutput> {
  return getImageEditSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getImageEditSuggestionsPrompt',
  input: {schema: GetImageEditSuggestionsInputSchema},
  output: {schema: GetImageEditSuggestionsOutputSchema},
  prompt: `You are an expert image editor. Given the following image, suggest 5 possible edits to the image.

Image: {{media url=imageDataUri}}

Suggestions:`,
});

const getImageEditSuggestionsFlow = ai.defineFlow(
  {
    name: 'getImageEditSuggestionsFlow',
    inputSchema: GetImageEditSuggestionsInputSchema,
    outputSchema: GetImageEditSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
