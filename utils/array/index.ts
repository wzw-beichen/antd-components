import { omitObjectSomeKeys } from "../object";

/**
 * @description 数组位置对换
 * @param array 需要位置对换的数组
 * @param oldIndex 原有Index
 * @param newIndex 对换位置Index
 * @return newArray 新数组
 * @example const data = [1,2,3,4,5] ===> arrayExchange(data, 1, 2) => [1,3,2,4,5]
 */
export const arrayExchange = <T>(
  array: T[],
  oldIndex: number,
  newIndex: number
): T[] => {
  if (oldIndex < 0 || newIndex > array.length - 1) {
    return array;
  }
  const temp = array[oldIndex];
  array[oldIndex] = array[newIndex];
  array[newIndex] = temp;
  return array;
};

/**
 * @description 将数组对象转换成tree树形结构
 * @param flatData 需要转换成tree树形结构的数组
 * @param config 转换成对应tree树形结构的配置
 * @return 树形结构数组
 * @example const data = [{ parentId: 0, id: 1, name: '顶级组织' },{ parentId: 1, id: 2, name: '组织1' }, { parentId: 2, id: 3, name: '组织2' }]
 *  ===> convertToTree(data) => [{ parentId: 0, id: 1, name: '顶级组织', children: [{ parentId: 1, id: 2, name: '组织1', children: [{ parentId: 2, id: 3, name: '组织2' }]}]}]
 */
export const convertToTree = <
  T extends Record<string, any> & { children?: T[] }
>(
  flatData: T[],
  config?: {
    parentId?: number;
    idKey?: string;
    parentKey?: string;
    renderNode?: (data: T) => Record<string, any>;
  }
) => {
  const {
    parentId,
    idKey = "id",
    renderNode,
    parentKey = "parentId",
  } = config || {};
  const children = flatData.filter((node) => node[parentKey] === parentId);
  if (!children.length) {
    return [];
  }
  return children.map((node) => {
    const nodeChildren = convertToTree(flatData, {
      ...config,
      parentId: node[idKey],
    });
    if (nodeChildren.length) {
      node.children = nodeChildren;
    }
    return {
      ...node,
      ...renderNode?.(node),
    };
  });
};

/**
 * @description 将tree树形结构转换成铺平的数组对象
 * @param flatData 需要转换成铺平的数组对象的tree树形数组
 * @param config 转换成对应铺平的数组对象的配置
 * @return 铺平的数组对象
 * @example const data = [{ parentId: 0, id: 1, name: '顶级组织', children: [{ parentId: 1, id: 2, name: '组织1', children: [{ parentId: 2, id: 3, name: '组织2' }]}]}]
 *  ===> arrayFlat(data) => [{ parentId: 0, id: 1, name: '顶级组织' },{ parentId: 1, id: 2, name: '组织1' }, { parentId: 2, id: 3, name: '组织2' }]
 * @example const data = [{ parentId: 0, id: 1, name: '顶级组织', children: [{ parentId: 1, id: 2, name: '组织1', children: [{ parentId: 2, id: 3, name: '组织2' }]}]}, { parentId: 0, id: 1111, name: '顶级组织2',}]
 *  ===> arrayFlat(data) => [{ parentId: 0, id: 1, name: '顶级组织' }, { parentId: 1, id: 2, name: '组织1' }, { parentId: 2, id: 3, name: '组织2' }, { parentId: 0, id: 1111, name: '顶级组织2' }]
 */
export const arrayFlat = <T extends Record<string, any> & { children?: T[] }>(
  flatData: T[],
  config?: {
    childrenKey?: string;
  }
) => {
  const { childrenKey = "children" } = config || {};
  return flatData.reduce((total, item) => {
    const children = item[childrenKey];
    const otherKey = omitObjectSomeKeys(item, childrenKey);
    return children?.length
      ? [...total, otherKey, ...arrayFlat(children, config)]
      : [...total, otherKey];
  }, [] as T[]);
};

/**
 * @description 对应sortKey进行数组排序
 * @param arrayData 需要进行排序的数组
 * @param config { sortKey?: string; order?: "ascend" | "descend" } 进行排序的数组的配置
 * @return 排序之后的数组
 * @example const data = [{ parentId: 0, id: 1, name: '顶级组织' }, { parentId: 1, id: 2, name: '组织1' }, { parentId: 2, id: 3, name: '组织2' }, { parentId: 0, id: 1111, name: '顶级组织2' }]
 *  ===> arraySortKey(data) => [{ parentId: 0, id: 1, name: '顶级组织' }, { parentId: 1, id: 2, name: '组织1' }, { parentId: 2, id: 3, name: '组织2' }, { parentId: 0, id: 1111, name: '顶级组织2' }]
 * @example const data = [{ parentId: 0, id: 1, name: '顶级组织' }, { parentId: 1, id: 2, name: '组织1' }, { parentId: 2, id: 3, name: '组织2' }, { parentId: 0, id: 1111, name: '顶级组织2' }]
 *  ===> arraySortKey(data, { order: 'descend' }) => [{ parentId: 0, id: 1111, name: '顶级组织2' }, { parentId: 2, id: 3, name: '组织2' }, { parentId: 1, id: 2, name: '组织1' }, { parentId: 0, id: 1, name: '顶级组织' }]
 */
export const arraySortKey = <T extends Record<string, any>>(
  arrayData: T[],
  config?: {
    sortKey?: string;
    /** ascend升序 descend降序 */
    order?: "ascend" | "descend";
  }
): T[] => {
  const { sortKey = "id", order = "ascend" } = config || {};
  return arrayData.sort((pre, cur) => {
    if (order === "descend") {
      return cur[sortKey] - pre[sortKey];
    }
    return pre[sortKey] - cur[sortKey];
  });
};

/**
 * @description 取数组某一项，默认取数组最后一项
 * @param array 数组
 * @param pickIndex 取某一项对应下标，可以传负数，传负数超过数组最大长度，返回第一项
 * @return 数组对应下标一项
 * @example const data = [1, 2, 3, 4, 5]
 *          pickArrayItem(data) ===> 5
 *          pickArrayItem(data, 4) ===> 5
 *          pickArrayItem(data, 5) ===> 5
 *          pickArrayItem(data, -1) ===> 5
 *          pickArrayItem(data, -5) ===> 1
 *          pickArrayItem(data, -6) ===> 1
 */
export const pickArrayItem = <T>(
  array: T[],
  pickIndex: number = array.length - 1
) => {
  const arrLength = array.length;
  const lastIndex = arrLength - 1;
  const numIndex = Math.abs(pickIndex);
  if (pickIndex < 0) {
    if (numIndex > arrLength) {
      return array[0];
    }
    return array[arrLength + pickIndex];
  }
  const minIndex = Math.min(numIndex, lastIndex);
  return array[minIndex];
};
