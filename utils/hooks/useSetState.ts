import { useCallback, useState } from "react";
import { isFunction } from "./utils";

export type SetStateType<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null)
) => void;

/**
 * 管理 object 类型 state 的 Hooks，用法与 class 组件的 this.setState 基本一致。
 * 需注意: setState(null) 的话会使用上一次的值，而不会变成null;
 * 例子: const [loading, setLoading] = useSetState({
 *   confirmLoading: false,
 *   pageLoading: false,
 * });
 * 仅更新loading中pageLoading, setLoading({ pageLoading: true })即可，
 * 而不用setLoading({ ...loading, pageLoading: true })
 * @param initialState 初始化state
 * @returns [state, setMergeState]
 */
export const useSetState = <S extends Record<string, any>>(
  initialState: S | (() => S)
): [S, SetStateType<S>] => {
  const [state, setState] = useState<S>(initialState);

  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
};
