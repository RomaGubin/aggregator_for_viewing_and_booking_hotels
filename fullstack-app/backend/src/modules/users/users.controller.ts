// users.controller.ts
import { Controller, Get, Query, UseGuards, Param, Req, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAdminUsers(
    @Req() req: Request & { user: User },
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string
  ) {
    try {
      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedOffset = Math.max(parseInt(offset) || 0, 0);
      
      const result = await this.usersService.findAll(
        parsedOffset,
        parsedLimit,
        search?.trim()
      );
  
      return {
        ...result,
        users: result.users.map(user => ({
          ...user,
          _id: user._id.toString()
        }))
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  async getManagerUsers(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string
  ) {
    return this.usersService.findAll(Number(offset), Number(limit), search);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

}
