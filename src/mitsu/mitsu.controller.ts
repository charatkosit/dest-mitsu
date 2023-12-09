import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MitsuService } from './mitsu.service';



import { UdpService } from './udp.service';
import { reverse } from 'dns';
import { SingleMitsuDto } from './dto/single-mitsu.dto';
import { MultiMitsuDto } from './dto/multi-mitsu.dto';

@Controller('mitsu')
export class MitsuController {
  constructor(
    private readonly mitsuService: MitsuService,
    private readonly udpService: UdpService) { }

  // Lookup table
  private lookupTable = {
    'gateway1': '0001',
    'gateway2': '0002',
    'gateway3': '0003',
    'gateway6': '0006',
    '1': '0001',
    '2': '0002',
    '3': '0003',
    '4': '0004',
    '5': '0005',
    '6': '0006',
    '7': '0007',
    '8': '0008',
    '9': '0009',
    '10': '000A',
    '11': '000B',
    '12': '000C',
    '13': '000D',
    '14': '000E',
    '15': '000F',
    '16': '0010',
    '17': '0011',
    '18': '0012',
    '19': '0013',
    '20': '0014',
    '21': '0015',
    '22': '0016',
    '23': '0017',
    '24': '0018',
    '25': '0019',
    '26': '001A',
    '27': '001B',
    '28': '001C',
    '29': '001D',
    '30': '001E',
    '31': '001F',
    '32': '0020',
  };


 @Post('single')
  singleToMitsu(@Body() singleMitsuDto: SingleMitsuDto){
    //Destination-Floor
    const hexDestinationFloor = this.udpService.decToHex(singleMitsuDto.destFloor)

    //Boarding-Floor
    //  const hexBoardingFloor = this.lookupTable[boardFloor];

    //Device-Number
    const hexDeviceNumber = this.udpService.decToHex(singleMitsuDto.deviceNum);

    //
    const boardingFloorByDeviceNum = this.udpService.deviceNumToHexBoardingFloor(singleMitsuDto.deviceNum)
    const hexBoardingFloorByDeviceNum = this.lookupTable[boardingFloorByDeviceNum]

    //Address-Device (Bank01, Bank02)
    const hexBankByDeviceNum = this.udpService.checkAddressDevice(singleMitsuDto.deviceNum)

    let Msg: string = '';
    let codeMsg1: string = '1730';      // *identifier
    let codeMsg2: string = '0014';      //  data length
    let codeMsg3: string = '01';    //  Address Device Type (ELSWG01)
    let codeMsg4: string = hexBankByDeviceNum;    //  Address Device Number(Bank01,Bank02) xx 
    let codeMsg5: string = '11';    //  Sender Device Type
    let codeMsg6: string = '01';    //  Sender Device Number
    let reserve1: string = '00000000';   // *reserve
    let codeMsg7: string = '01';         // single floor  (Conmmand number)
    let codeMsg8: string = '12';         // data length
    let codeMsg9: string = hexDeviceNumber;       // Device number xx xx 
    let codeMsg10: string = '01';                  // Verification type
    let codeMsg11: string = '01';                  // Verification Number
    let codeMsg12: string = '00';                   // Hall call button riser attribute
    let codeMsg13: string = '00';          // Reserve
    let codeMsg14: string = hexBoardingFloorByDeviceNum;       // Boarding floor xx xx
    let codeMsg15: string = hexDestinationFloor;      // Destination floor       xx xx
    let codeMsg16: string = '01';        // Boarding Front/Rear
    let codeMsg17: string = '01';        // Destination Front/Rear
    let codeMsg18: string = '00';        // Elevator's call attribute
    let codeMsg19: string = '00';        // Nonstop
    let codeMsg20: string = '00';        // Call Registration Mode
    let codeMsg21: string = 'FF'         // Sequence Number
    let reserve2: string = '0000';   // *Reserve

    let msg = codeMsg1 + codeMsg2 + codeMsg3 + codeMsg4 + codeMsg5 + codeMsg6 + reserve1 +
      codeMsg7 + codeMsg8 + codeMsg9 + codeMsg10 + codeMsg11 + codeMsg12 +
      codeMsg13 + codeMsg14 + codeMsg15 + codeMsg16 + codeMsg17 + codeMsg18 +
      codeMsg19 + codeMsg20 + codeMsg21 +
      reserve2;

    const debugMsg = this.udpService.convertStringToHex(msg)
    this.udpService.sendMessage(msg, 52000, singleMitsuDto.ipAddress);


    return `Message sent, Single Floor:
       msg:    ${msg}
       device-number ${singleMitsuDto.deviceNum}   => ${hexDeviceNumber}
       device-number ${singleMitsuDto.deviceNum} อยู่ใน bank => ${hexBankByDeviceNum}
       device-number ${singleMitsuDto.deviceNum} อยู่ที่ชั้น  ${hexBoardingFloorByDeviceNum}
       boarding-floor ${boardingFloorByDeviceNum}    => ${hexBoardingFloorByDeviceNum} 
       destination-floor ${singleMitsuDto.destFloor}  => ${hexDestinationFloor}
       debug: ${debugMsg}
       
       -----
       device-number    hex ${codeMsg9}
       bank              hex ${codeMsg4}
       boarding-floor   hex ${codeMsg14}
       destination-floor hex ${codeMsg15}
       
       `;


  }

  @Post('multi')
  multiToMitsu(@Body() multiMitsuDto: MultiMitsuDto){

    //Device-Number
    const hexDeviceNumber = this.udpService.decToHex(multiMitsuDto.deviceNum);

    //Address-Device (Bank01, Bank02)
    const hexBankByDeviceNum = this.udpService.checkAddressDevice(multiMitsuDto.deviceNum)

    //Boarding-Floor  by  Device-number
    const boardingFloorByDeviceNum = this.udpService.deviceNumToHexBoardingFloor(multiMitsuDto.deviceNum)
    const hexBoardingFloorByDeviceNum = this.lookupTable[boardingFloorByDeviceNum]
    

    //Seleted-Floor
    const selectedFloor =  JSON.parse(multiMitsuDto.multiSelectFloor).map(Number);
    const hexSelectedFloor: any = this.udpService.selectFloor(selectedFloor);

    let codeMsg1: string = '1730';      // *identify
    let codeMsg2: string = '0020';      //  data length
    let codeMsg3: string = '01';        // ELSWG01,ELSWG02
    let codeMsg4: string = hexBankByDeviceNum; // bank01,bank01 xx
    let codeMsg5: string = '11';
    let codeMsg6: string = '01';
    let reserve1: string = '00000000';   // *reserve
    let codeMsg7: string = '02';        // muliple floor
    let codeMsg8: string = '1B';
    let codeMsg9: string = hexDeviceNumber;   //Device Number xx xx 
    let codeMsg10: string = '01'    // Verification type
    let codeMsg11: string = '01'    // Verification location
    let codeMsg12: string = '00'   // Hall call button
    let reserve2: string = '00'   // Reserve xx 
    let codeMsg13: string = hexBoardingFloorByDeviceNum;      // boarding floor xx xx
    let reserve3: string = '0000';      // *reserve xx xx
    let codeMsg14: string = '01';       // Front/Rear 01
    let reserve4: string = '00';   // reserve  xx
    let codeMsg15: string = '00';  //Elevator's call attribute
    let codeMsg16: string = '00';  //Nonstop 00 
    let codeMsg17: string = '00'   //Call registration mode  00
    let codeMsg18:string = 'FF';   //Sequence number
    let codeMsg19: string = '09';  //Front destination floor data length 09      
    let codeMsg20: string = '00';  //Rear destination floor data length  00
    let codeMsg21:string =  hexSelectedFloor; // xx xx xx xx  xx xx xx xx
    let codeMsg22:string = '00';       
    let reserve5: string = '000000';   // *Padding

    let msg = codeMsg1 + codeMsg2 + codeMsg3 + codeMsg4 + codeMsg5 + codeMsg6 +
      reserve1 +
      codeMsg7 + codeMsg8 + codeMsg9 + codeMsg10 + codeMsg11 + codeMsg12 +
      reserve2 +
      codeMsg13 +
      reserve3 +
      codeMsg14 +
      reserve4 +
      codeMsg15 + codeMsg16 + codeMsg17 + codeMsg18 + codeMsg19 + codeMsg20 + codeMsg21 + codeMsg22 +
      reserve5;

    const codeMsg = this.udpService.convertStringToHex(msg)
    this.udpService.sendMessage(msg, 52000, multiMitsuDto.ipAddress);


    // 
    return `Message sent, Multiple Floor:
    selectedFloor raw  ${selectedFloor}
    selectedFloor codde ${hexSelectedFloor}
    ------
    ${codeMsg1}   Identifier 1730
    ${codeMsg2}   Data length 0020
    ${codeMsg3}   Address device type   01
    ${codeMsg4}   Address device number Bank01,02
    ${codeMsg5}   Sender device type 11
    ${codeMsg6}   Sender device number 01
    ${reserve1}   reserve  00000000
    ${codeMsg7}    Multiple-Floor  02
    ${codeMsg8}   Data length 1B
    ${codeMsg9}   Device-Number xx xx
    ${codeMsg10}  Verification type  01 
    ${codeMsg11}  Verification location  01 
    ${codeMsg12}  Hall call button riser attribute 00
    ${reserve2}    reserve2 00
    ${codeMsg13}   Boarding-Floor  xx xx
    ${reserve3}    reserve3 0000
    ${codeMsg14}  Boarding Front/Rear 01
    ${reserve4}    reserve4 00
    ${codeMsg15}  Elevator' call attribute 00
    ${codeMsg16}  Nonstop 00
    ${codeMsg17}  Call registration mode 00
    ${codeMsg18}  Sequence number FF 
    ${codeMsg19}  Front destination floor data length 09   
    ${codeMsg20}  Rear destination floor data length  00
    ${codeMsg21}  selected-Floor xx xx xx xx xx xx xx xx
    ${codeMsg22}
    ${reserve5}   Padding

    ------
           ${msg}
           ${codeMsg} `;

  }


}
