import { Module } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from '../users/users.controller';

@Module({
    imports: [PassportModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
