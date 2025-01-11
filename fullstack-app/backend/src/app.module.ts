//app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { HotelsModule } from './modules/hotels/hotels.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel', { 
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB connected successfully');
        });
        connection.on('error', (err) => {
          console.error('MongoDB connection error:', err.message);
        });
        connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });
        return connection;
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UsersModule,
    HotelsModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}

