import crypto from 'node:crypto';
import axios from 'axios';
import { CreatePaymentResult, ICryptomusService } from './cryptomus.interface';
import { ConfigService } from '../config/config.service';

class CryptomusService implements ICryptomusService {
  private apiKey: string;

  private merchantId: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('CRYPTO_API_KEY');
    this.merchantId = this.configService.get('CRYPTO_MERCHANT_ID');
  }

  getHeader(payload: string) {
    const sign = crypto.createHash('md5').update(
      Buffer.from(payload).toString('base64') + this.apiKey,
    ).digest('hex');
    return {
      merchantId: this.merchantId,
      sign,
    };
  }

  async createPayment(amount: number, orderId: string) {
    const payload = {
      amount: amount.toString(),
      currency: 'USD',
      order_id: orderId,
    };
    try {
      const { data } = await axios.post<CreatePaymentResult>('https://api.cryptomus.com/v1/payment', payload, {
        headers: this.getHeader(JSON.stringify(payload)),
      });
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  async checkPayment(uuid: string) {
    const payload = {
      uuid,
    };
    try {
      const { data } = await axios.post<CreatePaymentResult>('https://api.cryptomus.com/v1/payment/info', payload, {
        headers: this.getHeader(JSON.stringify(payload)),
      });
      return data;
    } catch (e) {
      console.error(e);
    }
  }
}

export default CryptomusService;
