import { Injectable } from '@nestjs/common';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';

@Injectable()
export class OfficersService {
  create(createOfficerDto: CreateOfficerDto) {
    return 'This action adds a new officer';
  }

  findAll() {
    return `This action returns all officers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} officer`;
  }

  update(id: number, updateOfficerDto: UpdateOfficerDto) {
    return `This action updates a #${id} officer`;
  }

  remove(id: number) {
    return `This action removes a #${id} officer`;
  }
}
