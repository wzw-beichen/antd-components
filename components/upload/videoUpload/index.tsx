import React, { useRef, useState, useEffect } from "react";
import { UploadStatusEnum, UploadTypeEnum } from "./constant";
import { UploadFile } from "antd/es/upload/interface";
import {
  UploadVideoModalRef,
  UploadVideoValues,
} from "./uploadVideoModal/type";
import { MsgWarn } from "../../message";
import UploadVideoModal from "./uploadVideoModal";
import DraggleUpload from "../draggleUpload";

type VideoListItem = {
  /** 封面url */
  url: string;
  name: string;
  videoUrl: string;
  uid: string;
  status: UploadStatusEnum;
};

type Props = {
  value?: VideoListItem[];
  onChange?: (value: UploadFile[]) => void;
};

const VideoUpload = (props: Props) => {
  const { value, onChange } = props;
  const [videoList, setVideoList] = useState<VideoListItem[]>([]);
  const videoModalRef = useRef<UploadVideoModalRef | null>(null);

  useEffect(() => {
    setVideoList(value || []);
  }, [value]);

  const handleOk = (values: UploadVideoValues) => {
    const { cover = [], video = [] } = values;
    const firstCoverItem = cover[0];
    const firstVideoItem = video[0];
    const videoObj = {
      ...firstCoverItem,
      videoUrl: firstVideoItem.url,
    };
    if (
      video.some((item) => item.status !== UploadStatusEnum.DONE) ||
      cover.some((item) => item.status !== UploadStatusEnum.DONE)
    ) {
      MsgWarn("请检查上传文件");
      return false;
    }
    const newVideoList = [...videoList, videoObj];
    onChange?.(newVideoList);
    return true;
  };
  return (
    <div style={{ display: "flex" }}>
      <DraggleUpload
        value={value}
        needUpload={false}
        fileType={UploadTypeEnum.Video}
        onChange={onChange}
      />
      <UploadVideoModal onOk={handleOk} ref={videoModalRef} />
    </div>
  );
};

export default VideoUpload;
