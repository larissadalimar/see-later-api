import { CanActivate, ConflictException, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersRepository } from 'src/users/user.repository';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private jwtService: JwtService, private usersRepository: UsersRepository) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    
      const request = context.switchToHttp().getRequest();
      const body = request.body;
    
      try {
        
        const user = await this.usersRepository.findOne(body.email);

        if (!user) throw new NotFoundException('This user does not exist.');

        request['user'] = body.email;

      } catch(e){

        throw e;
      }

      return true;
  }
}
