import { ApiProperty } from '@nestjs/swagger';

export class BrandExposure {
  @ApiProperty({ description: 'The name of the detected brand' })
  readonly brandDetected: string;

  @ApiProperty({ description: 'The duration of exposure in seconds' })
  readonly exposureSeconds: number;
}

export class DetectVideoResponseDto {
  @ApiProperty({ description: 'Response message' })
  readonly message: string;

  @ApiProperty({ description: 'Processed video file name' })
  readonly fileName: string;

  @ApiProperty({
    description: 'List of detected brands with their exposure times',
    type: [BrandExposure],
  })
  readonly brandDetected: Array<BrandExposure>;
}
