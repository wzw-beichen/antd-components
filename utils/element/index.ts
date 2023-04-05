import { isPlainObject } from "../object";

export type ErrorFields = {
  errors: string[];
  name: string[];
};

export type FormErrorType = {
  errorFields: ErrorFields[];
};

/**
 * @description form 错误滚动到第一个
 * @param className dom节点class
 */
export const errorScrollIntoView = (
  className: string[] | string = ".ant-form-item-has-error"
) => {
  if (Array.isArray(className)) {
    const errorList = className
      .map((item) => {
        const errorList = document.querySelectorAll(item) ?? [];
        return errorList.length ? errorList : undefined;
      })
      .filter(Boolean);
    /** 始终取第一项 */
    const firstListItem = errorList[0] ?? [];
    firstListItem[0]?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
    return;
  }
  const errorList = document.querySelectorAll(className) ?? [];
  errorList[0]?.scrollIntoView({
    block: "center",
    behavior: "smooth",
  });
};

/**
 * @description 常用form错误验证提示和滚动
 */
export const formErrorScrollTips = (
  error: unknown,
  data?: {
    className?: string[] | string;
    msgTips?: string;
  }
) => {
  const { errorFields } = isPlainObject(error)
    ? (error as FormErrorType)
    : ({} as FormErrorType);
  const { className = ".ant-form-item-has-error", msgTips = "请检查数据" } =
    data || {};
  if (errorFields) {
    setTimeout(() => {
      errorScrollIntoView(className);
    });
    MsgWarn(msgTips);
  }
};
