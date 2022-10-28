import React, { useRef, useState } from "react";
import { Tooltip, Image } from "antd";
import UploadList from "antd/es/upload/UploadList";
import { UploadFile } from "antd/lib/upload/interface";
import { UploadStatusEnum } from "../basicUpload/constant";
import { SortableElement } from "react-sortable-hoc";
import { CustomSortableElementProps, UploadTypeEnum } from "./type";
import VideoPlayerModal, {
  VideoPlayerModalRef,
} from "../videoUpload/videoPlayerModal";

const SortableItem = SortableElement((props: CustomSortableElementProps) => {
  const { item, fileType = UploadTypeEnum.Image, ...restProps } = props;
  const { status } = item;

  const videoPlayerModalRef = useRef<VideoPlayerModalRef | null>(null);

  const [previewImage, setPreviewImage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  const handlePreview = (file: UploadFile) => {
    if (UploadTypeEnum.Video === fileType) {
      videoPlayerModalRef.current?.setVisible(true);
      return;
    }
    const { url } = file;
    if (url && UploadTypeEnum.Image === fileType) {
      setPreviewImage(url);
      setVisible(true);
    }
  };

  const itemRender = (originNode: React.ReactElement, file: UploadFile) => {
    return (
      <>
        {file.status === UploadStatusEnum.UPLOADING && (
          <div
            className="upload_list_item_thumbnail"
            style={{
              position: "absolute",
              zIndex: 1,
              width: "100%",
              height: "70%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>文件上传中</div>
          </div>
        )}
        {originNode}
      </>
    );
  };

  /** Tooltip下面不加div，Tooltip上传错误不会生效 */
  return (
    <div className="upload_card_wrap">
      <Tooltip title={status === UploadStatusEnum.ERROR && "上传错误"}>
        <div>
          <UploadList
            locale={{ previewFile: "预览图片", removeFile: "删除图片" }}
            showDownloadIcon={false}
            listType="picture-card"
            items={[item]}
            onPreview={handlePreview}
            itemRender={itemRender}
            {...restProps}
          />
        </div>
      </Tooltip>
      {UploadTypeEnum.Image === fileType && (
        <Image
          wrapperStyle={{ display: "none" }}
          src={previewImage}
          preview={{
            visible,
            src: previewImage,
            onVisibleChange: (value) => {
              setVisible(value);
            },
          }}
        />
      )}
      {UploadTypeEnum.Video === fileType && (
        <VideoPlayerModal
          ref={videoPlayerModalRef}
          videoJsOptions={{
            autoplay: true,
            controls: true,
            sources: [
              {
                src: item.videoUrl,
                type: "video/mp4",
              },
            ],
          }}
        />
      )}
    </div>
  );
});

export default SortableItem;
