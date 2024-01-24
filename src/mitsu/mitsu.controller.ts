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
  singleToMitsu(@Body() singleMitsuDto: SingleMitsuDto) {
    //Destination-Floor
    const hexDestinationFloor = this.udpService.decToHex(+singleMitsuDto.destFloor)
    console.log(`DestFL: ${singleMitsuDto.destFloor}`)
    console.log(`+DestFL: ${+singleMitsuDto.destFloor}`)
    console.log(`hexDestFL: ${hexDestinationFloor}`)
    //Boarding-Floor
    //  const hexBoardingFloor = this.lookupTable[boardFloor];

    //Device-Number
    const hexDeviceNumber = this.udpService.decToHex(+singleMitsuDto.deviceNum);

    //
    const boardingFloorByDeviceNum = this.udpService.deviceNumToHexBoardingFloor(+singleMitsuDto.deviceNum)
    const hexBoardingFloorByDeviceNum = this.lookupTable[boardingFloorByDeviceNum]


    //Address-Device (Bank01, Bank02, multiBank)
    const hexBankByDeviceNum = this.udpService.checkAddressDevice(+singleMitsuDto.deviceNum)
    console.log(`hexBackByDeviceNum ${hexBankByDeviceNum}`)

    // Elevator's call attribute 00=normal,01=handicapped,02=vip,03=mgnt
    let callAttribute = '00';
    if( singleMitsuDto.callAttribute === 'normal'){
      callAttribute = '00'; 
    } else if(singleMitsuDto.callAttribute ==='handicapped'){
      callAttribute = '01'; 
    } else if(singleMitsuDto.callAttribute === 'vip' ){
      callAttribute = '02';
    } else if(singleMitsuDto.callAttribute === 'mgnt'){
      callAttribute = '03';
    } else {
      callAttribute = '00';
    }
    const hexCallAttribute = callAttribute;
    console.log(`hexCallAttribute = ${hexCallAttribute}`)

    let Msg: string = '';
    let sCodeMsg1: string = '1730';      // *identifier
    let sCodeMsg2: string = '0014';      //  data length
    let sCodeMsg3: string = '01';    //  Address Device Type (ELSWG01)
    let sCodeMsg4: string = hexBankByDeviceNum;    //  Address Device Number(Bank01,Bank02) xx 
    let sCodeMsg5: string = '11';    //  Sender Device Type
    let sCodeMsg6: string = '01';    //  Sender Device Number
    let reserve1: string = '00000000';   // *reserve
    let sCodeMsg7: string = '01';         // single floor  (Conmmand number)
    let sCodeMsg8: string = '12';         // data length
    let sCodeMsg9: string = hexDeviceNumber;  // Device number xx xx 
    let sCodeMsg10: string = '01';        // Verification type
    let sCodeMsg11: string = '01';        // Verification Number
    let sCodeMsg12: string = '00';        // Hall call button riser attribute
    let sCodeMsg13: string = '00';        // Reserve
    let sCodeMsg14: string = hexBoardingFloorByDeviceNum;       // Boarding floor xx xx
    let sCodeMsg15: string = hexDestinationFloor;      // Destination floor       xx xx
    let sCodeMsg16: string = '01';        // Boarding Front/Rear
    let sCodeMsg17: string = '01';        // Destination Front/Rear
    let sCodeMsg18: string = hexCallAttribute; // Elevator's call attribute 00=normal,01=handicapped,02=vip,03=mgnt
    let sCodeMsg19: string = '00';        // Nonstop
    let sCodeMsg20: string = '00';        // Call Registration Mode
    let sCodeMsg21: string = 'FF'         // Sequence Number
    let reserve2: string = '0000';        // *Reserve

    let sMsg = sCodeMsg1 + sCodeMsg2 + sCodeMsg3 + sCodeMsg4 + sCodeMsg5 + sCodeMsg6 + reserve1 +
      sCodeMsg7 + sCodeMsg8 + sCodeMsg9 + sCodeMsg10 + sCodeMsg11 + sCodeMsg12 +
      sCodeMsg13 + sCodeMsg14 + sCodeMsg15 + sCodeMsg16 + sCodeMsg17 + sCodeMsg18 +
      sCodeMsg19 + sCodeMsg20 + sCodeMsg21 +
      reserve2;
    console.log(`Mitsu-IP:    ${singleMitsuDto.ipAddress}`);
    console.log(`sMsg ${sMsg}`);

    const debugMsg = this.udpService.convertStringToHex(sMsg)
    this.udpService.sendMessage(sMsg, 52000, singleMitsuDto.ipAddress);


    return `Message sent, Single Floor:
       msg:    ${sMsg}
       device-number ${singleMitsuDto.deviceNum}   => ${hexDeviceNumber}
       device-number ${singleMitsuDto.deviceNum} อยู่ใน bank => ${hexBankByDeviceNum}
       device-number ${singleMitsuDto.deviceNum} อยู่ที่ชั้น  ${hexBoardingFloorByDeviceNum}
       boarding-floor ${boardingFloorByDeviceNum}    => ${hexBoardingFloorByDeviceNum} 
       destination-floor ${singleMitsuDto.destFloor}  => ${hexDestinationFloor}
       debug: ${debugMsg}
       
       -----
       
       device-number    hex ${sCodeMsg9}
       bank              hex ${sCodeMsg4}
       boarding-floor   hex ${sCodeMsg14}
       destination-floor hex ${sCodeMsg15}
       
       `;


  }

  @Post('multi')
  multiToMitsu(@Body() multiMitsuDto: MultiMitsuDto) {

    //Device-Number
    const hexDeviceNumber = this.udpService.decToHex(+multiMitsuDto.deviceNum);

    //Address-Device (Bank01, Bank02)
    const hexMultiBankByDeviceNum = this.udpService.checkAddressDeviceMulti(+multiMitsuDto.deviceNum)
    console.log(`hexMultiBankByDeviceNum ${hexMultiBankByDeviceNum}`)

    //Boarding-Floor  by  Device-number
    const boardingFloorByDeviceNum = this.udpService.deviceNumToHexBoardingFloor(+multiMitsuDto.deviceNum)
    console.log(`boardingFloorByDeviceNum ${boardingFloorByDeviceNum}`)

    const hexBoardingFloorByDeviceNum = this.lookupTable[boardingFloorByDeviceNum]
    console.log(`hexBoardingFloorByDeviceNum ${hexBoardingFloorByDeviceNum}`)

    //Seleted-Floor
    const selectedFloor = JSON.parse(multiMitsuDto.multiSelectFloor).map(Number);
    const hexSelectedFloor: any = this.udpService.selectFloor(selectedFloor);
    console.log(`selectFL ${selectedFloor}`)
    console.log(`hexSelectFL ${hexSelectedFloor}`)

    // Elevator's call attribute 00=normal,01=handicapped,02=vip,03=mgnt
    let callAttribute = '00';
    if( multiMitsuDto.callAttribute === 'normal'){
      callAttribute = '00'; 
    } else if(multiMitsuDto.callAttribute ==='handicapped'){
      callAttribute = '01'; 
    } else if(multiMitsuDto.callAttribute === 'vip' ){
      callAttribute = '02';
    } else if(multiMitsuDto.callAttribute === 'mgnt'){
      callAttribute = '03';
    } else {
      callAttribute = '00';
    }

    const hexCallAttribute = callAttribute;
    console.log(`hexCallAttribute = ${hexCallAttribute}`)

    let mCodeMsg1: string = '1730';      // *identify
    let mCodeMsg2: string = '0020';      //  data length
    let mCodeMsg3: string = '01';        // ELSWG01,ELSWG02
    let mCodeMsg4: string = hexMultiBankByDeviceNum; // bank01,bank01 xx
    let mCodeMsg5: string = '11';
    let mCodeMsg6: string = '01';
    let reserve1: string = '00000000';   // *reserve
    let mCodeMsg7: string = '02';        // muliple floor
    let mCodeMsg8: string = '1B';
    let mCodeMsg9: string = hexDeviceNumber;   //Device Number xx xx 
    let mCodeMsg10: string = '01'    // Verification type
    let mCodeMsg11: string = '01'    // Verification location
    let mCodeMsg12: string = '00'   // Hall call button
    let reserve2: string = '00'   // Reserve xx 
    let mCodeMsg13: string = hexBoardingFloorByDeviceNum;      // boarding floor xx xx
    let reserve3: string = '0000';      // *reserve xx xx
    let mCodeMsg14: string = '01';       // Front/Rear 01
    let reserve4: string = '00';   // reserve  xx
    let mCodeMsg15: string = hexCallAttribute;   // Elevator's call attribute 00=normal,01=handicapped,02=vip,03=mgnt
    let mCodeMsg16: string = '00';  //Nonstop 00 
    let mCodeMsg17: string = '00'   //Call registration mode  00
    let mCodeMsg18: string = 'FF';   //Sequence number
    let mCodeMsg19: string = '09';  //Front destination floor data length 09      
    let mCodeMsg20: string = '00';  //Rear destination floor data length  00
    let mCodeMsg21: string = hexSelectedFloor; // xx xx xx xx  xx xx xx xx
    let mCodeMsg22: string = '00';
    let reserve5: string = '000000';   // *Padding

    let mMsg = mCodeMsg1 + mCodeMsg2 + mCodeMsg3 + mCodeMsg4 + mCodeMsg5 + mCodeMsg6 +
      reserve1 +
      mCodeMsg7 + mCodeMsg8 + mCodeMsg9 + mCodeMsg10 + mCodeMsg11 + mCodeMsg12 +
      reserve2 +
      mCodeMsg13 +
      reserve3 +
      mCodeMsg14 +
      reserve4 +
      mCodeMsg15 + mCodeMsg16 + mCodeMsg17 + mCodeMsg18 + mCodeMsg19 + mCodeMsg20 + mCodeMsg21 + mCodeMsg22 +
      reserve5;
    console.log(`mMsg ${mMsg}`)
    const mCodeMsg = this.udpService.convertStringToHex(mMsg)
    this.udpService.sendMessage(mMsg, 52000, multiMitsuDto.ipAddress);


    // 
    return `Message sent, Multiple Floor:
    selectedFloor raw  ${selectedFloor}
    selectedFloor codde ${hexSelectedFloor}

     -----
   
    device-number    hex ${mCodeMsg9}
    bank              hex ${mCodeMsg4}
    boarding-floor   hex ${mCodeMsg14}
    destination-floor hex ${mCodeMsg15}
    
    
    ------
    ${mCodeMsg1}   Identifier 1730
    ${mCodeMsg2}   Data length 0020
    ${mCodeMsg3}   Address device type   01
    ${mCodeMsg4}   Address device number Bank01,02
    ${mCodeMsg5}   Sender device type 11
    ${mCodeMsg6}   Sender device number 01
    ${reserve1}   reserve  00000000
    ${mCodeMsg7}    Multiple-Floor  02
    ${mCodeMsg8}   Data length 1B
    ${mCodeMsg9}   Device-Number xx xx
    ${mCodeMsg10}  Verification type  01 
    ${mCodeMsg11}  Verification location  01 
    ${mCodeMsg12}  Hall call button riser attribute 00
    ${reserve2}    reserve2 00
    ${mCodeMsg13}   Boarding-Floor  xx xx
    ${reserve3}    reserve3 0000
    ${mCodeMsg14}  Boarding Front/Rear 01
    ${reserve4}    reserve4 00
    ${mCodeMsg15}  Elevator' call attribute 00=normal,01=handicapped,02=vip,03=mgnt
    ${mCodeMsg16}  Nonstop 00
    ${mCodeMsg17}  Call registration mode 00
    ${mCodeMsg18}  Sequence number FF 
    ${mCodeMsg19}  Front destination floor data length 09   
    ${mCodeMsg20}  Rear destination floor data length  00
    ${mCodeMsg21}  selected-Floor xx xx xx xx xx xx xx xx
    ${mCodeMsg22}
    ${reserve5}   Padding

    ------
    Mitsu-IP: ${multiMitsuDto.ipAddress}
           ${mMsg}
           ${mCodeMsg} `;

  }


}
