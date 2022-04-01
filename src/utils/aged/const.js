/**
 * 不能申请的code码
 * '101403' --80岁以上老人才能申请
 * '200002' --该老人已参加养老保险，请勿申请
 * '200003' --该老人已身故，请勿申请
 * '200004' --该老人户籍不在郑州，无法申请
 */
export const cannotApply = ['101403', '200002', '200003', '200004']