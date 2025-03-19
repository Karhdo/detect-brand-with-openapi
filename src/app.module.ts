import { Module } from '@nestjs/common';

import { ConfigModule } from 'configure/app/config.module';
import { DetectsModule } from 'modules/detects/detects.module';

@Module({
  imports: [ConfigModule, DetectsModule],
})
export class AppModule {}
