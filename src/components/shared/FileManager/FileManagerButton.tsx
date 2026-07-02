import { Button, Modal } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { FileManager } from './FileManager';

export const FileManagerButton = (props: any) => {
  const { onOk, url, urlGet, fileSize, fileType, disabled } = props;
  const [isOpenPicker, setIsOpenPicker] = useState(false);

  const [selected, setSelected] = useState(null);

  const handleOnOk = () => {
    setIsOpenPicker(false);
    onOk && onOk(selected);
  };
  return (
    <>
      {isOpenPicker && (
        <Modal
          size="full-width"
          visible={isOpenPicker}
          onOk={handleOnOk}
          onCancel={() => setIsOpenPicker(false)}
        >
          <FileManager
            onSelect={(file: any) => setSelected(file)}
            url={url}
            urlGet={urlGet}
            fileSize={fileSize}
            fileType={fileType}
            disabled={disabled}
          />
        </Modal>
      )}

      <Button
        size="small"
        onClick={() => setIsOpenPicker(true)}
        disabled={disabled}
      >
        File Manager
      </Button>
    </>
  );
};
