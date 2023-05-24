import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Securities } from 'src/schemas';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TcpAuthService {
    private logger = new Logger(`::${TcpAuthService.name}::`)
    constructor(
        @InjectModel(Securities.name) 
        private readonly securityModel: Model<Securities>
    ) {}
    
    async validateToken(dto: any) {
        try {
            const countSecurityWithToken = await this.securityModel.find({  })
            this.logger.log(`::validatetoken::${JSON.stringify(dto)}::return::${JSON.stringify(countSecurityWithToken)}`);
            return true   
        } catch (error) {
            this.logger.error(error);
            throw new RpcException('::validate-token::error');
        }
    }
}