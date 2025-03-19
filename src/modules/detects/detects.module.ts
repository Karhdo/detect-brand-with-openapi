import { Module } from '@nestjs/common';

import { UploadsModule } from 'modules/uploads/uploads.module';
import { AnalysisModule } from 'modules/analysis/analysis.module';

import { DetectsService } from './detects.service';
import { DetectsController } from './detects.controller';

@Module({
  imports: [UploadsModule, AnalysisModule],
  controllers: [DetectsController],
  providers: [DetectsService],
  exports: [DetectsService],
})
export class DetectsModule {}
