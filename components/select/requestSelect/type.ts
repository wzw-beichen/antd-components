import { FormInstance } from "antd/es/form";

export type RequestSelectType = {
  relationConfig?: {
    form?: FormInstance;
    /** 接口key值，默认使用relationKey，onlyKey传递则用onlyKey */
    onlyKey?: string;
    relationKey?: string;
    /** 可能上面处理好处理value流下来，不需要通过form去获取关联值 */
    relationValue?: string | number;
    /** 重置的key值，多个用，隔开 */
    resetKey?: string;
  };
};
