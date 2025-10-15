import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateCalorieLimitDto } from './dto/update-calorie-limit.dto';
import { AuthGuard } from '@nestjs/passport';

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
}