import { Module } from '@nestjs/common';
import { AcmService } from './acm.service';
import { AcmController } from './acm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from 'src/visitors/entities/visitor.entity';
import { Officer } from 'src/officers/entities/officer.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visitor]),
    TypeOrmModule.forFeature([Officer]),
    HttpModule
  ],
  controllers: [AcmController],
  providers: [AcmService],
})
export class AcmModule { }
