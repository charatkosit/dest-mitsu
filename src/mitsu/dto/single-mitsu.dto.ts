import {IsNotEmpty} from 'class-validator'

export class SingleMitsuDto {

    @IsNotEmpty()
    ipAddress:string;

    @IsNotEmpty()
    deviceNum: number;
    
    @IsNotEmpty()
    destFloor: number;

    @IsNotEmpty()
    callAttribute:string;

}