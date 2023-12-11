import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { Visitor } from 'src/visitors/entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Officer } from 'src/officers/entities/officer.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AcmService {

  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
    
    @InjectRepository(Officer)
    private officerRepository: Repository<Officer>,

    private readonly http: HttpService,) { }


  async findVisitorByToken(token: string): Promise<any> {
    const result = await this.visitorRepository.find({
      select: ['firstName', 'lastName', 'phone', 'idCard', 'token', 'destFloor', 'checkIn', 'checkOut'],
      where: [{ token: token }]
    });

    return result;
  }

  async findOfficerByToken(token: string): Promise<any> {
    const result = await this.officerRepository.find({
      select: ['firstName', 'lastName', 'token', 'multiSelectFloor'],
      where: [{ token: token }]
    });

    return result;
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
