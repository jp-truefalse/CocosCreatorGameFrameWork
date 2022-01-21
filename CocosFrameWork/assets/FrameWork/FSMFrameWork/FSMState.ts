/**
 * 状态基类
 * 每一个状态类都需要继承该状态基类，并且实现相关的需要在子类中重写的函数
 * 在子类构造函数中初始化stateID
 * 需要更新转换事件枚举和状态枚举
 */

import FSMSystem from "./FSMSystem";

/**
 * 枚举转换事件
 */
export enum Transition {
    NullTransition = 0,
    SeePlayer,
    LostPlayer,
}

/**
 * 枚举状态类型
 */
export enum StateID {
    NullStateID = 0,
    Chase,
    Patrol,
}

export default abstract class FSMState {
    protected stateID: StateID = StateID.NullStateID;//定义初始化状态

    public get ID(): StateID {  //得到当前状态
        return this.stateID;
    }

    protected map: Map<Transition, StateID> = new Map<Transition, StateID>(); //用来存储所有的转换事件对应的转换后的状态（转换、状态一一对应）
    protected fsm: FSMSystem = null;//声明一个状态机
    //使用构造函数告诉状态是归哪个状态机管理的
    constructor(fsm: FSMSystem) {
        this.fsm = fsm;
    }

    /**
     * 初始化状态表（可以切换到哪个状态）
     * @param trans 转换事件
     * @param id 状态id
     */
    public addTransition(trans: Transition, id: StateID) {
        //安全校验
        if (trans == Transition.NullTransition) { return; }
        if (id == StateID.NullStateID) { return; }
        if (this.map.has(trans)) { return; }
        this.map.set(trans, id);
        // console.log('状态表',this.map);
    }

    /**
     * 删除状态表中的转换状态
     * @param trans 转换事件
     */
    public deleteTransition(trans: Transition) {
        //安全校验
        if (trans == Transition.NullTransition) { return; }
        if (this.map.has(trans) == false) { return; }
        this.map.delete(trans);
    }

    /**
     * 获取转换事件对应的状态id
     * @param trans 转换事件
     */
    public getOutPutState(trans: Transition) {
        if (this.map.has(trans)) {
            console.log(this.map.get(trans));
            return this.map.get(trans);
        }
        return StateID.NullStateID;
    }

    //进入状态时执行（需要在子类中重写）
    public DoBeforeEntering(): void { }
    //状态结束时调用（需要在子类中重写）
    public DoAfterLeaving(): void { }
    //状态切换执行的动作（需要在子类中重写）
    public abstract Act(npc: cc.Node):void;
    //判断状态转换的条件（需要在子类中重写）
    public abstract Reason(npc: cc.Node):void;

}
