'use server';
/**
 * @fileOverview Parses natural language image edit requests into structured instructions.
 *
 * - parseImageEditRequest - A function that takes a natural language request and returns structured instructions.
 * - ParseImageEditRequestInput - The input type for the parseImageEditRequest function.
 * - ParseImageEditRequestOutput - The return type for the parseImageEditRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseImageEditRequestInputSchema = z.object({
  request: z.string().describe('The natural language request describing the desired image edits.'),
  imageDescription: z.string().optional().describe('A description of the image being edited, if available.'),
});
export type ParseImageEditRequestInput = z.infer<typeof ParseImageEditRequestInputSchema>;

const ParseImageEditRequestOutputSchema = z.object({
  instructions: z.string().describe('Structured instructions for editing the image, based on the natural language request.'),
});
export type ParseImageEditRequestOutput = z.infer<typeof ParseImageEditRequestOutputSchema>;

export async function parseImageEditRequest(input: ParseImageEditRequestInput): Promise<ParseImageEditRequestOutput> {
  return parseImageEditRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseImageEditRequestPrompt',
  input: {schema: ParseImageEditRequestInputSchema},
  output: {schema: ParseImageEditRequestOutputSchema},
  prompt: `You are an AI assistant that parses natural language image editing requests and converts them into structured instructions.

  The structured instructions should be concise and specific, suitable for an AI image editing tool to understand.

  {% if imageDescription %}Use the following description of the image to better understand the request: {{{imageDescription}}}{% endif %}

  Request: {{{request}}}
  Instructions:`,
});

const parseImageEditRequestFlow = ai.defineFlow(
  {
    name: 'parseImageEditRequestFlow',
    inputSchema: ParseImageEditRequestInputSchema,
    outputSchema: ParseImageEditRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
