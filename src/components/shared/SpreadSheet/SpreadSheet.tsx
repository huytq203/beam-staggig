import Table from 'rc-table';

export interface SpeardSheetProps {
  columns: any;
  data: [];
}

const SpreadSheet = (props: SpeardSheetProps) => {
  const { data, columns } = props;

  return (
    <div className={'beam-table'}>
      <Table columns={columns} data={data} scroll={{ x: 2000 }} />
    </div>
  );
};

export default SpreadSheet;
