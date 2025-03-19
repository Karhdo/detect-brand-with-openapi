import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Post, Controller, UploadedFile, UseInterceptors } from '@nestjs/common';

import { Express } from 'express';

import { multerConfig } from 'configure/multer/multer.config';

import { DetectsService } from './detects.service';

import { DetectImageDto, DetectImageResponseDto, DetectVideoDto, DetectVideoResponseDto } from './dto';

@Controller('detects')
export class DetectsController {
  constructor(private readonly detectsService: DetectsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', multerConfig('./uploads/images')))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: DetectImageDto })
  @ApiResponse({ status: 200, type: DetectImageResponseDto })
  async detectImage(@UploadedFile() file: Express.Multer.File): Promise<DetectImageResponseDto> {
    return await this.detectsService.detectImage(file);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file', multerConfig('./uploads/videos')))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: DetectVideoDto })
  @ApiResponse({ status: 200, type: DetectVideoResponseDto })
  async detectVideo(@UploadedFile() file: Express.Multer.File): Promise<DetectVideoResponseDto> {
    return await this.detectsService.detectVideo(file);
  }
}
