// 负责调用beginWork和completeWork
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	// this.setState触发更新时需要先向上找到根节点root
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

// return属性指向父节点【到hostRootFiber】，然后hostRootFiber的stateNode指向FiberRootNode，返回FiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workLoop报错', e);
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	// next为beginWork返回的fiber的子节点
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;
	if (next === null) {
		// 没有子节点即开始归，向同级的兄弟元素遍历
		completeUnitOfWork(fiber);
	} else {
		// 有子节点则继续循环workLoop
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		// 有兄弟节点则遍历兄弟节点
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		// 没有兄弟节点则遍历父节点
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
