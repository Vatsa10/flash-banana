'use server';
/**
 * @fileOverview A flow that generates a social media post from ad content.
 *
 * - generateSocialMediaPost - A function that handles the post generation process.
 * - GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - GenerateSocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  headline: z.string().describe('The headline of the advertisement.'),
  adCopy: z.string().describe('The body copy of the advertisement.'),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  post: z.string().describe('The generated social media post content, suitable for platforms like Instagram or X.'),
  hashtags: z.string().describe('A string of relevant hashtags, separated by spaces (e.g., #product #sale #new).'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const socialMediaPostPrompt = ai.definePrompt({
    name: 'socialMediaPostPrompt',
    input: {schema: GenerateSocialMediaPostInputSchema},
    output: {schema: GenerateSocialMediaPostOutputSchema},
    prompt: `You are a social media marketing expert.

    Based on the following ad headline and copy, write a short, engaging social media post for a platform like Instagram or X. Also, provide a list of 5-7 relevant hashtags.

    Headline: {{{headline}}}
    Ad Copy: {{{adCopy}}}
    `
});


const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const { output } = await socialMediaPostPrompt(input);
    if (!output) {
        throw new Error("Failed to generate social media post.");
    }
    return output;
  }
);
