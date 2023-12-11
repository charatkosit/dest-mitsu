import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { AxiosResponse } from 'axios';
import {Observable, last, lastValueFrom} from 'rxjs';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { HttpService } from '@nestjs/axios';

@Controller('visitors')
export class VisitorsController {
  constructor(
       private readonly http: HttpService,
      private readonly visitorsService: VisitorsService) {}

  
  @Post()
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorsService.create(createVisitorDto);
  }

  @Get()
  findAll() {
    return this.visitorsService.findAll();
  }

  @Get('count')
  count(){
    return this.visitorsService.count();
  } 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitorDto: UpdateVisitorDto) {
    return this.visitorsService.update(+id, updateVisitorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitorsService.remove(+id);
  }

}
