import { axiosInstance } from '../api/axiosInstance';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { LuckyBoxAPIs } from './apis';

export class LuckyBoxService {
  static async getAll(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.USER_JOIN_EVENTS}?${params}`
    );
    return x?.data?.data;
  }

  static async getUserCheckedin(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.USER_CHECKED_IN}?${params}`
    );
    return x?.data?.data;
  }

  static async getUserCheckedinDetial(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.USER_CHECKED_IN}/detail?${params}`
    );
    return x?.data?.data;
  }
  static async getUserProcedure(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(`${LuckyBoxAPIs.PROCEDURE}?${params}`);
    return x?.data?.data;
  }
  static async getUserTransactions(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.USER_TRANSACTIONS}?${params}`
    );
    return x?.data?.data;
  }

  static async getAllBuget(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(`${LuckyBoxAPIs.PRIZE}?${params}`);
    return x?.data?.data;
  }

  static async getAllBugetDetail(id: any) {
    const x = await axiosInstance.get(`${LuckyBoxAPIs.PRIZE}/${id}`);
    return x?.data?.data;
  }

  static addOrUpdateBuget(data: any) {
    const addBuget = async (data: any) => {
      const x = await axiosInstance.post(`${LuckyBoxAPIs.PRIZE}`, data);
      return x?.data;
    };

    const updateBuget = async (data: any) => {
      const x = await axiosInstance.put(`${LuckyBoxAPIs.PRIZE}`, data);
      return x?.data;
    };

    if (data?.id) {
      return updateBuget(data);
    }
    return addBuget(data);
  }

  static async getAllReward(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(`${LuckyBoxAPIs.REWARD}?${params}`);
    return x?.data?.data;
  }

  static async getTotalReward(data: any) {
    const x = await axiosInstance.post(`${LuckyBoxAPIs.REWARD}/total`, data);
    return x?.data?.data;
  }
  static async getTotalRewardDiscount(data: any) {
    const x = await axiosInstance.post(
      `${LuckyBoxAPIs.REWARD}/total/voucher`,
      data
    );
    return x?.data?.data;
  }

  static async getAllPrize(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(`${LuckyBoxAPIs.ALL_PRIZE}?${params}`);
    return x?.data?.data;
  }

  static async getAllFriendInvitation(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.FRIEND_INVITATION}?${params}`
    );
    return x?.data?.data;
  }

  static async exportBonusPhoneCard(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.REWARD}/exports/phone-card-reward?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }

  static async exportBonusShoppingCard(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.REWARD}/exports/shopping-card-reward?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }

  static async exportBonusVoucherDiscount(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.REWARD}/exports/voucher-discount?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }

  static async exportBonusCash(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.REWARD}/exports/cash-reward?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }
  static async importPhoneCardReward(data: any) {
    const x = await axiosInstance.post(
      `${LuckyBoxAPIs.REWARD_IMPORT}/phone-card-reward`,
      data,
      {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      }
    );
    return x;
  }
  static async importShoppingCardReward(data: any) {
    const x = await axiosInstance.post(
      `${LuckyBoxAPIs.REWARD_IMPORT}/shopping-card-reward`,
      data,
      {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      }
    );
    return x;
  }
  static async importCashReward(data: any) {
    const x = await axiosInstance.post(
      `${LuckyBoxAPIs.REWARD_IMPORT}/cash-reward`,
      data,
      {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      }
    );
    return x;
  }
  static async exportUserTransaction(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.LUCKY_BOX_STATS_EXPORT}/user-transactions?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }
  static async exportUserJoinEvents(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.LUCKY_BOX_STATS_EXPORT}/user-join-events?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }
  static async exportUserCheckedIn(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.LUCKY_BOX_STATS_EXPORT}/user-checked-in?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }
  static async exportFriendInvitation(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.LUCKY_BOX_STATS_EXPORT}/friend-invitation?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }
  static async exportProcedure(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.LUCKY_BOX_STATS_EXPORT}/completed-step?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }
  static async exportReward(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.LUCKY_BOX_STATS_EXPORT}/all-prizes?${params}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    return x?.data;
  }
  static async getAllRewardUploadLogs(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${LuckyBoxAPIs.REWARD}/reward-upload-logs?${params}`
    );
    return x?.data?.data;
  }
}
