import { AppPagination } from "@components/shared";
import AppTable from "@components/shared/AppTable/AppTable";
import { Divider, Tooltip, Typography,Switch ,Modal, Notification, Popconfirm, Tag} from "@douyinfe/semi-ui";
import { DateTimeHelper } from "@helpers/date-time.helper";
import { NewsService } from "@services/news";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { NewsArticleListFilter } from "./NewsArticleListFilter";
import { id } from "date-fns/locale";
import { ProtectedWrapper } from "@components/widgets/Auth";
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { UserRole } from '@constants/auth.constants';
import { COMMON_FORMAT } from "@constants/common-format";

export const NewsArticleList = () => {
  const { Text } = Typography;
  const baseRoute = `/news/articles`;
  const [selectedArticleId, setSelectedArticleId] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [filter, setFilter] = useState({
    title: "",
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ["news-list", filter],
    () => NewsService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { data: articleDetail, isLoading: isLoadingDetail, error: errorDetail} = useQuery(
    ["news-detail", selectedArticleId],
    () => {
      if (!selectedArticleId) return Promise.reject("No article id");
      return NewsService.getArticle(selectedArticleId);
    },
    {
      enabled: !!selectedArticleId,
      refetchOnWindowFocus: false,
    }
  );

  const onClickHref = (slug: string) => {
    router.push(baseRoute + "/" + slug);
  };

  const openModal = (id: string) => {    
    setSelectedArticleId(id);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticleId(null);
  };


  const onClickisHotNew = (id: string) => {
    const onShows = async(id : any) => {
      const data = await NewsService.showIsHotNews(id);
      return data;
     }

     const onHide = async(id : any) => {
      const data = await NewsService.hidesHotNews(id);
      return data;
     }

     const onProcessStatus = (record: any) => {

      if (record.isHotNew === true) {
        return onHide(record.id);
      } else {
        return onShows(record.id);
      }
      
    };
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        const data = await onProcessStatus(id);
        if (data) {
          Notification.success({
            content: `Thay đổi trạng thái thành công`,
            theme: 'light',
          });
          refetch();
        }
      },
      content:
        'Bạn có chắc chắn muốn chọn bài viết này làm tin nổi bật không?',
    });

  }

  const onClickshowNews = (record: any) => {
     const onShows = async(id : any) => {
      const data = await NewsService.showNews(id);
      return data;
     }

     const onHide = async(id : any) => {
      const data = await NewsService.hideNews(id);
      return data;
     }

     const onProcessStatus = (record: any) => {

      if (record.shows === true) {
        return onHide(record.id);
      } else {
        return onShows(record.id);
      }
      
    };
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        const data = await onProcessStatus(record);
        if (data) {
          Notification.success({
            content: `Thay đổi trạng thái thành công`,
            theme: 'light',
          });
          refetch();
        }
      },
      content:
        'Bạn có chắc chắn muốn chuyển này không?',
    });
  }

  const deleteNews = (id: any) => {
    NewsService.deleteNews(id).then((x: any) => {
        if (x?.data?.code == 200 && x?.data?.message == 'OK') {
          Notification.success({
            content: 'Xóa thành công',
            duration: 2,
            theme: 'light',
          });
          refetch();
        } else {
          Notification.error({
            content: 'Có lỗi xảy ra. Vui lòng thử lại',
            duration: 2,
            theme: 'light',
          });
        }
      });
    };

  const columns = [
    {
    title: "Tiêu đề bài viết",
    dataIndex: "title",
    width: 250,
    render: (name: any, record: any, index: any) => (
      <Tooltip position="top" content={record.title}>
        <p
          className="line-clamp-1 cursor-pointer"
          onClick={() => openModal(record.id)} 
        >
          {name}
        </p>
      </Tooltip>
    ),
  },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 300,
      render: (name: any, record: any, index: any) => (
        <Tooltip position="top" content={name}>
          <p className="line-clamp-1">{name}</p>
        </Tooltip>
      ),
    },
     {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      align: 'left' as 'left',
      render: (x: any) => {
      let label = '';
      let className: any = '';   
        switch (x) {
          case 'ACTIVE':
          label = 'Phát hành';
          className = 'green';
          break;
          case 'DRAFT':
          label = 'Bản nháp';
          className = 'teal';
          break;
        }
          return (
            <Tag size="small" color={className}>
                {label}
            </Tag>
          );
      },
    },
    {
     title: "Tin nổi bật",
     dataIndex: "isHotNew",
     width: 150,
     render: (e: any, record: any) => {
       if (record.status === 'DRAFT') {
         return null; 
        }
      return (
       <Switch
         checked={e === true}
         onChange={() => onClickisHotNew(record)}
       />
      );
      }
    },
    {
      title: "Hiển thị",
      dataIndex: "shows",
      width: 150,
      render: (e: any, record: any) => {
        if (record.status === 'DRAFT') {
         return null;
        }
        return (
         <Switch
          checked={e === true}
          onChange={() => onClickshowNews(record)}
         />
       );
     }
   },
    {
      title: "Tác giả",
      dataIndex: "createdBy",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 250,
      render: (e: any) => <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt", 
      width: 250,
      render: (e: any) => <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
    },
    {
        title: 'Hành động',
        width: 150,
        dataIndex: 'id',
        align: 'left' as 'left',
        render: (id: any, record: any) => {
            return (
              <ProtectedWrapper
                allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN, UserRole.SALE]}
              >
                <div className="flex gap-3 pl-3">
                  <IconEdit
                      onClick={() => router.push(`articles/${id}`)}
                      className="cursor-pointer"
                    />
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa tin tức này không?"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => deleteNews(id)}
                  >
                    <IconDelete
                      className="cursor-pointer"
                      style={{ color: 'var(--semi-color-danger)' }}
                    />
                  </Popconfirm>
                </div>
              </ProtectedWrapper>
            );
    }
  }
  ];

  const getTableData = () => {
    if (!data?.content) return [];
    return data?.content;
  };
  return (
    <>
      <NewsArticleListFilter onFilter={setFilter} />
      <Divider dashed className="my-4" />
      <AppTable
        size="small"
        loading={isLoading}
        columns={columns}
        dataSource={getTableData()}
        renderPagination={(e: any) => {
          return (
            <div className="py-2 w-full flex justify-end">
              <AppPagination
                {...data}
                //  totalElements={data?.pagination?.total ?? 0}
                //  number={(data?.pagination?.page ?? 1) - 1}                                                                                          
                //  size={data?.pagination?.pageSize ?? filter.size}
                //  numberOfElements={data?.data?.length ?? 0}
                onChange={(e: any) => {
                  setFilter({
                    ...filter,
                    page: e,
                  });
                }}
              />
            </div>
          );
        }}
      />
      <Modal
        title="Chi tiết bài viết"
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        {articleDetail && (
          <div className="news-body">
            <div className="text-2xl font-bold mb-4 ">
                {articleDetail.title}   
            </div>
            <div className="md:col-span-4 leading-relaxed break-words overflow-x-auto [&_img]:max-w-full [&_img]:h-auto [&_img]:block [&_img]:my-4 [&_iframe]:max-w-full [&_table]:block [&_table]:w-full">
              <p className="mb-5" dangerouslySetInnerHTML={{ __html: articleDetail.content }}></p>
              <div className="text-right mt-4 mr-5 text-xl text-gray-500 italic">
                  Nguồn: {articleDetail.ref}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
