import { StateID, Transition } from "../../FrameWork/FSMFrameWork/FSMState";
import FSMSystem from "../../FrameWork/FSMFrameWork/FSMSystem";
import chaseState from "./chaseState";
import patrolState from "./patrolState";

//控制器类
const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    private fsm:FSMSystem;

    // onLoad () {}

    start () {
        this.initFSM();
    }

    update (dt) {
        this.fsm.onState(this.node);
    }

    /**
     * 初始化状态机
     */
    public initFSM(){
        this.fsm = new FSMSystem();
        let patrol = new patrolState(this.fsm);
        patrol.addTransition(Transition.SeePlayer,StateID.Chase);
        let chase = new chaseState(this.fsm);
        chase.addTransition(Transition.LostPlayer,StateID.Patrol);
        this.fsm.addState(patrol);
        this.fsm.addState(chase);
    }
}
