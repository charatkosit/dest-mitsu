import { Module } from '@nestjs/common';
import { OfficersService } from './officers.service';
import { OfficersController } from './officers.controller';
import { Officer } from './entities/officer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Officer])],
  controllers: [OfficersController],
  providers: [OfficersService],
})
export class OfficersModule {}
