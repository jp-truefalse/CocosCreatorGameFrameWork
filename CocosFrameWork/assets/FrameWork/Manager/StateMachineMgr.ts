import { playerState } from "../Data/StateConstValue";
import Singleton from "../Util/Singleton";

/**
 * 状态机管理类
 */
export default class StateMachineMgr extends Singleton {

    public stateArray = [];
    public state = null;

    constructor(){
        super();
        this.storageState(playerState.jump);   //此函数需要手动修改参数
        this.state = playerState.idle;         //该值需要手动修改
    }

    public storageState(lastState:number){
        for (let i = 0; i <= lastState; i++) {
            this.stateArray.push(i);
        }
        console.log(this.stateArray);
    }

    public onState(){
        switch (this.state) {
            case playerState.idle:
                break;
            case playerState.jump:
                break;
            case playerState.run:
                break;
            case playerState.walk:
                break;
            default:
                break;
        }
    }

}
   