// users.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAdminUsers(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('contactPhone') contactPhone: string,
  ) {
    return this.usersService.findAll(offset, limit, { name, email, contactPhone });
  }

  @Get('manager')
  @UseGuards(RolesGuard)
  @Roles('manager')
  async getManagerUsers(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('contactPhone') contactPhone: string,
  ) {
    return this.usersService.findAll(offset, limit, { name, email, contactPhone });
  }
}
