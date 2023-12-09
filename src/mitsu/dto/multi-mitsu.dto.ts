import {IsNotEmpty} from 'class-validator'

export class MultiMitsuDto {

    @IsNotEmpty()
    ipAddress:string;

    @IsNotEmpty()
    deviceNum: number;
    
    @IsNotEmpty()
     multiSelectFloor: string;

}