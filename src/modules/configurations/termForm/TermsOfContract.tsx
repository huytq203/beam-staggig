import AppTable from '@components/shared/AppTable/AppTable';
import { AppPagination } from '@components/shared';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TermFormTypeService } from '@services/termform';
import { useRouter } from 'next/router';
import { TermFormFilter } from './TermFormFilter';

import { 
  Switch,
  Modal,
  Notification,
  Checkbox,
  Button,
 } from '@douyinfe/semi-ui';
import ApplyCompanyTermForm from './AppLyCompanyTermForm';
import { TermsOfContractFilter } from './TermsOfContractFilter';

const TermsOfContract = (props: any) => {

   const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

    const [idTermForm, setIdTermForm] = useState("")
    const [modal, setModal] = useState(false)
    const [isDefault, setIsDefault] = useState(false);
     const [filter, setFilter] = useState({
        name: '',
        page: 1,
        size: 10,
        statusTermForm: 'ALL',
      })

      const { data, isLoading, refetch } = useQuery(
        ['company-type-selection-list', filter],
        () => TermFormTypeService.getlistTermContract(filter)
      );

      
      const router = useRouter();
      const getTableData = () => {
        if (isLoading || !data?.content) return [];
        return data?.content;
      };

      const onClickAction = (record: any) => {
        const onDisable = async (id: any) => {
          const data = await TermFormTypeService.deactivateTermForm(id);
          return data;
        };
    
        const onEnable = async (id: any) => {
          const data = await TermFormTypeService.activateTermForm(id);
          return data;
        };
    
        const onProcessStatus = (record: any) => {
          
          if (record.statusTermForm === 'ON') {
            return onDisable(record.id);
          } else {
            return onEnable(record.id);
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
            'Bạn có chắc chắn muốn chuyển trạng thái biểu mẫu điều khoản này không?',
        });
      };

      const onSelectedRowKeysChange = (keys: any) => {
        setSelectedRowKeys(keys);

        
     };
      const  handleUpdateAndApply  = () => {
            const requestObject = {     
               idTermForm: idTermForm,
               companyIds: selectedRowKeys,
            };
            TermFormTypeService.addOrUpdate(requestObject)
            .then((response: any) => {
              
              if (response === true) {
                Notification.success({
                  title: 'Thành công',
                  content: 'Áp dụng biểu mẫu điều khoản thành công!',
                  duration: 3,
                  theme: 'light',
                });
                setModal(false);
              } else {
                Notification.error({
                  title: 'Error',
                  content: 'Áp dụng không thành công!',
                  duration: 3,
                  theme: 'light',
                });
              }
            })
      }
     
      const onClickEndUser = (record : any) => {
        const onDisable = async (id: any) => {
          const data = await TermFormTypeService.deactivateEndUser(id);
          return data;
        };
        const onEnable = async (id: any) => {
          const data = await TermFormTypeService.activateEndUser(id);
          return data;
        };

        const modalContent = record.endUser === true 
        ? 'Bạn có chắc chắn muốn bỏ chọn không?' 
        : 'Bạn có chắc chắn muốn chọn end user không?'; 

        const onProcessStatus = (record: any) => {
          if (record.endUser === true) {
            return onDisable(record.id);
          } else {
            return onEnable(record.id);
          }
          }
          Modal.confirm({
            title: 'Xác nhận hành động',
            cancelText: 'Huỷ',
            okText: 'Thực hiện',
            onOk: async () => {
              const data = await onProcessStatus(record);
              if (data) {
                Notification.success({
                  content: `Cập nhật thành công`,
                  theme: 'light',
                });
                refetch();
              }
            },
            content: modalContent
          });
        }

        const onClose = () => {
          setModal(false);
      };

      const openModal = (id: any, isDefault:any) => {
           setModal(true)
           setIdTermForm(id)
           setIsDefault(isDefault);
      }
       const onFilter = (values: any) => {
        setFilter(values);
    
      }

      const footer = (
        <div style={{ textAlign: 'center' }}>
          {!isDefault && (
            <Button type="primary" htmlType='submit' onClick={() => handleUpdateAndApply()}>
              Cập nhật và áp dụng
            </Button>
          )}
        </div>
      );

      const columns = [
        {
          title: 'Tên biểu mẫu',
          dataIndex: 'name',
          width: 400,        
        },
        {
          title: 'Loại điều khoản',
          dataIndex: 'type',
          width: 400,

          render: (x: any) => {
            let label = ''
            switch (x) {
                case 'PRIVACY_POLICY':
                  label = 'Chính sách bảo mật';
                  break;
                case 'TERMS_OF_USE':
                  label = 'Điều khoản sử dụng';
                  break;
                case 'PERSONAL_DATA_PROTECTION_POLICY':
                  label = 'Chính sách bảo vệ dữ liệu cá nhân';
                  break;
                case 'AGREEMENT_TO_USE_THE_SERVICE':
                  label = 'Thoản thuận sử dụng dịch vụ ứng lương';
                  break;
                }
                return (
                  <div>{label}</div>
                );
              },
        },
        {
          title: 'Cấu hình',
          dataIndex: 'isDefault',
          width: 200,      
          render: (isDefault: boolean) => isDefault ? 'Mặc định' : ''  
        },
        {
            title: 'Người nhận thông tin',
            children: [
              {
                title: 'End user',
                dataIndex: 'endUser',
                width: 200,
                render : (e: any, record: any) => (
                  <Checkbox
                  checked = {e}
                  onChange={() => onClickEndUser(record)}
                  />
                )
              },
              {
                title: 'Doanh nghiệp',
                width: 200,
                render : (e: any, record: any) => {
                  return (
                    <Button onClick={() => openModal(record.id, record.isDefault)}>
                    Xem chi tiết
                    </Button>
                    
                  )
                }    
              },
            ],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusTermForm',
            width: 250,
            render: (e: any, record: any) => (
                <Switch
                  checked={e === 'ON'}
                  onChange={() => onClickAction(record)}
                />
            ),
        }
      ]

return(
    <div className="flex flex-col gap-4"> 
       <TermsOfContractFilter onFilter ={onFilter} />
       <AppTable
         size="small"
         scroll={{ y: 400 }}
         columns={columns}
         dataSource={getTableData()}
         renderPagination={(e: any) => {
           return (
             <div className="py-2 w-full flex justify-end">
               <AppPagination
                  {...data}
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
        width={800}
        size= "small"
        visible={modal}
        onCancel={onClose}
        footer = {footer}
        >
          <ApplyCompanyTermForm
          onSelectedRowKeysChange = {onSelectedRowKeysChange}
          companyId = {idTermForm}
          isDefault={isDefault}
          />
       </Modal>
       </div>
)
}
 export default TermsOfContract;


    