import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateCalorieLimitDto } from './dto/update-calorie-limit.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateDesiredWeightDto } from './dto/update-desired-weight.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController{
    constructor(private readonly users: UsersService){}

    @Get('me/calorie-limit')
    getMyCalorieLimit(@Req() req: any){
        return this.users.getCalorieLimit(req.user.id);
    }

    @Patch('me/calorie-limit')
    updateMyCalorieLimit(@Req() req: any, @Body() dto: UpdateCalorieLimitDto) {
        return this.users.updateCalorieLimit(req.user.id, dto.value);
        
    }

    @Get('me/desired-weight')
    getDesiredWeight(@Req() req: any){
        return this.users.getDesiredWeight(req.user.id);
    }

    @Patch('me/desired-weight')
    updateDesiredWeight(@Req() req: any, @Body() dto: UpdateDesiredWeightDto){
        return this.users.updateDesiredWeight(req.user.id, dto.value)
    }
}