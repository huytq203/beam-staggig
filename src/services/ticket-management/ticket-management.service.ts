import { ResponseHelpers } from '@helpers/response.helper';
import { axiosInstance } from '../api/axiosInstance';
import { TicketAPIs } from './apis';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { ObjectHelper } from '@helpers/object.helper';

export class TicketService {
  static async getAll(filter: any, companyId: any) {
    const params = new URLSearchParams({
      ...filter,
      companyId: companyId,
    }).toString();
    const x = await axiosInstance.get(
      decodeURIComponent(`${TicketAPIs.BASE_TICKET}?${params}`)
    );
    return x?.data?.data;
  }

  static async getAllTicketSalaryAdvance(filter: any, companyId: any) {
    const params = new URLSearchParams({
      ...filter,
      companyId: companyId,
    }).toString();
    const x = await axiosInstance.get(
      decodeURIComponent(
        `${TicketAPIs.BASE_TICKET}/salary-advance-request?${params}`
      )
    );
    return x?.data?.data;
  }

  static async getTicket(id: any) {
    return axiosInstance
      .get(`${TicketAPIs.BASE_TICKET}/${id}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getTicketSalaryAdvance(id: any) {
    return axiosInstance
      .get(`${TicketAPIs.BASE_TICKET}/salary-advance-request/${id}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

    static async rejectTicketInformation(data: any) {
        return axiosInstance
            .post(`${TicketAPIs.BASE_TICKET}/reject`, data)
            .then((x: any) => {
                return x?.data;
            });
    }

    static async doneTicketInformation(id: any) {
        return axiosInstance
            .get(`${TicketAPIs.BASE_TICKET}/done/${id}`)
            .then((x: any) => {
                return x?.data;
            });
    }

  static async doneTicketSalaryAdvance(id: any) {
    return axiosInstance
      .post(`${TicketAPIs.BASE_TICKET}/salary-advance-request/${id}/accept`, id)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async rejectTicketSalaryAdvance(data: any) {
    return axiosInstance
      .post(`${TicketAPIs.BASE_TICKET}/salary-advance-request/reject`, data)
      .then((x: any) => {
        return x?.data;
      });
  }

  static async getAllTicketNewCompany(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.get(
      `${TicketAPIs.TICKET_NEW_COMPANY}?${params}`
    );
    return x?.data?.data;
  }

  static async getTicketNewCompany(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();

    const x = await axiosInstance.get(
      `${TicketAPIs.TICKET_NEW_COMPANY}/detail?${params}`
    );
    return x?.data?.data;
  }

  static async contactTicketCompany(id: any) {
    const x = await axiosInstance.get(
      `${TicketAPIs.TICKET_NEW_COMPANY}/${id}/contact`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async disContactTicketCompany(id: any) {
    const x = await axiosInstance.get(
      `${TicketAPIs.TICKET_NEW_COMPANY}/${id}/dis-contact`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async exportReportTransaction(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${TicketAPIs.TICKET_NEW_COMPANY}/export?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    // if (ResponseHelpers.CheckSucessResponse(x)) {
    return x?.data;
    // }
  }

  static async checkHideFeatureTicket(companyId: any) {
    const x = await axiosInstance.get(
      decodeURIComponent(
        `${TicketAPIs.BASE_TICKET}/company/${companyId}/show/ticket`
      )
    );
    return x?.data?.data;
  }

  static async exportTicketList(filter: any) {
      const params = new URLSearchParams(
          FunctionBase.removeUndefinedObjectProperty(filter)
      ).toString();
      const x = await axiosInstance.get(
          `${TicketAPIs.BASE_TICKET}/exports?${params}`,
          {
              responseType: 'arraybuffer',
              headers: {
                  Accept: 'application/octet-stream',
                  'Content-Type': 'application/json',
              },
          });

        return x?.data;
    }


    static async acceptTicketList(data: any) {
        const x = await axiosInstance.post(`${TicketAPIs.BASE_TICKET}/batch-acceptance`, data)
            .then((x: any) => {
                return x?.data;
            });

        return x?.data;
    }

    static async importTicket(
        file: any,
        companyId: string
    ) {
        const x = await axiosInstance.post(
            `${TicketAPIs.BASE_TICKET}/companies/${companyId}/import`,
            file, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return x;
    }

    static async getLogImportTicket(companyId: any, filter: any) {
        const params = new URLSearchParams({
            ...filter,
            page: filter?.page ? filter?.page : 1,
        }).toString();
        const x = await axiosInstance.get(
            `${TicketAPIs.BASE_TICKET}/companies/${companyId}/ticket-upload-logs?${params}`
        );
        return x?.data?.data;
    }
}
