import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: { user: unknown }) {
    return req.user;
  }
}
