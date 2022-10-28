import React from "react";
import { Form } from "antd";
import { FormItemProps } from "antd/es/form";
import classNames from "classnames";
import styles from "./index.less";

type Props = FormItemProps & {
  extraHelp?: React.ReactNode;
  children: React.ReactNode;
};
const FormItemExtraHelp = (props: Props) => {
  const { extraHelp, children, label, className, ...restProps } = props;
  return (
    <Form.Item
      label={
        extraHelp ? (
          <div>
            <div
              className={classNames(
                "form_item_extra_label",
                styles.form_item_extra_label
              )}
            >
              {label}
            </div>
            <div className={styles.form_item_extra_help}>{extraHelp}</div>
          </div>
        ) : (
          label
        )
      }
      className={classNames(className, styles.form_item_extra)}
      {...restProps}
    >
      {children}
    </Form.Item>
  );
};

export default FormItemExtraHelp;
