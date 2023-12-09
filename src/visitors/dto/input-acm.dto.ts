import {IsNotEmpty} from 'class-validator'

export class InputAcmDto {

    @IsNotEmpty()
    token: string;
    
    @IsNotEmpty()
    deviceNum: number;



}
