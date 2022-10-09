import { UploadStatusEnum } from "./constant";
import { v4 as uuidv4 } from "uuid";
import { UploadFile } from "antd/es/upload/interface";

/** @description 上传之前图片格式处理
 *  @returns ~{
 *      status: UploadStatusEnum;
 *       url: string;
 *       uid: string;
 *  }[] ===> string
 *  @example [{ url: 'https://1.png', status: 'done', uid: 随机值 }, { url: 'https://2.png', status: 'done', uid: 随机值 }] ===>
 *  'https://1.png,https://2.png'
 */
export const handleUploadImgBeforeSubmit = (
  arr: { url: string }[],
  separator = ","
) => {
  /** 使用filter过滤一下图片上传失败，图片上传失败无url */
  return arr
    .map((item) => item.url)
    .filter(Boolean)
    .join(separator);
};

/** @description 赋值之前图片格式处理
 *  @returns string ===> {
 *      status: UploadStatusEnum;
 *       url: string;
 *       uid: string;
 *  }[]
 *  @example 'https://1.png,https://2.png' ===>
 * [{ url: 'https://1.png', status: 'done', uid: 随机值 }, { url: 'https://2.png', status: 'done', uid: 随机值 }]
 */
export const handleUploadImgBeforeAssigned = (str: string, separator = ",") => {
  if (!str) return [];
  return str.split(separator).map((item) => ({
    status: UploadStatusEnum.DONE,
    url: item,
    uid: uuidv4(),
  }));
};

/**  @description 上传之前video格式处理
 *  @returns '{
 *       videoUrl: 'https://2.png'
 *       url: 'https://1.png';
 *       uid: string;
 *       status: 'done',
 *  }[]'  ===> [{cover: 'https://1.png', 'video': 'https://2.png'}]
 *  @example  [{  videoUrl: 'https://2.png', url: 'https://1.png', status: 'done', uid: 随机值 }]   ===>
 *  [{cover: 'https://1.png', 'video': 'https://2.png'}]
 *
 */
export const handleUploadVideoBeforeSubmit = (
  arr: { videoUrl: string; url: string }[]
) => {
  if (!arr) return "[]";
  const videoList = arr.map((item) => {
    const { url, videoUrl } = item;
    return {
      cover: url,
      video: videoUrl,
    };
  });
  return JSON.stringify(videoList);
};

/** @description 赋值之前video格式处理
 *  @returns '[{cover: 'https://1.png', 'video': 'https://2.png'},
 *  ]' ===> {
 *       videoUrl: 'https://2.png'
 *       url: 'https://1.png';
 *       uid: string;
 *       status: 'done',
 *  }[]
 *  @example '[{cover: 'https://1.png', 'video': 'https://2.png'},
 *  ]'  ===>
 * [{  videoUrl: 'https://2.png', url: 'https://1.png', status: 'done', uid: 随机值 }]
 */
// str {cover: string, video: string}[]
export const handleUploadVideoBeforeAssigned = (str: string) => {
  if (!str) return [];
  const parseStr = str ? JSON.parse(str) : [];
  const arr = Array.isArray(parseStr)
    ? (parseStr as {
        cover: string;
        video: string;
      }[])
    : [];
  const videoList = arr.map((item) => {
    const { cover, video } = item;
    return {
      url: cover,
      videoUrl: video,
      status: UploadStatusEnum.DONE,
      uid: uuidv4(),
    };
  });
  return videoList;
};

/** @description 上传之前图片格式批量处理
 *  @returns Record<string, {
 *      status: UploadStatusEnum;
 *       url: string;
 *       uid: string;
 *  }[]> ===> Record<string, string>
 *  @example { a: [{ url: 'https://1.png', status: 'done', uid: 随机值 }], b: [{ url: 'https://2.png', status: 'done', uid: 随机值 }] } ===>
 *  {a: 'https://1.png', b: 'https://2.png'}
 */
export const batchHandleUploadImgBeforeSubmit = (
  obj: Record<string, { url: string }[]>,
  separator = ","
) => {
  const keys = Object.keys(obj);
  if (!keys.length) return {};
  /** 使用filter过滤一下图片上传失败，图片上传失败无url */
  return Object.keys(obj).reduce((total, current) => {
    const values = obj[current];
    total[current] = handleUploadImgBeforeSubmit(values, separator);
    return total;
  }, {} as Record<string, string>);
};

/** @description 赋值之前图片批量格式处理
 *  @returns Record<string, string> ===> Record<string, {
 *      status: UploadStatusEnum;
 *       url: string;
 *       uid: string;
 *     }[]>
 *  @example {a: 'https://1.png', b: 'https://2.png'} ===>
 *  { a: [{ url: 'https://1.png', status: 'done', uid: 随机值 }], b: [{ url: 'https://2.png', status: 'done', uid: 随机值 }] }
 */
export const batchHandleUploadImgBeforeAssigned = (
  obj: Record<string, string>,
  separator = ","
) => {
  const keys = Object.keys(obj);
  if (!keys.length) return {};
  return keys.reduce(
    (total, key) => {
      const values = obj[key];
      total[key] = handleUploadImgBeforeAssigned(values, separator);
      return total;
    },
    {} as Record<
      string,
      {
        status: UploadStatusEnum;
        url: string;
        uid: string;
      }[]
    >
  );
};

/** @description 提交之前检查图片，文件是否上传完成
 *  @returns Record<string, {
 *      status: UploadStatusEnum;
 *       url: string;
 *     }[]>  ===> boolean
 */
export const batchHandleUploadComplete = (
  obj: Record<
    string,
    {
      status: UploadStatusEnum;
    }[]
  >
) => {
  const keys = Object.keys(obj);
  const bool = keys.every((key) => {
    const values = obj[key] ?? [];
    if (values.length) {
      return values.every((item) => item.status === UploadStatusEnum.DONE);
    }
    return true;
  });
  return bool;
};

// 处理 边界数量问题
export const dealFileType = (file: UploadFile, fileType = "image") => {
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

  fitUploadType = (imgTypeListMap[fileType] ?? []).includes(fType);

  return fitUploadType;
};
