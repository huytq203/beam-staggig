import { ResponseHelpers } from '@helpers/response.helper';
import { axiosInstance } from '../api/axiosInstance';
import { CampaignAPIs } from './apis';

export class CampaignService {
  static async getAll(filter: any = {}) {
    const {
      searchKey = '',
      campaignTypeId = '',
      campaignType = '',
      status = '',
      startTime = '',
      endTime = '',
      page,
      size = '',
      sort = ['createdAt,desc'],
    } = filter;

    const query: any = {
      // FilterCampaignRequestDTO
      searchKey: `${searchKey}`.trim(),
      campaignTypeId: campaignTypeId || campaignType || '',
      status,
      startTime,
      endTime,
      // Pageable (backend page is 0-based, UI filter is 1-based)
      page: page ? Number(page) - 1 : 0,
      size,
      sort,
    };

    const params = new URLSearchParams(query).toString();
    const x = await axiosInstance.get(
      `${CampaignAPIs.ALL_CAMPAIGNS}?${params}`
    );
    return x?.data?.data;
  }

  // Old endpoint: only returns the currently ENABLED campaigns.
  // Used to compare against /campaigns/all so disabled campaigns can be
  // rendered as struck-through / non-clickable.
  static async getEnabled(filter: any = {}) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.get(
      `${CampaignAPIs.BASE_CAMPAIGN}?${params}`
    );
    return x?.data?.data;
  }

  static async getAllCampaignAvailable() {
    return axiosInstance
      .get(`${CampaignAPIs.BASE_CAMPAIGN}/available`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getCampaign(id: any) {
    return axiosInstance
      .get(`${CampaignAPIs.BASE_CAMPAIGN}/${id}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async removeCampaign(id: any) {
    return axiosInstance.delete(`${CampaignAPIs.BASE_CAMPAIGN}/${id}`);
  }

  static async removeCampaignType(id: any) {
    return axiosInstance.delete(`${CampaignAPIs.BASE_CAMPAIGN_TYPES}/${id}`);
  }

  static getCampaignTypes(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(decodeURIComponent(`${CampaignAPIs.BASE_CAMPAIGN_TYPES}?${params}`))
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static getCampaignTypesEnabled(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(
        decodeURIComponent(`${CampaignAPIs.CAMPAIGN_TYPES_ENABLED}?${params}`)
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static checkCampaignHaveCompany(id: any) {
    return axiosInstance
      .post(`${CampaignAPIs.BASE_CAMPAIGN}/${id}/companies`, id)
      .then((x: any) => {
        return x?.data;
      });
  }

  static async getDetailCampaignTypes(id: any) {
    return axiosInstance
      .get(`${CampaignAPIs.BASE_CAMPAIGN_TYPES}/${id}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static disableCampaignType(id: string) {
    return axiosInstance
      .get(`${CampaignAPIs.BASE_CAMPAIGN_TYPES}/${id}/close`)
      .then((x: any) => {
        if (ResponseHelpers.CheckSucessResponse(x)) {
          return x?.data;
        }
      });
  }

  static enableCampaignType(id: string) {
    return axiosInstance
      .get(`${CampaignAPIs.BASE_CAMPAIGN_TYPES}/${id}/open`)
      .then((x: any) => {
        if (ResponseHelpers.CheckSucessResponse(x)) {
          return x?.data;
        }
      });
  }

  static addOrUpdateCampaignType(data: any) {
    const addCampaignType = (data: any) => {
      return axiosInstance
        .post(`${CampaignAPIs.BASE_CAMPAIGN_TYPES}`, data)
        .then((x: any) => {
          return x?.data;
        });
    };

    const updateCampaignType = (data: any) => {
      return axiosInstance
        .put(`${CampaignAPIs.BASE_CAMPAIGN_TYPES}`, data)
        .then((x: any) => {
          return x?.data;
        });
    };

    if (data?.id) {
      return updateCampaignType(data);
    }
    return addCampaignType(data);
  }

  static addOrUpdate(campaignRequest: any) {
    const add = (request: any) => {
      return axiosInstance
        .post(`${CampaignAPIs.BASE_CAMPAIGN}`, campaignRequest)
        .then((x: any) => {
          const response = x?.data;
          if (response) {
            const { code: responseCode, message } = response;
            if (responseCode == 200 && message == 'OK') {
              return true;
            }
          }
          return false;
        });
    };

    const update = (request: any) => {
      return axiosInstance
        .put(`${CampaignAPIs.BASE_CAMPAIGN}`, campaignRequest)
        .then((x: any) => {
          const response = x?.data;
          if (response) {
            const { code: responseCode, message } = response;
            if (responseCode == 200 && message == 'OK') {
              return true;
            }
          }
          return false;
        });
    };
    if (campaignRequest?.id) {
      return update(campaignRequest);
    }
    return add(campaignRequest);
  }
}
