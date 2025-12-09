import 'dotenv/config';
import { VertexAI } from '@google-cloud/vertexai';

async function main() {
  console.log('--- Vertex AI Local Test ---');
  console.log('Using model:', process.env.VERTEX_MODEL);
  console.log('Project:', process.env.VERTEX_PROJECT);
  console.log('Location:', process.env.VERTEX_LOCATION);
  console.log('Credentials:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

  const vertex = new VertexAI({
    project: process.env.VERTEX_PROJECT,
    location: process.env.VERTEX_LOCATION,
  });

  const model = vertex.getGenerativeModel({
    model: process.env.VERTEX_MODEL,
  });

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: "Say 'Vertex AI test OK' if you can respond." }],
        },
      ],
    });

    console.log('\n--- RESPONSE ---');
    console.log(JSON.stringify(result.response?.candidates?.[0]?.content, null, 2));
    console.log('\nTest succeeded ✔');
  } catch (err) {
    console.error('\n--- ERROR ---');
    console.error(err);
    console.log('\nTest failed ✖');
  }
}

main();
