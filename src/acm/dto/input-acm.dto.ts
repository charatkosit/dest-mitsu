import {IsNotEmpty, MinLength, IsEmail} from 'class-validator'
export class InputAcmDto {

    @IsNotEmpty()
    token: string;
    @IsNotEmpty()
    deviceNum: number;
    
}