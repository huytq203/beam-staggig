import { axiosInstance } from "../api/axiosInstance";
import { NewsAPIs } from "./apis";

// export class NewsService {
//   static async getAll(filter: any) {
//     const params = new URLSearchParams({
//       title: filter?.name ?? filter?.title ?? "",
//       page: filter?.page ? String(filter.page) : "1",
//       pageSize: filter?.size
//         ? String(filter.size)
//         : filter?.pageSize
//           ? String(filter.pageSize)
//           : "10",
//     }).toString();
//     return axiosInstance
//       .get(`/api/news/pagination?${params}`)
//       .then((x: any) => {
//         return x?.data;
//       });
//   }

//   static addNewArticle(data: any) {
//     const response: any = axiosInstance.post('/api/news', data);
//     return response?.data?.data;
//   }

//   static async getArticle(id: any) {
//     const response = await axiosInstance.get(`/api/news/${id}`);
//     return response?.data;
//   }

//   static async updateArticle(articleId: any, data: any) {
//     return axiosInstance
//       .put(`/api/news/${articleId}`, data)
//       .then((x: any) => {
//         return x?.data;
//       });
//   }

//   static async showNews(id: any) {
//     return axiosInstance
//       .put(`/api/news/${id}/shows`)
//       .then((x: any) => {
//         return x?.data;
//       });
//   }

//   static async hideNews(id: any) {
//     return axiosInstance
//       .put(`/api/news/${id}/hide`)
//       .then((x: any) => {
//         return x?.data;
//       });
//   }

//   static async deleteNews(id: any) {
//     return axiosInstance.delete(`/api/news/${id}`);
//   }

//   static async showIsHotNews(id: any) {
//     return axiosInstance
//       .put(`/api/news/${id}/showsIsHotNew`)
//       .then((x: any) => {
//         return x?.data;
//       });
//   }

//   static async hidesHotNews(id: any) {
//     return axiosInstance
//       .put(`/api/news/${id}/hideIsHotNew`)
//       .then((x: any) => {
//         return x?.data;
//       });
//   }
// }


export class NewsService {
  static async getAll(filter: any) {
    const params = new URLSearchParams({
      ...filter,
      page: filter?.page ? filter?.page : 1,
    }).toString();
    return axiosInstance.get(`${NewsAPIs.ARTICLE}?${params}&sort=createdAt,desc`).then((x: any) => {
      return x?.data?.data;
    });
  }

  static addNewArticle(data: any) {
    const response: any = axiosInstance.post(NewsAPIs.ARTICLE, data);
    return response?.data?.data;
  }

  static async getArticle(id: any) {
    const response = await axiosInstance.get(`${NewsAPIs.ARTICLE}/${id}`);
    return response?.data?.data;
  }

  static async updateArticle(articleId: any, data: any) {
    return axiosInstance
      .put(`${NewsAPIs.ARTICLE}/${articleId}`, data)
      .then((x: any) => {
        return x?.data;
      });
  }

  static async showNews(id: any) {
      return axiosInstance
        .put(`${NewsAPIs.ARTICLE}/${id}/shows`)
        .then((x: any) => {
          return x?.data;
        });
    }

  static async hideNews(id: any) {
      return axiosInstance
        .put(`${NewsAPIs.ARTICLE}/${id}/hide`)
        .then((x: any) => {
          return x?.data;
        });
    }

    static async deleteNews(id: any) {
      return axiosInstance.delete(`${NewsAPIs.ARTICLE}/${id}`);
    }

  static async showIsHotNews(id: any) {
      return axiosInstance
        .put(`${NewsAPIs.ARTICLE}/${id}/showsIsHotNew`)
        .then((x: any) => {
          return x?.data;
        });
    }

  static async hidesHotNews(id: any) {
      return axiosInstance
        .put(`${NewsAPIs.ARTICLE}/${id}/hideIsHotNew`)
        .then((x: any) => {
          return x?.data;
        });
    }
  

}
