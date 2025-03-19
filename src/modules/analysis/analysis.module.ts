import { Module } from '@nestjs/common';

import { AnalysisService } from './analysis.service';

@Module({
  imports: [],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
