import React, {
  FC,
  forwardRef,
  Fragment,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import { Modal } from "antd";
import VideoPlayer from "../videoPlayer";
import styles from "./index.less";

interface VideoPlayerModalProps {
  children?: ReactNode;
  videoJsOptions: any;
}

export type VideoPlayerModalRef = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const VideoPlayerModal = forwardRef<VideoPlayerModalRef, VideoPlayerModalProps>(
  (props, ref) => {
    const [visible, setVisible] = useState<boolean>(false);

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
    return (
      <Fragment>
        {props.children && (
          <span onClick={handleShowModal}>{props.children}</span>
        )}

        {visible && (
          <Modal
            title={null}
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            width={650}
            wrapClassName={styles.videoPlayerModal}
          >
            <div style={{ width: 600 }}>
              <VideoPlayer {...props.videoJsOptions} />
            </div>
          </Modal>
        )}
      </Fragment>
    );
  }
);

export default VideoPlayerModal;
