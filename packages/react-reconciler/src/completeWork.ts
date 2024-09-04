// 递归中的归，即向上遍历兄弟节点及父节点的兄弟节点；返回子节点FiberNode
import { FiberNode } from './fiber';

export const completeWork = (fiber: FiberNode) => {
	return fiber;
};
