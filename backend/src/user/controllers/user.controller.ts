import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAccessTokenGuard } from "src/auth/guards/jwt-access-token.guard";
import { UserEntity } from "src/core/entities/User.entity";
import { PaginationResponse } from "src/core/types/paginationResponse.interface";
import { UpdateResult } from "typeorm";
import { UpdateUserDTO } from "../../core/dtos/user.dto";
import { UserService } from "../user.service";

@ApiTags('users')
@Controller('users')
export class UserController{
    constructor(
        private readonly userService:UserService
    ){}

    @UseGuards(JwtAccessTokenGuard)
    @Get('types-stats')
    async getUserTypesStats(){
        return await  this.userService.getUserTypesStats()
    }
    
    @Get('')
    async findAll(@Query('offset') offset:number = 0 ,@Query('limit') limit:number = 10 ,@Query('orderBy') orderBy:string  = undefined , @Query('searchQuery') searchQuery:string , @Query('departementId') departementId:string , @Query('directionId') directionId:string):Promise<PaginationResponse<UserEntity>>{
        return await  this.userService.findAll(offset,limit,orderBy,searchQuery,departementId,directionId);
    }   

    @Get(":id")
    async findById(@Param('id') id:string){
        return await  this.userService.findByIdWithDepartementAndDirection(id);
    }  
    
    // @Delete(':id')
    // async deleteUser(@Param('id') id:string): Promise<string>{
       
    // }
    // @UseGuards(JwtAccessTokenGuard)
    @Put(':id')
    async updateUser(@Param('id') id:string,@Body() user:UpdateUserDTO):Promise<UpdateResult>{
        return await this.userService.updateUserUniqueCheck(id,user)
    }

   
}