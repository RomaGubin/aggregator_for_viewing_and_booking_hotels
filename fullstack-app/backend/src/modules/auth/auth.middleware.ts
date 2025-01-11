//auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'defaultSecret');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
  }
}
