import React, { FC, useEffect, useState } from "react";
import { Upload, Image } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { BasicUploadProps } from "./type";
import {
  singleMaxCount,
  UploadStatusEnum,
  uploadButton,
  imgType,
  kb,
  uploadDefaultValue,
} from "./constant";
import { MsgError } from "../../message";
import classNames from "classnames";
import { dealFileType } from "./utils";
import "./index.less";

const BasicUpload: FC<BasicUploadProps> = (props) => {
  const {
    maxCount = uploadDefaultValue.maxCount,
    maxSize = uploadDefaultValue.maxSize,
    accept = "image/*",
    value,
    onChange,
    onRemove,
    beforeUpload,
    tips,
    className,
    fileType,
    ...restProps
  } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  const multiple = maxCount > singleMaxCount;

  useEffect(() => {
    /** value不处理成字符串格式
     * 上传错误的时候无url，uid根据index生成会有问题，
     * uid随机的话就会造成上传uid会一直变化，就会造成图片闪烁，
     * 所以处理图片格式可以写统一图片处理方法，提交或赋值前调用处理一下格式即可。
     */
    setFileList(value || []);
  }, [value]);

  const handleChange = (file: UploadChangeParam) => {
    const { fileList } = file;
    const newFileList = fileList.map((item) => {
      const { status, name, uid, response } = item;
      /** 无originFileObj，会使upload预览失效 */
      if (status === UploadStatusEnum.ERROR) {
        return {
          status,
          name,
          uid,
        };
      }
      if (status === UploadStatusEnum.DONE) {
        const { data, success } = response || {};
        if (success && data) {
          const { url } = data || {};
          return {
            ...item,
            url,
          };
        }
      }
      return item;
    });
    setFileList(newFileList);
    onChange?.(newFileList);
  };

  const handlePreview = (file: UploadFile) => {
    const { url } = file;
    if (url) {
      setPreviewImage(url);
      setVisible(true);
    }
  };

  const handleRemove = (file: UploadFile) => {
    /** 根据返回值判断是否删除，返回false（不删除），true（删除），默认可以删除 */
    if (onRemove) {
      return onRemove?.(file) as boolean | void | Promise<boolean | void>;
    }
  };

  const handleBeforeUpload = (file: UploadFile) => {
    const { size = 0 } = file;
    const isImg = dealFileType(file, fileType);
    const isThanMaxSize = size / kb / kb < maxSize;
    const { imgTypeTips = true, maxSizeTips = true } = tips || {};
    if (!isImg && imgTypeTips) {
      const isString = typeof imgTypeTips === "string";
      MsgError(isString ? imgTypeTips : "文件类型不匹配");
    }
    if (!isThanMaxSize && maxSizeTips) {
      const isString = typeof maxSizeTips === "string";
      MsgError(isString ? maxSizeTips : `图片大小不超过${maxSize}MB!`);
    }
    /** 自定义处理 */
    if (beforeUpload) {
      return beforeUpload(file, {
        isImg,
        isThanMaxSize,
      }) as string | boolean | void;
    }
    return (isImg && isThanMaxSize) || Upload.LIST_IGNORE;
  };

  return (
    <>
      <Upload
        withCredentials
        listType="picture-card"
        className={classNames(
          className,
          /** showUploadList设为false, maxCount超过却没有隐藏上传，用css隐藏 */
          fileList.length >= maxCount && multiple
            ? "upload_count_exceed"
            : "avatar-uploader"
        )}
        accept={accept}
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        multiple={multiple}
        maxCount={maxCount}
        {...restProps}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
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
    </>
  );
};

export default BasicUpload;
