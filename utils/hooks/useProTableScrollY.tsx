import { useEffect, useState, RefObject } from "react";

type ExtraParams = {
  size?: "middle" | "small";
  summary?: (data: Record<string, any>) => React.ReactNode | undefined;
} & Record<string, any>;

/**
 * 此hooks主要用于动态计算ProTable 的scrollY,让表格内容过多时在页面内部滚动
 * @param wrapperRef  包裹ProTable 的容器ref
 * @param extraHeight 额外的高度(表格底部的内容高度 Number类型,默认为72，分页器+下边距)
 * @returns { scrollY, collapsed, setCollapsed }
 */

export const useProTableScrollY = (
  wrapperRef: RefObject<HTMLDivElement>,
  extraHeight?: number | undefined,
  extraParams?: ExtraParams
) => {
  const { size = "small", summary } = extraParams || {};

  const [collapsed, setCollapsed] = useState<boolean>(true); //展开收起控制变量
  const [scrollY, setScrollY] = useState<string>("");

  useEffect(() => {
    setScrollY(getTableScroll({ ref: wrapperRef, extraHeight }));
  }, [collapsed, wrapperRef.current]);

  /**
   * 获取第一个表格的可视化高度
   * @param {number} extraHeight 额外的高度(表格底部的内容高度 Number类型,默认为40)
   * @param {reactRef} ref Table所在的组件的ref
   */
  const getTableScroll = ({
    ref,
    extraHeight,
  }: {
    extraHeight?: number;
    ref?: RefObject<HTMLDivElement>;
  } = {}) => {
    let summaryHeight = 0;
    if (summary) {
      const summaryElement =
        wrapperRef.current?.querySelector(".ant-table-summary");
      summaryHeight = summaryElement?.getBoundingClientRect()?.height || 0;
    }
    const tableExtraHeight = {
      paginationHeight: {
        /** 页器高度+外margin24+8+8 */
        small: 40,
        /** 分页器高度+外margin24+16+16 */
        middle: 56,
      },
      /* ant-pro-table设置的外margin */
      marginBottomHeight: {
        small: 12,
        middle: 16,
      },
    };
    if (typeof extraHeight == "undefined") {
      /** 分页器位置topRight, 分页器初次渲染获取不到 */
      const cardPaddingBottom = 8;
      const paginationElement =
        wrapperRef.current?.querySelector(".ant-pagination");
      extraHeight =
        (paginationElement ? 0 : tableExtraHeight.paginationHeight[size]) +
        tableExtraHeight.marginBottomHeight[size] +
        cardPaddingBottom +
        summaryHeight;
    }
    let tHeader: Element | null = null;
    if (ref?.current) {
      tHeader = ref.current.getElementsByClassName("ant-table-thead")[0];
    } else {
      tHeader = document.getElementsByClassName("ant-table-thead")[0];
    }

    //表格内容距离顶部的距离
    let tHeaderBottom = 0;
    if (tHeader) {
      tHeaderBottom = tHeader.getBoundingClientRect().bottom;
    }

    // 窗体高度-表格内容顶部的高度-表格内容底部的高度
    // let height = document.body.clientHeight - tHeaderBottom - extraHeight
    const height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`;
    // 空数据的时候表格高度保持不变,暂无数据提示文本图片居中
    // if (ref && ref.current) {
    //   const placeholder = ref.current.getElementsByClassName(
    //     'ant-table-placeholder',
    //   )[0] as HTMLDivElement;
    //   if (placeholder) {
    //     const emptyHeight = `calc(100vh - ${
    //       tHeaderBottom + extraHeight + 24 //24: 空数据所占一行 tr的上下padding: 12px
    //     }px)`;
    //     placeholder.style.height = emptyHeight;
    //   }
    // }

    return height;
  };

  return { scrollY, collapsed, setCollapsed };
};
