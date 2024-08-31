import axios from 'axios';
import { TemporaryImage } from '../models/temporaryImage.model';

const apiKey = process.env.GEMINI_API_KEY;

export const analyzeImage = async (base64: string) => {
  try {
    const response = await axios.post(
      'https://api.gemini.google.com/v1/vision:annotateImage',
      {
        requests: [
          {
            image: {
              content: base64,
            },
            features: [
              {
                type: 'DOCUMENT_TEXT_DETECTION',
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Erro na chamada à API do Gemini:', error);
  }
};

export const valueConsumption = async (geminiResponse: any) => {
  try {
    const textAnnotations = geminiResponse.responses[0].textAnnotations;
    if (!textAnnotations) {
      console.log('Nenhuma anotacao de texto encontrada na resposta do gemini');
    }

    const fullText = textAnnotations[0].description;
    console.log('Texto completo:', fullText);

    const consumoRegex = /(?:Consumo\s*:\s*|\b)(\d+(?:,\d+)?)(?=\s*(?:m³|m3))/i;

    const match = fullText.match(consumoRegex);

    if (match && match[1]) {
      return match[1].replace(',', '.');
    } else {
      const prompt = `Ignorando quaisquer textos que não sejam números, qual o consumo total em m³ no seguinte texto? ${fullText}`;
      const geminiExtractionResponse = await axios.post(
        'https://api.gemini.google.com/v1/completions',
        {
          prompt: {
            text: prompt,
          },
          model: 'gemini-pro',
          temperature: 0.0,
          maxOutputTokens: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
      return geminiExtractionResponse.data.choices[0].text.trim();
    }
  } catch (error) {
    console.error('Erro ao extrair o valor da resposta do Gemini:', error);
  }
};

export const generateTemporaryLink = async (base64Image: string) => {
  const newImage = await TemporaryImage.create({
    imageData: base64Image,
  });

  return `/api/upload/${newImage._id}`;
};
