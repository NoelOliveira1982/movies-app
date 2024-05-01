import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { Payment } from '@/models/payment'; // Importe a interface Payment
import { MethodPayment } from '@/models/method-payment'; // Importe a interface MethodPayment
import { Currency } from '@/models/currency'; // Importe a interface Currency
import { http } from '@/db/client'; // Importe a instância do cliente HTTP
import { PromoCode } from '@/models/promo-code';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cost: string;
  id_movie: string;
  id_user: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, cost, id_movie, id_user }) => {
  const initialPaymentData: Payment = {
    id_payment: '',
    method: {
      id_method_payment: '',
      method: '',
      quantity_installments: 1,
      fees_per_installment: 0,
      quantity_installment_to_tax: 0,
    },
    value: 0,
    currency: {
      id_currency: '',
      currency: '',
      relation_to_dolar: 1,
    },
    conversion_value: 0,
    promo_code: '',
  };

  const [paymentData, setPaymentData] = useState<Payment>(initialPaymentData);
  const [methods, setMethods] = useState<MethodPayment[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [currentCost, setCurrentCost] = useState(Number(cost));

  useEffect(() => {
    // Carregar os métodos de pagamento da API
    http.get<MethodPayment[]>('/method-payment').then(response => {
      setMethods(response.data);
    });

    // Carregar as moedas do banco de dados
    http.get<Currency[]>('/currency').then(response => {
      setCurrencies(response.data);
    });
  }, []); // Executar apenas uma vez ao montar o componente


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    if (name === 'id_currency') {
      const selectedCurrency = currencies.find(currency => currency.currency === value);
      if (selectedCurrency) {
        setCurrentCost((Number(cost) * selectedCurrency.relation_to_dolar));
        setPaymentData(prevState => ({
          ...prevState,
          currency: selectedCurrency,
        }));
      }
    }
    if (name === 'id_method_payment') {
      const selectedMethod = methods.find(method => method.method === value);
      if (selectedMethod) {
        setPaymentData(prevState => ({
          ...prevState,
          method: selectedMethod,
        }));
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let totalValue = Number(currentCost);
    let hasPromoCode: PromoCode | null | void = null;
    try {
      if (promoCode.length > 0) {
        hasPromoCode = await http.get<PromoCode>('/promo-code/code/' + promoCode).then(data => {
          if (data.data) {
            totalValue -= (Number(currentCost) * (data.data.percentage / 100));
            alert('Você economizou ' + (data.data.percentage) + '% nessa compra.');
          }
          return data.data;
        }).catch(e => console.log(e));
      }
    }
    finally {
      const data = paymentData;
      data.value = totalValue;
      data.conversion_value = totalValue / data.currency.relation_to_dolar;
      console.log(data);
      const payment = await http.post<Payment>('payment', {
        id_method_payment: data.method.id_method_payment,
        value: data.value,
        id_currency: data.currency.id_currency,
        conversion_value: data.conversion_value,
        id_promo_code: hasPromoCode?.id_promo_code
      }).then(data => data.data);

      const user_movie = await http.post('user/movie', {
        id_user,
        id_movie,
        id_payment: payment.id_payment
      });
      alert('Pagamento feito com sucesso.');
      onClose(); // Fechar o modal após o envio dos dados
    }
  };

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
      <div className={styles.modalContent}>
        <h2>Pagamento: {String(currentCost)}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="method">Método de Pagamento:</label>
            <select
              id="id_method_payment"
              name="id_method_payment"
              value={paymentData.method.method}
              onChange={handleChange}
            >
              <option value="">Selecione o método de pagamento</option>
              {methods.map(method => (
                <option key={method.id_method_payment} value={method.method}>
                  {method.method}
                </option>
              ))}
            </select>
          </div>
          {paymentData.method.quantity_installments > 1 && <div className={styles.formGroup}>
            <label htmlFor="quantity_installments">Quantidade de Parcelas:</label>
            <input
              type="number"
              id="quantity_installments"
              name="quantity_installments"
              value={paymentData.method.quantity_installments}
              onChange={handleChange}
            />
          </div>}
          <div className={styles.formGroup}>
            <label htmlFor="promo_code">Código Promocional:</label>
            <input
              type="text"
              id="promo_code"
              name="promo_code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="id_currency">Moeda:</label>
            <select
              id="id_currency"
              name="id_currency"
              value={paymentData.currency.currency}
              onChange={handleChange}
            >
              <option value="">Selecione a moeda</option>
              {currencies.map(currency => (
                <option key={currency.id_currency} value={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </div>
          {/* Adicione os demais campos conforme necessário */}
          <button type="submit">Confirmar Pagamento</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
