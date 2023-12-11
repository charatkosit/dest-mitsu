import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfficersService } from './officers.service';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';

@Controller('officers')
export class OfficersController {
  constructor(private readonly officersService: OfficersService) {}

  @Post()
  create(@Body() createOfficerDto: CreateOfficerDto) {
    return this.officersService.create(createOfficerDto);
  }

  @Get('count')
  count(){
    return this.officersService.count();
  } 

  @Get()
  findAll() {
      // const counter:number = Object.keys(data).length
    // let code:number;
    // let message:string;
    // console.log (counter);
    // if (counter == 0) {
    //     code =HttpStatus.NOT_FOUND;
    //     message='Not Found';  
    // }else {
    //     code =HttpStatus.OK;
    //     message='OK';
    // }
        // return {
    //   code: code,
    //   message: message,
    //   resultFound: counter,
    //   data: data
    // } 

    return this.officersService.findAll();
  
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.officersService.findOne(+id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfficerDto: UpdateOfficerDto) {
    return this.officersService.update(+id, updateOfficerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.officersService.remove(+id);
  }
}
