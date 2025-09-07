import { config } from 'dotenv';
config();

import '@/ai/flows/parse-image-edit-requests.ts';
import '@/ai/flows/get-image-edit-suggestions.ts';
import '@/ai/flows/generate-edited-image.ts';
import '@/ai/flows/generate-ad.ts';
import '@/ai/flows/generate-social-media-post.ts';