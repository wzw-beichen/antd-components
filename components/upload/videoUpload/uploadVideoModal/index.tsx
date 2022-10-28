import React, { Fragment, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "antd";
import { uploadButton } from "../constant";
import UploadVideoForm, { UploadVideoFormRef } from "./UploadVideoForm";
import { UploadVideoValues } from "./type";
import styles from "./index.less";

export type UploadVideoModalProps = {
  needBtn?: boolean;
  /** 返回true则关闭弹窗 */
  onOk: (values: UploadVideoValues) => boolean | void;
};

const UploadVideoModal = React.forwardRef(
  (props: UploadVideoModalProps, ref) => {
    const { needBtn = true, onOk } = props;
    const [visible, setVisible] = useState(false);
    const uploadVideoFormRef = useRef<UploadVideoFormRef | null>(null);

    useImperativeHandle(ref, () => {
      return {
        setVisible,
      };
    });

    const handleShowModal = () => {
      setVisible(true);
    };

    const handleCancel = () => {
      setVisible(false);
    };

    const handleOk = async () => {
      if (uploadVideoFormRef.current) {
        const values = await uploadVideoFormRef.current.form.validateFields();
        const bool = onOk?.(values);
        if (bool) {
          handleCancel();
        }
      }
    };

    const UploadVideoFormProps = {
      ref: uploadVideoFormRef,
      videoMaxSize: 30,
      imageMaxSize: 3,
      visible,
    };
    return (
      <Fragment>
        {needBtn && (
          <div className={styles.upload_wrapped} onClick={handleShowModal}>
            <div className={styles.upload_wrapped_btn}>{uploadButton}</div>
          </div>
        )}
        <Modal
          visible={visible}
          onCancel={handleCancel}
          onOk={handleOk}
          title="上传视频"
          forceRender
        >
          <UploadVideoForm {...UploadVideoFormProps} />
        </Modal>
      </Fragment>
    );
  }
);

export default UploadVideoModal;
