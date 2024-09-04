export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

// 函数组件类型
export const FunctionComponent = 0;
// 挂载的根节点
export const HostRoot = 3;
// div
export const HostComponent = 5;
// 文本123
export const HostText = 6;
