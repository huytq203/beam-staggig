import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { OverviewFilter } from './OverviewFilter';
import { LuckyBoxService } from '@services/lucky-box';
import {
  listChallengeTypeName,
  listNameLuckyBox,
} from '@constants/listNameLuckyBox.constants';
export const OverviewList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.ACCOUNTANT,
  ]);
  const { Text } = Typography;

  const [filter, setFilter] = useState<any>({
    rewardType: '',
    challengeType: '',
    startTime: '',
    endTime: '',
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['user-buget', filter],
    () => LuckyBoxService.getAllPrize(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  const convertName = (name: any) => {
    const listName: any = listNameLuckyBox;

    if (!listName[name]) return name;

    return listName[name];
  };

  const convertNameChallengeType = (name: any) => {
    const listName: any = listChallengeTypeName;

    if (!listName[name]) return name;

    return listName[name];
  };

  const exceptValue = ['COMMON_LUCKY_BOX', 'GOLDEN_LUCKY_BOX'];

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      render: (name: any, record: any, index: any) => {
        return (
          <Text>
            <span>{StringHelper.indexTable(filter.page, index)}</span>
          </Text>
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'employeeName',
      width: 280,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Nhiệm vụ',
      dataIndex: 'challengeType',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return (
          <p className="beam-break-world">{`${convertNameChallengeType(
            e
          )} - Nhiệm vụ ${record?.level + 1}`}</p>
        );
      },
    },
    {
      title: 'Chi tiết nhiệm vụ',
      dataIndex: 'conditionDescription',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{`${e} `}</p>;
      },
    },
    {
      title: 'Thời gian hoàn thành',
      dataIndex: 'doneAt',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Hành động nhận thưởng',
      dataIndex: 'action',
      width: 250,
      render: (e: any) => {
        let label = '';
        switch (e) {
          case 'DRAW_LUCKY':
            label = 'Mở hộp quà';
            break;
          case 'CLAIM_PRIZE':
            label = 'Hoàn thành nhiệm vụ';
            break;
        }
        return <p className="beam-break-world">{label}</p>;
      },
    },
    {
      title: 'Giải thưởng',
      dataIndex: 'name',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return (
          <p className="beam-break-world">{`${e ? convertName(e) : ''} ${
            record?.value && !exceptValue.includes(e)
              ? ` - ${StringHelper.formatVND(record?.value)}`
              : ''
          }`}</p>
        );
      },
    },

    {
      title: 'Thời gian mở hộp',
      dataIndex: 'createdAt',
      width: 250,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Phần quà',
      dataIndex: 'reward',
      width: 250,
      render: (e: any, record: any, a: any) => {
        let label = convertName(e);
        if (e == 'COMMON_LUCKY_BOX') {
          if (record.prizeCount < 10) {
            label = `0${record.prizeCount} ${label}`;
          } else {
            label = `${record.prizeCount} ${label}`;
          }
        }
        return (
          <p className="beam-break-world">{`${label} ${
            record?.value && !exceptValue.includes(e)
              ? ` - ${StringHelper.formatVND(record?.value)}`
              : ''
          }`}</p>
        );
      },
    },
  ];

  return (
    <ContentWrapper pageTitle="Danh sách nhận thưởng">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <OverviewFilter
            onFilter={setFilter}
            refetch={refetch}
            filter={filter}
          />
        )}

        <AppTable
          size="small"
          // loading={isLoading}
          columns={columns}
          className="beam-break-world"
          dataSource={getTableData()}
          scroll={{ x: 'scroll' }}
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
      </div>
    </ContentWrapper>
  );
};
