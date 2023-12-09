import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MitsuModule } from './mitsu/mitsu.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorsModule } from './visitors/visitors.module';
import { Visitor } from './visitors/entities/visitor.entity';
import { AcmModule } from './acm/acm.module';
import { OfficersModule } from './officers/officers.module';
import { Officer } from './officers/entities/officer.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3318,
      username: 'root',
      password: 'Toyota88@',
      database: 'Lobby',
      entities: [Visitor,Officer],
      synchronize: false,
    }),
    MitsuModule,
    VisitorsModule,
    OfficersModule,
    AcmModule,
    OfficersModule],
  controllers: [AppController],
  providers: [
  
    AppService],
})
export class AppModule {}
