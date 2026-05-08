import { ObjectHelper } from '@helpers/object.helper';
import { axiosInstance } from '../api/axiosInstance';
import { FriendInvitationAPIs } from './apis';
import { ResponseHelpers } from '@helpers/response.helper';

export class FriendInvatationService {
  static async getAllInviter(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/inviters?${params}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getAllInvitedPeople(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/invited-people?${params}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getAllMonthRanking(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/month-ranking?${params}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getAllRewardPaymentMonthReward(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/month-reward?${params}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async acceptEarnReward(id: any) {
    return axiosInstance
      .post(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/month-reward/${id}/accept`,
        id
      )
      .then((x: any) => {
        return x?.data;
      });
  }

  static async rejectEarnReward(id: any) {
    return axiosInstance
      .post(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/month-reward/${id}/reject`,
        id
      )
      .then((x: any) => {
        return x?.data;
      });
  }

  static async getAllRewardPaymentInviterReward(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/inviter-reward?${params}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getAllRewardPaymentInvitedReward(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/invited-reward?${params}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async importBonusMonth(data: any) {
    const x = await axiosInstance.post(
      `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/month-reward`,
      data
    );
    // if (ResponseHelpers.CheckSucessResponse(x)) {
    return x;
    // }
  }
  static async getImportBonusMonthTemplate() {
    const x = await axiosInstance.get(
      `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/month-reward/get-template`
    );
    return x?.data;
  }
  static async importBonusInvited(data: any) {
    const x = await axiosInstance.post(
      `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/invited-reward`,
      data
    );
    // if (ResponseHelpers.CheckSucessResponse(x)) {
    return x;
    // }
  }
  static async getImportBonusInvitedTemplate() {
    const x = await axiosInstance.get(
      `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/invited-reward/get-template`
    );
    return x?.data;
  }
  static async exportBounsInviter(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/inviter-reward/export?${params}`,
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
  static async exportBounsInvited(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/reward-payment-manage/invited-reward/export?${params}`,
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

  static async getAllBudget() {
    return axiosInstance
      .get(`${FriendInvitationAPIs.PRIEND_INVITATION_BUDGET_URL}/`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }
  static async getInvitedProcedure(inviter: any) {
    const params = ObjectHelper.getParamsFilter(inviter);
    return axiosInstance
      .get(
        `${FriendInvitationAPIs.PRIEND_INVITATION_BASE_URL}/inviter/${inviter.phoneNumber}/invited/completed-step?${params}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }
}
