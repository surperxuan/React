import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// createRoot 方法
export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null); // 生成hostRootFiber节点
	const root = new FiberRootNode(container, hostRootFiber); // 生成FiberRootNode根节点
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

// render方法内部调用用于更新 this.setState
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
