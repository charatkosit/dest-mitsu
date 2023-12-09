import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { timestamp } from 'rxjs';

@Injectable()
export class VisitorsService {

  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>

  ) { }



  async create(createVisitorDto: CreateVisitorDto) {
    const visitor = new Visitor();
    visitor.firstName = createVisitorDto.firstName;
    visitor.lastName = createVisitorDto.lastName;
    visitor.phone = createVisitorDto.phone;
    visitor.idCard = createVisitorDto.idCard;
    visitor.token = createVisitorDto.token;
    visitor.destFloor = createVisitorDto.destFloor;
    visitor.checkIn = null;
    visitor.checkOut = null;

    return await this.visitorRepository.save(visitor)
  }

  async findAll() {
    return await this.visitorRepository.find({
      select: ['firstName', 'lastName', 'phone', 'idCard', 'token', 'destFloor', 'checkIn', 'checkOut']
    })
  }

  async findOne(id: number) {
    return await this.visitorRepository.find({
      select: ['firstName', 'lastName', 'phone', 'idCard', 'token', 'destFloor', 'checkIn', 'checkOut'],
      where: [{ id: id }]
    })
  }

  async findByToken(token: string): Promise<any> {
    const result = await this.visitorRepository.find({
      select: ['firstName', 'lastName', 'phone', 'idCard', 'token', 'destFloor', 'checkIn', 'checkOut'],
      where: [{ token: token }]
    });

    return result;
  }

  update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitor`;
  }
}
