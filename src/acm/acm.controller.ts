import { Controller, Req, Res, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcmService } from './acm.service';
import { InputAcmDto } from './dto/input-acm.dto';
import { HttpService } from '@nestjs/axios';

@Controller('acm')
export class AcmController {
  constructor(
    private readonly acmService: AcmService,
    private readonly http: HttpService) { }

  @Post('input')
  async inputAcm(@Body() inputAcmDto: InputAcmDto) {
    console.log('input', inputAcmDto)
    const visitor = await this.acmService.findVisitorByToken(inputAcmDto.token);
    //  const  officer = await this.acmService.findOfficerByToken(inputAcmDto.token);
 

    console.log(visitor)
  

    if (visitor.length === 1) {
      console.log('route to single')

      //1 visitor
      try {
        const destFloor = visitor[0].destFloor;
        const url = `http://127.0.0.1:3000/api/mitsu/single`;
        let data: any = { "ipAddress": "192.168.99.254", "deviceNum": inputAcmDto.deviceNum, "destFloor": destFloor }
        const response = await this.http.post(url, data).toPromise();
        return response.data;
      } catch (error) {
        throw new Error(`Error calling API: ${error.message}`);
      }

    } else{
      console.log('บัตรไม่ได้ลงทะเบียน')
      return `{ "message":"บัตรไม่ได้ลงทะเบียน"}`
    }
    //route
    //1 visitor
    //   const destFloor = visitor[0].destFloor;
    //   console.log(destFloor);
    //    try {
    //    const url = `http://127.0.0.1:3000/api/mitsu/single`;
    //    let data:any = { "ipAddress":"192.168.99.254", "deviceNum":inputAcmDto.deviceNumber, "destFloor":destFloor}
    //    const response = await this.http.post(url, data).toPromise();
    //    return response.data;
    //  } catch (error) {
    //    throw new Error(`Error calling API: ${error.message}`);
    //  }


    //2 officer

    //   const multiDestFloor = visitor[0].destFloor;
    //   console.log(destFloor);
    //    try {
    //    const url = `http://127.0.0.1:3000/api/mitsu/single`;
    //    let data:any = { "ipAddress":"192.168.99.254", "deviceNum":inputAcmDto.deviceNumber, "destFloor":destFloor}
    //    const response = await this.http.post(url, data).toPromise();
    //    return response.data;
    //  } catch (error) {
    //    throw new Error(`Error calling API: ${error.message}`);
    //  }


    //3 no registeration 


  }

 
}
