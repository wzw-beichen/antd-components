import React from "react";
import CustomIcon from "../../icon/CustomIcon";
const uploadIconSvg = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 15.8334H17.5V17.5H2.5V15.8334ZM10.8333 4.85669V14.1667H9.16667V4.85669L4.1075 9.91669L2.92917 8.73835L10 1.66669L17.0708 8.73752L15.8925 9.91585L10.8333 4.85835V4.85669Z"
      fill="#636F87"
    />
  </svg>
);

export enum UploadStatusEnum {
  ERROR = "error",
  DONE = "done",
  UPLOADING = "uploading",
}

export const singleMaxCount = 1;

export const uploadButton = (
  <div>
    <CustomIcon component={uploadIconSvg} />
    <div>点击上传</div>
  </div>
);

export const imgType = ["image/jpeg", "image/png", "image/gif"];

/** 1M = 1024kb */
export const kb = 1024;

export const uploadDefaultValue = {
  maxCount: 5,
  maxSize: 2,
};
