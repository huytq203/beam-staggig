import { FunctionBase } from '@helpers/fuction-base.helpers';
import { axiosInstance } from '../api/axiosInstance'
import { PaymentSendingMethodAPIs } from './apis'
import { da } from 'date-fns/locale';

export class PaymentSendingMethodService {

    static async getAll(filter: any) {
        const params = new URLSearchParams(
            FunctionBase.removeUndefinedObjectProperty(filter)
        ).toString();
        const x = await axiosInstance.get(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD}?${params}`);
        return x?.data?.data;
    }
    
    static saveOrUpdatePaymentSendingMethod(data: any) {
        const addPayment = (data: any) => {
            return axiosInstance.post(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD}`, data)
            .then((x:any) => {
                return x?.data;
            })
        }
        const updatePayment = (data: any) => {
            return axiosInstance
              .put(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD}`, data)
              .then((x: any) => {
                return x?.data;
              });
          };
        if (data?.id) {
            return updatePayment(data);
          }
          return addPayment(data);
    }

    static getPayMoneyDefault(id: any) {
        return axiosInstance
          .get(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD}/${id}`)
          .then((x: any) => {
            return x?.data;
          });
      }

      static getPayMoneyMethidDefault(data: any) {
        return axiosInstance
          .get(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD_DEFAULT}`, data)
          .then((x: any) => {
            return x?.data;
          });
      }

      static updatePayMoneyMethidDefault(data: any) {
        return axiosInstance
        .put(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD_DEFAULT}?bankCode=${data}`)
        .then((x: any) => {
          return x?.data;
        });
      } 

      static checkCreatePaymentSendingMethod(data: any) {
        return axiosInstance
        .post(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD}/check`, data)
        .then((x: any) => {
          return x?.data;
        });
      }
      
      static checkUpdatePaymentSendingMethod(data: any) {
        return axiosInstance
        .put(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD}/check`, data)
        .then((x: any) => {
          return x?.data;
        });
      }

      static enableBankUpdatePaymentSendingMethod(bankCode: any, enable: any) {
        return axiosInstance
        .put(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD}/enable-bank?bankCode=${bankCode}&enabled=${enable}`)
        .then((x: any) => {
          return x?.data;
        });
      }

      static getEnableBankPaymentSendingMethod(data: any) {
        return axiosInstance
        .get(`${PaymentSendingMethodAPIs.PAYMENT_SENDING_METHOD}/enable-bank`, data)
        .then((x: any) => {
          return x?.data;
        });
      }
    }