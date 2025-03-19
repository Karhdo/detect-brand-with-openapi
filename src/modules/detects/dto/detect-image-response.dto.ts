import { ApiProperty } from '@nestjs/swagger';

export class DetectImageResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  brandDetected: string;
}
