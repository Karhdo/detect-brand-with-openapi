import { IsString } from 'class-validator';

export class OpenAIConfig {
  @IsString()
  public readonly apiKey: string = 'your-openai-api-key';
}
