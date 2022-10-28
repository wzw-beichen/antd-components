import { UploadFile } from "antd/es/upload/interface";

// 处理 边界数量问题
export const dealFileType = (
  file: UploadFile,
  fileType = "image",
  /** 自定义上传格式验证 */
  acceptType: string[] = []
) => {
  const imgTypeListMap = {
    image: ["jpg", "jpeg", "png", "gif"],
    video: ["mp4", "mov", "mpg", "mpeg", "wmv", "avi", "flv"],
    excel: ["xls", "xlsx", "csv", "xlt"],
  };
  let fitUploadType = true;
  const fileName = file.name.toLowerCase();
  const fType = fileName
    .substring(fileName.lastIndexOf("."), fileName.length)
    .replace(".", "");
  const acceptTypeList = acceptType.length
    ? acceptType
    : imgTypeListMap[fileType] ?? [];
  fitUploadType = acceptTypeList.includes(fType);

  return fitUploadType;
};
