import { Modal } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { FeePolicyPickerList } from './temps/FeePolicyPickerList';

export const FeePolicyPickerModal = (props: any) => {
  const { isOpen, onSubmit, onCancel, templateType } = props;

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (!isOpen) setSelectedTemplate(null);
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      width={'80%'}
      bodyStyle={{
        overflow: 'auto',
      }}
      onOk={() => onSubmit(selectedTemplate)}
      onCancel={onCancel}
    >
      <FeePolicyPickerList
        templateType={templateType}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
      />
    </Modal>
  );
};
