import { Injectable } from '@nestjs/common';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';
import { Officer } from './entities/officer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { promises } from 'dns';

@Injectable()
export class OfficersService {

  constructor(
    @InjectRepository(Officer)
    private officerRepository: Repository<Officer>
  ) { }

  async create(creatOfficerDto: CreateOfficerDto) {
    const officer = new Officer();
    officer.firstName = creatOfficerDto.firstName;
    officer.lastName = creatOfficerDto.lastName;
    officer.phone = creatOfficerDto.phone;
    officer.idOfficer = creatOfficerDto.idOfficer;
    officer.token = creatOfficerDto.token;
    officer.address= creatOfficerDto.address;
    officer.department=creatOfficerDto.department;
    officer.multiSelectFloor = creatOfficerDto.multiSelectFloor;
    return await this.officerRepository.save(officer)
  }

  async findAll() :Promise<Officer[]> {
    return await this.officerRepository.find({
      select: ['id','firstName', 'lastName', 'phone', 'idOfficer', 'token', 'multiSelectFloor','department']
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} officerxx`;
  }

 async update(id: number, updateOfficerDto: UpdateOfficerDto):Promise<UpdateResult> {
    return await this.officerRepository.update(id,updateOfficerDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return  await this.officerRepository.delete(id)
  }

  async count() :Promise<number> {
    return await this.officerRepository.count();
  }
  
}
