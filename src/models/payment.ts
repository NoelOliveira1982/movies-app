import { Currency } from "./currency";
import { MethodPayment } from "./method-payment";

export interface Payment {
  id_payment: string,
  method: MethodPayment,
  value: number,
  currency: Currency,
  conversion_value: number,
  promo_code: string,
}