import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import BasicUpload from '../basicUpload';
import { CustomSortableContainerProps } from './type';
import SortableItem from './SortableItem';

export const SortableList = SortableContainer(
  (params: CustomSortableContainerProps) => {
    const { items = [], needUpload = true, ...restProps } = params;
    return (
      <div className="custom_upload_wrapper">
        {items.map((item, index) => (
          <SortableItem
            key={`${item.uid}`}
            index={index}
            item={item}
            {...restProps}
          />
        ))}
        {needUpload && <BasicUpload showUploadList={false} {...restProps} />}
      </div>
    );
  },
);
