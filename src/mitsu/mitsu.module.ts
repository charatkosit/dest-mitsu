import { Module } from '@nestjs/common';
import { MitsuService } from './mitsu.service';
import { MitsuController } from './mitsu.controller';
import { UdpService } from './udp.service';


@Module({
  controllers: [MitsuController],
  providers: [MitsuService, UdpService],
})
export class MitsuModule {}
