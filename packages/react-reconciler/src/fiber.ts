import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

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
	// 指向与当前FiberNode对应的节点 current|workInProgress【current当前FiberNode;workInProgress新生成的即将更新的FiberNode】
	alternate: Props | null;
	// 保存要执行操作的标记【移动，修改，删除...】
	flags: Flags;
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
		// 执行前的props
		this.pendingProps = pendingProps;
		// 执行后的props与pendingProps一致
		this.memoizedProps = null;
		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
	}
}
