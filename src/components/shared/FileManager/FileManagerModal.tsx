import { useState } from "react";
import { FileManager } from "./FileManager";
import { Modal } from "@douyinfe/semi-ui";

export const FileManagerModal = (props: any) => {
  const { value, onChange, returnUrlOnly, isOpen, onClose, url, urlGet } =
    props;

  const [selected, setSelected] = useState<any>(null);

  const handleOnOk = () => {
    onChange && onChange(returnUrlOnly ? selected?.url : selected);
  };

  return (
    <>
      <Modal
        size="full-width"
        visible={isOpen}
        onOk={handleOnOk}
        onCancel={() => onClose()}
      >
        <FileManager
          url={url}
          urlGet={urlGet}
          onSelect={(file: any) => setSelected(file)}
        />
      </Modal>
    </>
  );
};
