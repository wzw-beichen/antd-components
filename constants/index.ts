/** 默认table请求全部数据分页条件 */
export const defaultAllTablePagination = {
  currentPage: 1,
  pageSize: 99999,
};

/** 默认table分页配置 */
export const defaultPagination = {
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
};

/** 常用日期格式化 */
export const defaultDateFormat = {
  time: "YYYY-MM-DD HH:mm:ss",
  day: "YYYY-MM-DD",
};
