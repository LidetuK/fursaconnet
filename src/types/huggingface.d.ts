
declare module '@huggingface/inference' {
  export class HfInference {
    constructor(accessToken?: string);
    
    textGeneration(params: {
      model: string;
      inputs: string;
      parameters?: any;
    }): Promise<{
      generated_text: string;
    }>;
    
    chatCompletion(params: {
      model: string;
      messages: Array<{
        role: string;
        content: string;
      }>;
      max_tokens?: number;
      temperature?: number;
      top_p?: number;
      repetition_penalty?: number;
    }): Promise<{
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    }>;
  }

  // For backward compatibility with old code
  export class InferenceClient extends HfInference {}
}
