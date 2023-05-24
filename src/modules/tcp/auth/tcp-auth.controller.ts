import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpAuthService } from './tcp-auth.service';
import { AllExceptionsFilter } from 'src/common/exception';

@Controller()
export class TcpAuthController {

  constructor(
    private readonly tcpAuthService: TcpAuthService
) {}

@UseFilters(new AllExceptionsFilter())
  @MessagePattern({ subjet: 'client-security', function: 'validate-token' })
  async validateToken(dto: any) {
    return await this.tcpAuthService.validateToken(dto);
  }
}
