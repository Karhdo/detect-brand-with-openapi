/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';

import { chunk } from 'lodash';

import { UploadsService } from 'modules/uploads/uploads.service';
import { AnalysisService } from 'modules/analysis/analysis.service';
import { BrandExposure, DetectImageResponseDto, DetectVideoResponseDto } from './dto';
import { BATCH_SIZE_DETECT_BRAND } from './detects.constant';

@Injectable()
export class DetectsService {
  private readonly logger = new Logger(DetectsService.name);

  constructor(
    private readonly uploadsService: UploadsService,
    private readonly analysisService: AnalysisService,
  ) {}

  async detectImage(file: Express.Multer.File): Promise<DetectImageResponseDto> {
    // 1. Check if the file is provided
    if (!file) {
      throw new HttpException('No image file uploaded', HttpStatus.BAD_REQUEST);
    }

    const { path: filePath, filename } = file;

    // 2 & 3. Run upload and analysis in parallel
    const [_, brandDetected] = await Promise.all([
      this.uploadsService.uploadFileToMinIO(filePath, 'detect-brand'),
      this.analysisService.mockAnalyzeImage(filePath),
    ]);

    // 4. Delete the original file
    fs.unlinkSync(filePath);

    return {
      message: 'Image uploaded and analyzed successfully',
      fileName: filename,
      brandDetected,
    };
  }

  async detectVideo(file: Express.Multer.File): Promise<DetectVideoResponseDto> {
    // 1. Check if the file is provided
    if (!file) {
      throw new HttpException('No video file uploaded', HttpStatus.BAD_REQUEST);
    }

    const { path: filePath, filename } = file;

    const framesDir = path.join('./uploads/frames', filename);

    // 2. Run upload and extract in parallel
    const [_, framePaths] = await Promise.all([
      this.uploadsService.uploadFileToMinIO(filePath, 'detect-brand'),
      this.extractFramesFromVideo(filePath, framesDir),
    ]);

    // 3. Calculate brand exposure
    const brandExposures = await this.detectBrandExposureTime(framePaths);

    // 4. Cleanup
    fs.unlinkSync(filePath);
    fs.rmSync(framesDir, { recursive: true, force: true });

    return {
      message: 'Video uploaded, frames analyzed successfully',
      fileName: filename,
      brandDetected: brandExposures,
    };
  }

  private async extractFramesFromVideo(videoPath: string, outputDir: string): Promise<string[]> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      // Extract frames from video using FFmpeg
      await this.runFfmpeg(videoPath, outputDir);
    } catch (error) {
      this.handleError('Failed to extract frames', error);
    }

    return fs
      .readdirSync(outputDir)
      .filter((file) => file.startsWith('frame-'))
      .map((file) => path.join(outputDir, file));
  }

  private runFfmpeg(videoPath: string, outputDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions(['-vf', 'fps=1/10', '-qscale:v', '2'])
        .output(`${outputDir}/frame-%03d.jpg`)
        .on('start', (cmd) => this.logger.log(`FFmpeg process started: ${cmd}`))
        .on('end', () => {
          this.logger.log('Frame extraction completed.');
          resolve();
        })
        .on('error', (error) => {
          this.logger.error(`FFmpeg error: ${error.message}`);
          reject(new Error(`FFmpeg error: ${error.message}`));
        })
        .run();
    });
  }

  private async detectBrandExposureTime(framePaths: string[]): Promise<BrandExposure[]> {
    let exposureSeconds = 0;
    const frameChunks = chunk(framePaths, BATCH_SIZE_DETECT_BRAND);

    const exposureResults: BrandExposure[] = [];

    for (const frameChunk of frameChunks) {
      const promises = frameChunk.map(async (framePath) => {
        const brandDetected = await this.analysisService.mockAnalyzeImage(framePath);

        const exposure = { exposureSeconds, brandDetected };
        exposureSeconds += 10;

        if (brandDetected === 'No brands detected') {
          return null;
        }

        return exposure;
      });

      const results = await Promise.all(promises);

      const filteredResults = results.filter(Boolean) as BrandExposure[];

      // Add valid (non-null) results to the main array
      exposureResults.push(...filteredResults);
    }

    return exposureResults;
  }

  private handleError(message: string, error: any): never {
    const errMsg = (error as Error).message || 'Unknown error';

    this.logger.error(`${message}: ${errMsg}`);

    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
