import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import * as fs from 'fs';

import { ConfigService } from '@nestjs/config';
import { MinioConfig } from 'configure/app/schemas';
import { console } from 'inspector';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Client;
  private readonly minioConfig: MinioConfig;

  constructor(private readonly configService: ConfigService) {
    this.minioConfig = this.configService.get('minio') as MinioConfig;

    console.log(this.minioConfig);

    const { endPoint, port, useSSL, accessKey, secretKey } = this.minioConfig;

    this.minioClient = new Client({ endPoint, port, useSSL, accessKey, secretKey });
  }

  private async ensureBucket(bucket: string): Promise<void> {
    const exists = await this.minioClient.bucketExists(bucket).catch(() => false);

    if (!exists) {
      await this.minioClient.makeBucket(bucket, 'us-east-1');

      this.logger.log(`Created bucket: ${bucket}`);
    }
  }

  async uploadFile(bucket: string, filePath: string, fileName: string, directory?: string): Promise<void> {
    await this.ensureBucket(bucket);

    const fileStream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    const objectPath = `${directory}/${fileName}`;

    await this.minioClient.putObject(bucket, objectPath, fileStream, stat.size, {
      'Content-Type': 'application/octet-stream',
    });
    this.logger.log(`File uploaded to MinIO: bucket=${bucket}, fileName=${fileName}`);

    // Optionally delete local file after upload
    if (this.minioConfig.deleteLocalFile) {
      fs.unlinkSync(filePath);
    }
  }
}
