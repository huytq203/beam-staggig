import React, { useState } from 'react'
import { Modal, Button } from '@douyinfe/semi-ui'

interface ConfirmModalProps {
  title?: string
  content?: string
  onConfirm?: any
  onOpen?: any
  onClose?: any
}

const ConfirmModal = (ConfirmModalProps: ConfirmModalProps) => {
  const { title, content, onConfirm, onOpen, onClose } = ConfirmModalProps

  const handleConfirm = () => {
    onConfirm()
  }
  const handleCancel = () => {
    onClose(false)
  }
  return (
    <>
      <Modal
        title={<div className="text-red-500">{title}</div>}
        visible={onOpen}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText={'Confirm'}
        cancelText={'Cancel'}
      >
        <div>{content}</div>
      </Modal>
    </>
  )
}

export default ConfirmModal
