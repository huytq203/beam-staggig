import {IconListView} from '@douyinfe/semi-icons';
import {Button} from '@douyinfe/semi-ui';


export const AcceptTicketBatchButton = (props: any) => {
    const {setIsOpenUploadFile, setIsSelectBatch} = props;

    const onClickAcceptTicketBatch = async () => {
        setIsOpenUploadFile(false);
        setIsSelectBatch(true)
    };
    return (
        <div>
            <Button
                theme="solid"
                onClick={() => onClickAcceptTicketBatch()}
                icon={<IconListView/>}
            >
                Chọn nhiều yêu cầu
            </Button>
        </div>
    );
};
