import React, { useEffect, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface';
import { SortableList } from './SortableList';
import { arrayMove, SortEnd } from 'react-sortable-hoc';
import { DraggleUploadProps } from './type';
import './index.less';

const DraggleUpload = (props: DraggleUploadProps) => {
  const { onChange, value, ...restProps } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    /** 可能value为空字符串('') */
    setFileList(value || []);
  }, [value]);

  const handleChange = (file: UploadFile[]) => {
    onChange?.(file);
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    onChange?.(newFileList);
  };

  const onSortEnd = (sort: SortEnd) => {
    const { oldIndex, newIndex } = sort;
    onChange?.(arrayMove(fileList, oldIndex, newIndex));
  };

  return (
    <SortableList
      // 当移动 1 之后再触发排序事件，默认是0，会导致无法触发图片的预览和删除事件
      distance={1}
      items={fileList}
      onSortEnd={onSortEnd}
      axis="xy"
      helperClass="sortable_helper"
      onChange={handleChange}
      onRemove={handleRemove}
      value={value}
      {...restProps}
    />
  );
};

export default DraggleUpload;
