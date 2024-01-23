import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as dgram from 'dgram';

@Injectable()
export class UdpService {
  private udpServer: dgram.Socket;
  private http:HttpService

  constructor() {
    // สร้าง UDP server
    this.udpServer = dgram.createSocket('udp4');

    // กำหนดการจัดการเหตุการณ์เมื่อมีข้อความเข้ามา
    this.udpServer.on('message', (msg, rinfo) => {
      console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    // การจัดการเหตุการณ์ error
    this.udpServer.on('error', (err) => {
      console.log(`Server error:\n${err.stack}`);
      this.udpServer.close();
    });

    // เริ่มต้นการฟังที่พอร์ตที่กำหนด
    this.udpServer.bind(52000);
  }

  sendMessage(hexString: string, port: number, address: string): void {
    // ตรวจสอบว่าข้อความมีความยาวเป็นจำนวนคู่
    if (hexString.length % 2 !== 0) {
      console.error('Hex string must have an even length');
      return;
    }

    // แปลงข้อความเป็น Buffer ของข้อมูล byte แบบ hex
    const messageBuffer = Buffer.from(hexString, 'hex');

    this.udpServer.send(messageBuffer, port, address, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log('Hex Message sent', messageBuffer);
      console.log(`
               to address: ${address}:${port}
               Hex Message sent : ${messageBuffer}`)
    });
  }


  selectFloor(inputArray: number[]) {
    // สร้างบิตสตริงที่มีความยาว 64 บิต
    let bitString: any = '0'.repeat(64);

    // ตั้งค่าบิตตามตำแหน่งที่ระบุในอาเรย์
    inputArray.forEach(bitPosition => {
      const index = 64 - bitPosition;
      bitString = bitString.substring(0, index) + '1' + bitString.substring(index + 1);
    });

    // แปลงบิตสตริงเป็นฐาน 16
    let hexString = '';
    for (let i = 0; i < bitString.length; i += 8) {
      const byte = bitString.substring(i, i + 8);
      hexString += parseInt(byte, 2).toString(16).padStart(2, '0').toUpperCase() + ' ';
    }

    // ตัดช่องว่างท้ายสุดออก
    hexString = hexString.trim();

    // เรียงลำดับใหม่
    // ตัดช่องว่างออก
     let reverseData = hexString.split(' ').reverse().join(' ');
     let hexSelectFloor = reverseData.replace(/\s/g, "");
   return hexSelectFloor;
  }

  // selectFloor2(inputArray: number[]): string {
  //   // สร้างบิตสตริงที่มีความยาว 64 บิต
  //   let bitString: string = '0'.repeat(64);

  //   // ตั้งค่าบิตตามตำแหน่งที่ระบุในอาเรย์
  //   inputArray.forEach(bitPosition => {
  //     const index = 64 - bitPosition;
  //     bitString = bitString.substring(0, index) + '1' + bitString.substring(index + 1);
  //   });

  //   // แปลงบิตสตริงเป็นฐาน 16
  //   let hexString = '';
  //   for (let i = 0; i < bitString.length; i += 8) {
  //     const byte = bitString.substring(i, i + 8);
  //     hexString += parseInt(byte, 2).toString(16).padStart(2, '0');
  //   }

  //   // เรียงลำดับใหม่และรวมเป็นสตริงเดียว
  //   return hexString.split('').reverse().join('');
  // }


  createHexString(bitsArray) {
    let number = BigInt(0); // ใช้ BigInt เพื่อรองรับตัวเลขขนาดใหญ่

    // ตั้งค่าบิตตามที่ระบุในอาร์เรย์
    bitsArray.forEach(bit => {
      number |= BigInt(1) << (64n - BigInt(bit));
    });

    // แปลงเป็นสตริงฐาน 16 พร้อมแพดดิ้งเป็น 16 ตัวอักษร (64 บิต)
    let hexString = number.toString(16).padStart(16, '0');

    // เรียงลำดับใหม่ตามความต้องการ
    let rearrangedHexString = '';
    for (let i = 0; i < hexString.length; i += 2) {
      rearrangedHexString = hexString.substring(i, i + 2) + rearrangedHexString;
    }

    return rearrangedHexString.toUpperCase();
  }




  convertStringToHex(str: string) {
    let hexFormat = '';
    for (let i = 0; i < str.length; i += 2) {
      hexFormat += str.substring(i, i + 2);
      if (i < str.length - 2) {
        hexFormat += ' ';
      }
    }
    return hexFormat;
  }

  decToHex(dec: number) {
    let hex = dec.toString(16).toUpperCase();
    while (hex.length < 4) {
      hex = "0" + hex;
    }
    return hex;
  }


  // ให้ deviceNum  มาให้หาว่าอยู่ชั้นไหนให้มารับที่ชั้นนั้น โดยให้ค่าเป็น string hex
  deviceNumToHexBoardingFloor(deviceNum:number){
    const groupFloor = [ 
      [1,2,3,4,5,6,7,8,9,10,11,12],
      [13,14,15,16,17,18,19,20,21,22,23,24],
      [25,26,27,28,29,30,31,32,33,34],
      [37,38],
      [49,50],
      [39,40,41,42,43,44,45,46,53,54],
      [57,58],
      [61,62],
      [65,66],
      [69,70],
      [73,74],
      [77,78],
      [81,82],
      [85,86],
      [89,90],
      [93,94],
      [97,98],
      [101,102],
      [103,104],
      [51,52,105,106],
      [55,56],
      [59,60],
      [63,64],
      [67,68],
      [71,72],
      [75,76],
      [79,80],
      [83,84],
      [87,88],
      [91,92],
      [95,96],
      [99,100]

    ];

    for (let i = 0; i< groupFloor.length; i++){
      if (groupFloor[i].includes(+deviceNum)){
         return `${i+1}`
      }
    }
   return `ไม่ได้อยู่ในชั้นไหน`
     
  }

  checkAddressDeviceMulti(deviceNum: number) {
    const bank01 = [
      1, 2, 3, 4, 5, 6, 13, 14, 15, 16, 17, 18, 25, 26, 27, 28, 29, 30, 37, 38, 39, 40, 41, 42, 49, 50, 53, 54, 57, 58,
      61, 62, 66, 65, 69, 70, 73, 74, 77, 78, 81, 82, 85, 86, 89, 90, 93, 94, 97,
      98, 101, 102, 103, 104, 105, 106
    ];
    const bank02 = [
      7, 8, 9, 10, 11, 12, 19, 20, 21, 22, 23, 24, 31, 32, 33, 34, 43, 44, 45, 46, 35, 36, 47, 48,
      51, 52, 55, 56, 59, 60, 63, 64, 67, 68, 71, 72, 75, 76, 79, 80, 83, 84, 87,
      88, 91, 92, 95, 96, 99, 100,
    ];

    // ตรวจสอบกลุ่ม 1
    if (bank01.includes(+deviceNum)) {
      return '01';
    }
    // ตรวจสอบกลุ่ม 2
    else if (bank02.includes(+deviceNum)) {
      return '02';
    }
    // ถ้าไม่อยู่ในกลุ่มใดๆ
    else {
      return 'ไม่อยู่ในกลุ่มที่กำหนด';
    }
  }

  checkAddressDevice(deviceNum: number):string {
    const bank01 = [
      1, 2, 13, 14, 25, 26,  37, 38,  49, 50, 53, 54, 57, 58,
      61, 62, 66, 65, 69, 70, 73, 74, 77, 78, 81, 82, 85, 86, 89, 90, 93, 94, 97,
      98, 101, 102, 103, 104, 105, 106
    ];
    const bank02 = [
       11, 12,  23, 24, 35, 36, 47, 48,
      51, 52, 55, 56, 59, 60, 63, 64, 67, 68, 71, 72, 75, 76, 79, 80, 83, 84, 87,
      88, 91, 92, 95, 96, 99, 100,
    ];
    
    //สำหรับ บัตร Single เท่านั้น ถ้าอ่านที่  DeviceNum เหล่านี้  จะ return 'FF'
    const multiBank = [
      3, 4, 5, 6, 7, 8, 9, 10,
      15, 16, 17, 18, 19, 20, 21, 22,
      27, 28, 29, 30, 31, 32, 33, 34,
      39, 40, 41, 42, 43, 44, 45, 46
       
    ];
    
    // ตรวจสอบกลุ่ม 1
    if (bank01.includes(+deviceNum)) {
      return '01';
    }
    // ตรวจสอบกลุ่ม 2
    else if (bank02.includes(+deviceNum)) {
      return '02';
    }
    // ถ้าไม่อยู่ในกลุ่มใดๆ
    else if(multiBank.includes(+deviceNum)) {
       return 'FF';
    }else {
      return 'ไม่อยู่ในกลุ่มที่กำหนด';
    }
  }


  async sendNotification(message: string) {
    // ส่งข้อมูลไปยัง Line Notify API
    const lineNotifyToken = 'ZcuasZl67YahoAeTyAvQ7loyL9RU2twtbqqizkfIhp6'; // แทนค่าด้วย Line Notify Token ของคุณ
    const url = 'https://notify-api.line.me/api/notify';
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${lineNotifyToken}`,
    };
    
    const data = new URLSearchParams();
    data.append('message', message);
    
    try {
      await this.http.post(url, data.toString(), { headers }).toPromise();
    } catch (error) {
      console.error('Error sending Line Notify:', error);
      throw error;
    }
  }
}

