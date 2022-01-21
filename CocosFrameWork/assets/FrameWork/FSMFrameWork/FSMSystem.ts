/**
 * 状态机类
 * 在控制类中新建状态机，将所有的状态全部添加到状态机当中
 */
import FSMState, { StateID, Transition } from "./FSMState";

export default class FSMSystem {
    //保存所有的状态
    private states: Map<StateID, FSMState> = new Map<StateID, FSMState>();
    //当前状态id
    private currentStateID: StateID = null;
    //当前所处的状态
    private currentState: FSMState = null;

    /**
     * 向状态机中添加状态
     * @param state 状态
     */
    public addState(state: FSMState) {
        //安全校验
        if (state == null) { console.log("1"); return; }
        if (this.currentState == null) {   //第一个添加的状态设置为默认的状态
            this.currentState = state;
            this.currentStateID = state.ID;
        }
        console.log(this.states,state.ID);
        if (this.states.has(state.ID)) {console.log('2'); return; }
        this.states.set(state.ID, state);
    }

    /**
     * 删除状态机中的状态
     * @param id 状态id
     */
    public deleteState(id: StateID) {
        //安全校验
        if (id == StateID.NullStateID) { return; }
        if (this.states.has(id) == false) { return; }
        this.states.delete(id);
    }

    /**
     * 转换状态
     * @param trans 状态转换事件
     */
    public performTransition(trans: Transition) {
        //安全校验（转换状态为空）
        if (trans == Transition.NullTransition) { return; }
        //获取状态id
        let id: StateID = this.currentState.getOutPutState(trans);
        //安全校验（状态id不存在）
        if (id == StateID.NullStateID) { return; }
        //安全校验（状态不存在）
        if (this.states.has(id) == false) { return; }
        let state:FSMState = this.states.get(id);
        this.currentState.DoAfterLeaving();
        this.currentState = state;
        this.currentStateID = id;
        this.currentState.DoBeforeEntering();
    }

    /**
     * 监听触发状态转换
     * @param npc 
     */
    public onState(npc:cc.Node){
        //监听状态转换时，触发的执行动作
        this.currentState.Act(npc);
        //监听状态转换条件
        this.currentState.Reason(npc);
    }
}
