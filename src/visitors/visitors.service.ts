import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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

  async findAll() : Promise<Visitor[]>{
    return await this.visitorRepository.find({
      select: ['id','firstName', 'lastName', 'phone', 'idCard', 'token', 'destFloor','callAttribute', 'checkIn', 'checkOut']
    })
  }

  async findOne(id: number): Promise<Visitor[]> {
    return await this.visitorRepository.find({
      select: ['id','firstName', 'lastName', 'phone', 'idCard', 'token', 'destFloor','callAttribute', 'checkIn', 'checkOut'],
      where: [{ id: id }]
    })
  }

  async findByToken(token: string): Promise<any> {
    const result = await this.visitorRepository.find({
      select: ['id','firstName', 'lastName', 'phone', 'idCard', 'token', 'destFloor','callAttribute', 'checkIn', 'checkOut'],
      where: [{ token: token }]
    });

    return result;
  }

  async update(id: number, updateVisitorDto: UpdateVisitorDto) :Promise<UpdateResult>{
    return await this.visitorRepository.update(id,updateVisitorDto) 
  }

  async remove(id: number) :Promise<DeleteResult> {
    return await this.visitorRepository.delete(id);
  }

  async count() :Promise<number> {
    return await this.visitorRepository.count();
  }
}
