import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getSystemStatus() {
    return {
      status: 'Nominal',
      system: 'Sentinel Enterprise OS',
      version: '1.0.0',
      uptime: process.uptime(),
      dbConnected: true,
      realtimeChannelActive: true,
      aiReady: true
    };
  }
}
