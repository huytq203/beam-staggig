import { ContentWrapper } from "@components/widgets";
import { Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { ListProgramFilter } from './ListProgramFilter';
import Table from "@douyinfe/semi-ui/lib/es/table/Table";
import { AppPagination } from "@components/shared";
import AppTable from "@components/shared/AppTable/AppTable";
import { title } from "process";
import { ProtectedWrapper } from "@components/widgets/Auth";
import { UserRole } from "@constants/auth.constants";
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';

export const ProgramList = (props: any) => {
    const { Text } = Typography;
    const columns = [
        {
          title: 'STT',
          dataIndex: 'index',
          width: 100,
          render: (name: any, record: any, index: any) => {
            return (
              <Text>
                {/* <span>{StringHelper.indexTable(filter.page, index)}</span> */}
              </Text>
            );
          },
        },
          {
            title: 'Mã chương trình',
            dataIndex: 'code',
            width: 150,
        },
        {
            title: 'Tên chương trình',
            dataIndex: 'name',
            width: 250,
        },
        {
            title: 'Ngân sách',
            dataIndex: 'budget',
            width: 150,
        },
        {
            title: 'Ngân sach đã sử dụng',
            dataIndex: 'usedBudget',    
            width: 200,
        },
        {
            title: 'Tổng số người',
            dataIndex: 'totalPeople',
            width: 150,
        },
        {
            title: 'Tổng số người đã tham gia',
            dataIndex: 'joinedPeople',
            width: 300,
        },
        {
            title: 'Doanh nghiệp',
            dataIndex: 'companyName',
            width: 200,
        },
        {
            title: ' Ngân sách cho một người',
            dataIndex: 'budgetPerPerson',
            width: 200,
        },
        {
            title: 'Hành động',
            width: 250,
            dataIndex: 'id',
            align: 'left' as 'left',
            render: (id: any, record: any) => {
            return (
             <ProtectedWrapper
                allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
              >
            <div className="flex gap-2">
              <IconEdit
                onClick={() => {
                  
               }}
               className="cursor-pointer"
              />
                <IconDelete
                    onClick={() => {
                    // handle delete action
                    }}
                    className="cursor-pointer"/>
            </div>
            </ProtectedWrapper>
        );
      }
        }
    ]
    return (
    <ContentWrapper pageTitle="Quản lý chương trình giới thiệu bạn bè">
        <div className="flex flex-col gap-5">
            <ListProgramFilter/>
            <AppTable
            size="small"
            dataSource={[]}
            columns={columns}
            renderPagination={(e: any) => {
            return (
            <div className="py-2 w-full flex justify-end">
              {/* <AppPagination
                {...data}
                onChange={(e: any) => {
                  setFilter({
                    ...filter,
                    page: e,
                  });
                  refetch();
                }}
              /> */}
            </div>
            );
            }}>
            </AppTable>

        </div>
    </ContentWrapper>
    );
}