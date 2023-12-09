import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { AxiosResponse } from 'axios';
import {Observable, last, lastValueFrom} from 'rxjs';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { InputAcmDto } from './dto/input-acm.dto';
import { HttpService } from '@nestjs/axios';

@Controller('visitors')
export class VisitorsController {
  constructor(
       private readonly http: HttpService,
      private readonly visitorsService: VisitorsService) {}

  @Post('input')
  async inputFromAcm(@Body() inputAcmDto: InputAcmDto){
     
       const  visitor  = await this.visitorsService.findByToken(inputAcmDto.token)

       if(visitor.length===0){
        return `{ "message":"บัตรไม่ได้ลงทะเบียน"}`
       }

       const destFloor = visitor[0].destFloor;
       console.log(destFloor);
        try {
        const url = `http://127.0.0.1:3000/api/mitsu/single`;
        let data:any = { "ipAddress":"192.168.99.254", "deviceNum":inputAcmDto.deviceNum, "destFloor":destFloor}
        const response = await this.http.post(url, data).toPromise();
        return response.data;
      } catch (error) {
        throw new Error(`Error calling API: ${error.message}`);
      }
    
      
   
  }


}
