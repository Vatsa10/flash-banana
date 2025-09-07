# Flash-Banana: AI-Powered Creative Suite

Flash-Banana is an advanced web application built with Next.js that harnesses Google's Gemini and Genkit to deliver a powerful AI-driven creative workflow. This comprehensive solution streamlines the process of image editing and advertisement creation through natural language processing.

Developed with a focus on innovation, this project showcases the potential of generative AI in creative workflows.

![Flash-Banana Screenshot](https://i.imgur.com/your-screenshot.png) <!-- Replace with an actual screenshot of your application -->

## Key Features

- **Natural Language Image Editing**: Transform images using simple text descriptions, eliminating the need for complex editing tools. For example, you can request changes like "Enhance the sunset colors" or "Remove the background."

- **Intelligent Edit Recommendations**: Receive personalized editing suggestions based on your uploaded images, helping you discover creative possibilities.

- **Automated Advertisement Creation**: Generate complete marketing assets by simply uploading a product photo. The system produces:
    - Contextually relevant background designs
    - Attention-grabbing headlines
    - Compelling marketing copy

- **Customizable Marketing Content**: Seamlessly integrate your brand elements, promotional codes, or custom text into the generated advertisements.

- **Social Media Integration**: Convert your advertisements into optimized social media posts complete with relevant hashtags and platform-specific formatting.

- **Responsive Design**: A clean, intuitive interface built with ShadCN UI and Tailwind CSS that delivers a consistent experience across all devices.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Google Gemini](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Ready for [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

To run this project locally, follow these steps:

### 1. Prerequisites

- Node.js (v18 or later recommended)
- `npm` or `yarn`

### 2. Setup API Key

This project uses the Google Gemini API. You will need to obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

1. Create a file named `.env` in the root of the project.
2. Add your API key to this file:

   ```
   GEMINI_API_KEY=your_google_ai_studio_api_key
   ```

### 3. Installation

Install the project dependencies:

```bash
npm install
```

### 4. Running the Development Server

This project requires two processes to run concurrently: the Next.js frontend and the Genkit AI flows.

1.  **Start the Next.js app:**
    ```bash
    npm run dev
    ```
    This will start the frontend on `http://localhost:9002`.

2.  **Start the Genkit flows (in a separate terminal):**
    For development, you can use the watch command to automatically restart the flows when you make changes.
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit development server, allowing your Next.js app to communicate with the AI models.

Now, open `http://localhost:9002` in your browser to see the application in action!

## AI Workflows

The application's AI functionality is implemented through a series of specialized workflows located in the `src/ai/flows` directory:

- `generate-edited-image.ts`: Processes images based on natural language instructions to create customized edits.
- `get-image-edit-suggestions.ts`: Provides intelligent recommendations for image enhancements.
- `parse-image-edit-requests.ts`: Translates user input into structured prompts for the AI models.
- `generate-ad.ts`: Orchestrates the advertisement generation process, including image analysis, content creation, and layout composition.
- `generate-social-media-post.ts`: Optimizes content for social media platforms with appropriate formatting and hashtags.