// adminInit.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';  // Импортируем сервис пользователей
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminInitService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    try {
      // Проверка, существует ли уже администратор
      const existingAdmin = await this.usersService.findByEmail('admin@example.com');
      if (existingAdmin) {
        console.log('Администратор уже существует.');
        return;
      }

      const hashedPassword = await bcrypt.hash('defaultPassword', 10);

      const adminUser = {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        contactPhone: '',
        role: 'admin',
      };

      // Регистрируем нового администратора
      await this.usersService.register(adminUser);
      console.log('Новый администратор создан с паролем по умолчанию.');

    } catch (error) {
      console.error('Ошибка при инициализации администратора:', error.message);
    }
  }
}
