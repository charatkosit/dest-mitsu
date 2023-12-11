import { PartialType } from '@nestjs/mapped-types';
import { CreateOfficerDto } from './create-officer.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOfficerDto extends PartialType(CreateOfficerDto) {
    @IsNotEmpty()
    firstName: string;
  
    @IsNotEmpty()
    lastName: string;
  
    address: string;
  
    phone: string;
  
    idOfficer: string;
  
    department: string;
  
    @IsNotEmpty()
    token: string;
  
    @IsNotEmpty()
    multiSelectFloor: string;
  
}
