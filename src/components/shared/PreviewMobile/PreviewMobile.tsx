import React, { useState } from 'react';
import styles from './previewMobile.module.scss';
import { Button, Modal } from '@douyinfe/semi-ui';
import { sanitizeRichTextClient } from 'src/lib/sanitize/clientSanitize';

export const PreviewMobile = (props: any) => {
  const { type, content } = props;
  const [visible, setVisible] = useState(false);
  return (
    <div className="mt-3 flex justify-end">
      <Button onClick={() => setVisible(true)}>Xem trước</Button>
      <Modal
        height={1020}
        width={500}
        title="Xem trước"
        visible={visible}
        onCancel={() => setVisible(false)}
        closeOnEsc={true}
        footer={[]}
      >
        <div className={styles.preview}>
          <section className={styles.section}>
            <div className={styles.outside_border}>
              <div className={styles.silencer}></div>
              <div className={styles.volume_up}></div>
              <div className={styles.volume_down}></div>
              <div className={styles.button_on}></div>
              <div className={styles.inside_border}>
                <div className={styles.camera}>
                  <div className={styles.camera_dot}>
                    <div className={styles.camera_dot_2}></div>
                    <div className={styles.camera_dot_3}></div>
                  </div>
                  <div className={styles.camera_speaker}></div>
                </div>

                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: sanitizeRichTextClient(content) }}
                  // style={{
                  //   fontSize: '12.5px',
                  //   fontFamily: 'Nunito, sans-serif',
                  //   textWrap: 'wrap',
                  //   position: 'absolute',
                  //   top: '30px',
                  //   color: '#000',
                  //   width: '322.8px',
                  //   height: '676.8px',
                  //   overflow: 'scroll',
                  //   textIndent: '0',
                  // }}
                />

                <div className={styles.bottom_line}></div>
              </div>
            </div>
          </section>
        </div>
      </Modal>
    </div>
  );
};
