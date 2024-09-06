import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

// tag标识节点类型；pendingProps当前FiberNode接下来需要改变的Props；key为ReactElement的key
export class FiberNode {
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	type: any;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;
	memoizedProps: Props | null;
	memoizedState: any;
	// 指向与当前FiberNode对应的节点 current|workInProgress【current当前FiberNode;workInProgress新生成的即将更新的FiberNode】双缓冲
	alternate: Props | null;
	// 保存要执行操作的标记【移动，修改，删除...】
	flags: Flags;
	updateQueue: unknown;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		// tag为HostComponent(div)时， stateNode为div DOM
		this.stateNode = null;
		// tag为FunctionComponent时， type为函数本身()=>{}
		this.type = null;
		// 节点关系，构成树状结构
		// 父节点
		this.return = null;
		// 兄弟节点
		this.sibling = null;
		// 子节点
		this.child = null;
		// 父节点下的第几个子节点
		this.index = 0;

		this.ref = null;
		//工作单元
		// 执行前的props
		this.pendingProps = pendingProps;
		// 执行后的props与pendingProps一致
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
	}
}

// FiberRootNode为根节点 -> createRoot
// ReactDOM.createRoot(rootElement).render(<App/>)
// FiberRootNode -> hostRootFiber -> App 相互之间有递归关系指向
export class FiberRootNode {
	container: Container; // 指向hostRootFiber
	current: FiberNode; // 指向hostRootFiber
	finishedWork: FiberNode | null; // 递归完成后的hostRootFiber
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this; // hostRootFiber的stateNode指向FiberRootNode
		this.finishedWork = null;
	}
}

// 双缓冲机制每次返回alternate
//【current当前FiberNode;workInProgress新生成的即将更新的FiberNode】双缓冲
export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		// mount首屏渲染
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		// 清理上次遗留的标记
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;
	return wip;
};
