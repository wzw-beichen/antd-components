export type LabelValueType = { label: string; value: number };

/** 使传递的值变为必选项 */
export type PickRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

/** 使传递的参数在对象中变为可选参数 */
export type PickOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;

/** 除了传递参数 对象中其他key值全部变为可选参数 */
export type OmitOptional<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;

/** 除了传递参数 对象中其他key值全部变为必选参数 */
export type OmitRequired<T, K extends keyof T> = Pick<T, K> &
  Required<Omit<T, K>>;

/** 类似于多个对象合并，后一个类型覆盖前一个类型 */
export type Merge<FirstType, SecondType> = Omit<FirstType, keyof SecondType> &
  SecondType;
