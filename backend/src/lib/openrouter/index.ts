import OpenAI from 'openai';
import { OPENROUTER_API_KEY } from '../../config/env-constants';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY
});

export interface IaskAi {
    model: string;
    prompt: string;
}

export default async function askAi({model, prompt}: IaskAi) {
  try {
    const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  return completion.choices[0].message;
  }catch(error){
    console.log(error);
    return null;
  }
}
