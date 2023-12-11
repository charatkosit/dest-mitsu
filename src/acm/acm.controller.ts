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
    const officer = await this.acmService.findOfficerByToken(inputAcmDto.token);

    const deviceNumOfficeFloor = [37, 38, 49, 50, 57, 58, 61, 62, 65, 66, 69, 70, 73, 74, 77, 78, 81, 82, 85, 86, 89, 90, 93,
      94, 97, 98, 101, 102, 103, 104, 105, 106, 51, 52, 55, 56, 59, 60, 63, 64, 67, 68, 71, 72,
      75, 76, 79, 80, 83, 84, 87, 88, 91, 92, 95, 96, 99, 100]


    if (visitor.length === 1) {
      console.log('route to single')

      //1 visitor
      try {
        let destFloor: number
        if (deviceNumOfficeFloor.includes(+inputAcmDto.deviceNum)) {
          // console.log('')
          destFloor = 1;
        } else {
          destFloor = visitor[0].destFloor;
        }


        // const destFloor = visitor[0].destFloor;
        const url = `http://127.0.0.1:3000/api/mitsu/single`;
        let data: any = { "ipAddress": process.env.IP_MITSU, "deviceNum": inputAcmDto.deviceNum, "destFloor": destFloor }
        const response = await this.http.post(url, data).toPromise();
        return response.data;
      } catch (error) {
        throw new Error(`Error calling API: ${error.message}`);
      }

    } else if (officer.length === 1) {
      console.log('บัตรพนักงาน Multi')

      try {
        // const destFloor = visitor[0].destFloor;
        const url = `http://127.0.0.1:3000/api/mitsu/multi`;
        let data: any = { "ipAddress": process.env.IP_MITSU, "deviceNum": inputAcmDto.deviceNum, "multiSelectFloor": officer[0].multiSelectFloor }
        const response = await this.http.post(url, data).toPromise();
        return response.data;

      } catch (error) {
        throw new Error(`Error calling API: ${error.message}`);
      }


    } else {

      return `{ "message":"บัตรไม่ได้ลงทะเบียน"}`
    }

  }


}
