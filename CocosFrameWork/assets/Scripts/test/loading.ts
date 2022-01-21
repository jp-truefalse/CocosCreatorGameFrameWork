import LoadingMgr from "../../FrameWork/Manager/LoadingMgr";


/**
 * 测试类
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class loading extends cc.Component {

    @property(cc.Node)
    progressNode: cc.Node = null;

    onLoad () {
        LoadingMgr.Instance(LoadingMgr).init();
    }

    start () {
        
    }

    update (dt) {
        LoadingMgr.Instance(LoadingMgr).onLoading(this.progressNode);
    }
}
