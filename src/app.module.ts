import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MitsuModule } from './mitsu/mitsu.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),   
    MitsuModule,
  ],
  controllers: [AppController],
  providers: [
  
    AppService],
})
export class AppModule {}
