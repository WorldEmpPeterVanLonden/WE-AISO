import { genkit } from 'genkit';
import { googleAI, vertexAI } from '@genkit-ai/google-genai';

// Standaardlocatie voor Vertex AI (waar je modellen hebt ingeschakeld)
const DEFAULT_VERTEX_LOCATION = 'us-central1';

// Vlag om te bepalen welke provider geladen moet worden
const useVertex = process.env.USE_VERTEX_AI === 'true';

// Zorg ervoor dat de projectId bestaat in PROD-modus, anders werpen we een fout
// (Hoewel Genkit de fout zelf ook opvangt, is dit robuuster)
if (useVertex && !process.env.VERTEX_PROJECT) {
  throw new Error('FATAL: VERTEX_PROJECT must be set when USE_VERTEX_AI is true.');
}

export const ai = genkit({
  plugins: [
    useVertex
      ? vertexAI({
          // Project ID is verplicht voor Vertex AI
          projectId: process.env.VERTEX_PROJECT!,
          
          // Gebruik de ingestelde locatie, val terug op de standaardlocatie als deze ontbreekt.
          location: process.env.VERTEX_LOCATION ?? DEFAULT_VERTEX_LOCATION,
        })
      : googleAI({ 
          // API Key is verplicht voor Google AI
          apiKey: process.env.GOOGLE_API_KEY!, 
          
          // De 'location' is weggelaten omdat deze optioneel is voor googleAI en linting veroorzaakt.
        })
  ],
});