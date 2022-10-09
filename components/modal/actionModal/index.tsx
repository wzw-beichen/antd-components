import React, { ReactNode, MouseEvent, useState, FC } from "react";
import { Button, Modal } from "antd";
import { ActionModalProps } from "./type";

/**
 * 基于Antd Modal封装的弹窗组件
 * 自动维护 visible
 */
const ActionModal: FC<ActionModalProps> = (props) => {
  const { btn, modalProps, children, beforeShow, onVisibleChange, init } =
    props;
  const { onOk, onCancel } = modalProps || {};
  const [visible, setVisible] = useState(false);

  const changeVisible = (bool: boolean) => {
    setVisible(bool);
    onVisibleChange?.(bool);
    // 执行初始化条件
    bool && init?.();
  };
  const btnClick = () => {
    const {
      btn: { onClick = () => true },
    } = props;
    try {
      onClick?.();
      (beforeShow?.() ?? true) && changeVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

  const renderInternalButton = () => {
    const btnNode = btn?.title || btn;
    return btnNode ? (
      <Button type="primary" onClick={btnClick}>
        {btnNode}
      </Button>
    ) : null;
  };

  const handleOk = (e) => {
    e.preventDefault();
    if (onOk) {
      onOk(e, () => changeVisible(false));
    } else {
      changeVisible(false);
    }
  };
  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    onCancel?.(e);
    changeVisible(false);
  };
  return (
    <>
      <span>
        {btn?.$$typeof ? (
          <span onClick={!btn.props.disabled ? btnClick : undefined}>
            {btn}
          </span>
        ) : (
          renderInternalButton()
        )}
      </span>
      <Modal
        visible={visible}
        {...modalProps}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};

export default ActionModal;
