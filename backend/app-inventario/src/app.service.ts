import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'API Inventario',
      status: 'active',
      timestamp: new Date().toISOString(),
    }
  }
}
