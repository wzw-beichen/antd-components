import { Merge } from '@/common/type';
import { UploadFile } from 'antd/lib/upload/interface';
import {
  SortableContainerProps,
  SortableElementProps,
} from 'react-sortable-hoc';

import { BasicUploadProps } from '../basicUpload/type';

export enum UploadTypeEnum {
  Video = 'video',
  Image = 'image',
  Excel = 'excel',
}

export type DraggleUploadProps<T = any> = Merge<
  BasicUploadProps,
  {
    onRemove?: (file: UploadFile<T>) => void | boolean;
    /** 是否需要上传组件，默认为true */
    needUpload?: boolean;
  }
>;

export type CustomSortableElementProps<T = any> = SortableElementProps &
  DraggleUploadProps & {
    item: UploadFile<T> & {
      videoUrl?: string;
    };
  };

export type CustomSortableContainerProps<T = any> = DraggleUploadProps &
  SortableContainerProps & {
    items: UploadFile<T>[];
  };
