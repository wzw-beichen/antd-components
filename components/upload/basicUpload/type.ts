import { Merge } from "@/common/type";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { UploadTypeEnum } from "../draggleUpload/type";

export type UploadDefaultProps = {
  /** 单位M */
  maxSize?: number;
  /** 提示 */
  tips?: {
    /** 超过最大值提示，默认有，设置false则不提示 */
    maxSizeTips?: string | boolean;
    /** 图片类型不满足提示，默认有，设置false则不提示 */
    imgTypeTips?: string | boolean;
  };
} & UploadProps;

export type UploadMergeProps = {
  /** 默认multiple(多选)由maxCount来区分，maxCount大于1为多选，等于1为单选，可手动传递multiple覆盖 */
  multiple?: boolean;
  onChange?: (fileList: UploadFile[]) => void;
  value?: UploadFile[];
  beforeUpload?: (
    file: UploadFile,
    limit?: {
      isImg: boolean;
      isThanMaxSize: boolean;
    }
  ) => void;
  fileType?: UploadTypeEnum;
};

export type BasicUploadProps = Merge<UploadDefaultProps, UploadMergeProps>;
