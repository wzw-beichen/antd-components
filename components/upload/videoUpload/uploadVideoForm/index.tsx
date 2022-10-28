import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Form, Upload } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { FormInstance } from "antd/es/form";
import { dealFileType } from "./utils";
import FormItemExtraHelp from "../formItemExtraHelp";
import { MsgError } from "../../../message";
import BasicUpload from "../../basicUpload";

export interface UploadVideoFormRef {
  form: FormInstance;
}
interface UploadVideoFormProps {
  videoMaxSize?: number;
  imageMaxSize?: number;
  visible: boolean;
}
const UploadVideoForm = forwardRef<UploadVideoFormRef, UploadVideoFormProps>(
  (props, ref) => {
    const { videoMaxSize, imageMaxSize } = props;
    const [form] = Form.useForm();
    const { visible } = props;
    useImperativeHandle(ref, () => ({
      form,
    }));

    useEffect(() => {
      if (visible) {
        form.resetFields();
      }
    }, [visible]);

    const handleVideoBeforeUpload = (
      file: UploadFile,
      limit?: { isThanMaxSize: boolean }
    ) => {
      const { isThanMaxSize } = limit || {};
      if (!isThanMaxSize) {
        MsgError(`视频大小不超过${videoMaxSize}MB`);
      }
      if (!dealFileType(file, "video")) {
        MsgError(`文件类型不匹配!`);
        return false || Upload.LIST_IGNORE;
      }
      return isThanMaxSize || Upload.LIST_IGNORE;
    };

    const GylUploadVideoProps = {
      accept: "video/mp4",
      beforeUpload: handleVideoBeforeUpload,
    };

    return (
      <Form form={form} layout="vertical">
        <FormItemExtraHelp
          label="本地视频"
          name="video"
          rules={[{ required: true, message: "请上传视频" }]}
          extraHelp="视频大小不超过30MB,建议时长9-30秒内，建议宽高比16:9"
        >
          <BasicUpload
            maxCount={1}
            tips={{
              imgTypeTips: false,
            }}
            maxSize={videoMaxSize}
            showUploadList={{
              showPreviewIcon: false,
              showRemoveIcon: true,
            }}
            {...GylUploadVideoProps}
          />
        </FormItemExtraHelp>
        <FormItemExtraHelp
          label="视频封面"
          name="cover"
          rules={[{ required: true, message: "请上传视频封面" }]}
          extraHelp={`建议尺寸：800*800px,支持.jpg,.gif,.png格式，大小不超过${imageMaxSize}MB。`}
        >
          <BasicUpload maxCount={1} maxSize={imageMaxSize} />
        </FormItemExtraHelp>
      </Form>
    );
  }
);

export default UploadVideoForm;
