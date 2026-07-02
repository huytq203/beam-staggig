import { ReconciliationService } from '@services/reconciliation';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ReconciliationBankFilter from './ReconciliationBankFilter';
import { ReconciliationBankTransactionList } from './ReconciliationBankTransactionList';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';

interface ReconciliationBankTransactionProps {
  bank: string;
}

const ReconciliationBankTransaction = (
  props: ReconciliationBankTransactionProps
) => {
  const { bank } = props;
  const [filter, setFilter] = useState({
    fileSource: bank.toUpperCase(),
    page: 1,
    size: 10,
  });
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['reconciliation-bank-transaction-list', filter],
    () => ReconciliationService.getAllTransactionProcess(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { authCheckByRole } = useAuth();

  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CONTROLLER,
    UserRole.RECONCILER,
    UserRole.ACCOUNTANT,
  ]);
  const [filterTransaction, setFilterTransaction] = useState<any>(1);
  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data) return [];
    return data;
  };
  return (
    <div className="flex flex-col gap-4">
      <ReconciliationBankFilter title="Giao dịch lệch" type={2} />
      <ReconciliationBankTransactionList
        loading={isLoading || isFetching}
        setFilter={setFilter}
        data={getTableData()}
        filter={filter}
        bank={bank}
      />
    </div>
  );
};

export default ReconciliationBankTransaction;
