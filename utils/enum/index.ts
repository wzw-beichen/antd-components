type CommonRecord = Record<string, any>;

/**
 * @description 枚举转数组
 * @param enumData 需要转换的枚举
 * @param data 处理成相应的格式 默认label,value
 * @returns 对应格式的数组
 * 需要特别注意点 假如枚举的值为number类型，枚举有顺序，转换出来的数组始终根据value大小进行排序。
 * SuitEnum {'是' = 1, '否' = 0 }  ==> 转换出来 [{ label: '否', value: 0 }, {label = '是', value = 1 }]
}
 * @example enum SuitEnum { '非套装','套装' } ==> [{ label: '非套装', value: 0 }, { label: '套装', value: 1 }]
 */
export const enumTransformArray = <
  T extends CommonRecord = { label: string; value: number }
>(
  enumData: CommonRecord,
  data?: {
    label?: string;
    value?: string;
  }
) => {
  const { label = "label", value = "value" } = data || {};
  /** 注意点: 枚举会把value为number类型 key,value互换，string类型则不会 */
  const enumKeys = Object.keys(enumData);
  const enumArr = enumKeys.reduce((arr: T[], key) => {
    const values = enumData[key];
    const val = enumData[values];
    if (values) {
      /** 全是数字类型, val可能刚好数字为0 */
      if (val || val === 0) {
        if (typeof values === "string" && typeof val === "number") {
          arr.push({
            [label]: values,
            [value]: val,
          } as T);
        }
      } else {
        arr.push({
          [label]: key,
          [value]: values,
        } as T);
      }
    }
    return arr;
  }, []);
  return enumArr;
};
