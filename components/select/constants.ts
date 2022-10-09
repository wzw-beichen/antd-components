import { CommonSelectProps } from "./type";
import { showMaxTagPlaceholder } from "./utils";

/** 默认多选配置 */
export const defaultMultipleConfig: CommonSelectProps = {
  maxTagCount: "responsive",
  maxTagPlaceholder: showMaxTagPlaceholder,
  showArrow: true,
};
