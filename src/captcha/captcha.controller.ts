import { Controller, Get, Session } from '@nestjs/common';
import { CaptchaService } from './captcha.service';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  getCaptcha(@Session() session: Record<string, any>) {
    const captcha = this.captchaService.generateCaptcha();
    session.captcha = captcha.text;
    return captcha.data;
  }
}
