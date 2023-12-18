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
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),   
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_IP,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB_NAME,
      entities: [Visitor,Officer],
      synchronize: true,
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
