import { Action } from 'shared/ReactTypes';

// 定义一个用于更新的数据结构Update；可以接受两种更新方式
// this.setState({}) this.setState((prevState)=>{})
export interface Update<State> {
	action: Action<State>;
}

// 定义UpdateQueue队列用于消费Update
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// 生成Update实例
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

// 生成UpdateQueue
export const createUpdateQueue = <Action>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<Action>;
};

// 用于操作UpdateQueue，添加Update进去
export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update;
};

// 消费UpdateQueue baseState表示当前state，pendingUpdate表示本次要执行的操作，即setState（pendingUpdate）；pendingUpdate可能是对象或者函数
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// baseState 1 update (x)=>4x -> memoizedState:4
			result.memoizedState = action(baseState);
		} else {
			// baseState 1 update 2 -> memoizedState:2
			result.memoizedState = action;
		}
	}
	return result;
};
