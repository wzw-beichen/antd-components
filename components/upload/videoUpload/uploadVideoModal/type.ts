import { UploadStatusEnum } from "../constant";

export type VideoInfo = {
  video: string;
  cover?: string;
};

export type UploadVideoItem = {
  url: string;
  uid: string;
  name: string;
  status: UploadStatusEnum;
};

export type UploadVideoValues = {
  cover: UploadVideoItem[];
  video: UploadVideoItem[];
};

export type UploadVideoModalRef = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
