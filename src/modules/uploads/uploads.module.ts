import { Module } from '@nestjs/common';

import { MinioModule } from 'configure/minio/minio.module';

import { UploadsService } from './uploads.service';

@Module({
  imports: [MinioModule],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
