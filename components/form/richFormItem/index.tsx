import React from "react";
import { Form } from "antd";
import { composeProps } from "./composeProps";
import { RichFormItemProps, MyFormItemChildrenProps } from "./type";

function MyFormItemChildren(props: MyFormItemChildrenProps) {
  const { render, children, ...rest } = props;
  // composeProps 合并执行 Form.Item 传的 onChange 以及组件本身的方法
  const _children = React.cloneElement(
    children,
    composeProps(children.props, rest, true)
  );
  if (render) {
    return render(_children);
  }
  return _children;
}

/**
 * Form.Item 的 children 增加 before、after
 * @param props
 * @returns FormItem
 */
const RichFormItem = (props: RichFormItemProps) => {
  const { render, children, ...rest } = props;

  return (
    <Form.Item {...rest}>
      {React.isValidElement(children) ? (
        <MyFormItemChildren render={render}>{children}</MyFormItemChildren>
      ) : (
        children
      )}
    </Form.Item>
  );
};

export default RichFormItem;
