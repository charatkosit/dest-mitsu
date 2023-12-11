import {IsNotEmpty} from 'class-validator'
export class CreateOfficerDto {

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
