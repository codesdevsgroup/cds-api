import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeGenerationService {
  async generateQrCode(qr: string): Promise<string> {
    return await QRCode.toDataURL(qr);
  }
}
