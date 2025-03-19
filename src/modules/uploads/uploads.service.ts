import { Injectable } from '@nestjs/common';

import * as path from 'path';

import { MinioService } from 'configure/minio/minio.service';

@Injectable()
export class UploadsService {
  constructor(private readonly minioService: MinioService) {}

  async uploadFileToMinIO(filePath: string, bucket: string) {
    try {
      const fileName = path.basename(filePath);

      await this.minioService.uploadFile(bucket, filePath, fileName, 'public');

      return fileName;
    } catch (error) {
      const errMsg = (error as Error).message || 'Unknown error';

      throw new Error(`Failed to upload file to MinIO: ${errMsg}`);
    }
  }
}
