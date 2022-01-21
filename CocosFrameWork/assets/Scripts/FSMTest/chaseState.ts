/**
 * 状态类
 */

import FSMState, { StateID, Transition } from "../../FrameWork/FSMFrameWork/FSMState";
import FSMSystem from "../../FrameWork/FSMFrameWork/FSMSystem";

export default class chaseState extends FSMState {

    public count: number = 0;

    constructor(fsm: FSMSystem) {
        super(fsm);
        this.stateID = StateID.Chase;
    }

    public Act(npc: cc.Node): void {
        console.log('追赶', this.count);
        this.count++;
    }

    public Reason(npc: cc.Node): void {
        if (this.count > 10) {
            this.fsm.performTransition(Transition.LostPlayer);
        }
    }

    public DoBeforeEntering(): void {

    }

    public DoAfterLeaving(): void {
        this.count = 0;
    }
}
