import { BoxWrapper } from '@components/widgets';
import { AccountBalance } from './AccountBalance';

export interface CashflowOverviewFilterProps {
  onSubmit?: any;
}

export const CashflowOverviewFilter = (props: CashflowOverviewFilterProps) => {
  return (
    <div>
      <AccountBalance />
    </div>
  );
};
