import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as fs from 'fs';
import OpenAI from 'openai';

import { OpenAIConfig } from 'configure/app/schemas';
import { MOCK_BRAND_RESPONSE } from './analysis.constant';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const openaiConfig = this.configService.get('openai') as OpenAIConfig;

    this.openai = new OpenAI({ apiKey: openaiConfig.apiKey });
  }

  async analyzeImage(imagePath: string): Promise<string> {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo', // OpenAI GPT-4 Turbo with Vision
        messages: [
          {
            role: 'system',
            content: 'You are an AI that detects brand logos in images.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze the image to identify all brands that appear in the picture. Extract and return only the brand names, separated by commas if multiple brands are detected.',
              },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
            ],
          },
        ],
        max_tokens: 100,
      });

      const brandDetected = response.choices[0].message.content?.trim();

      return brandDetected || 'No brands detected';
    } catch (error) {
      const errMsg = (error as Error).message || 'Unknown error';

      this.logger.error(`Error analyzing image: ${errMsg}`);

      throw error;
    }
  }

  async mockAnalyzeImage(_imagePath: string): Promise<string> {
    const randomIndex = Math.floor(Math.random() * MOCK_BRAND_RESPONSE.length);

    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_BRAND_RESPONSE[randomIndex]), 1000);
    });
  }
}
