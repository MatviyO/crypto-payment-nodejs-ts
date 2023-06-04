export interface ICryptomusService {
  createPayment(amount: number, orderId: string): Promise<CreatePaymentResult>;
  checkPayment(uuid: string): Promise<CreatePaymentResult>;
  getHeader(payload: string): { sign: string, merchantId: string};
}
export interface Currency {
  currency: string
  network: string
}

export interface Result {
  uuid: string
  order_id: string
  amount: string
  payment_amount: string
  payer_amount: string
  payer_currency: string
  currency: string
  network: string
  url: string
  expired_at: number
  status: string
  is_final: boolean
  additional_data: any
  currencies: Currency[]
}

export interface CreatePaymentResult {
  state: number
  result: Result;
}
