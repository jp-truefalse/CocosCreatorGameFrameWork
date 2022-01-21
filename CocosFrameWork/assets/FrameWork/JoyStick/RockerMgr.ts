/**
 * 虚拟摇杆实现（固定摇杆）
 * 
 * 
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class RockerMgr extends cc.Component {

    @property(cc.Node)   //触摸节点
    touchNode: cc.Node = null;

    @property(cc.Node)      //player节点
    player: cc.Node = null;

    @property(cc.Float)     //player移动速度
    playerSpeed: number = 100;

    @property(cc.Node)      //  摇杆节点
    joystick: cc.Node = null;

    public max_r: number = 100; //摇杆移动的半径

    public dir: cc.Vec2 = null;  //记录摇杆的角度

    public touchID = null;  //单指触摸

    // onLoad () {}

    start() {
        //初始化摇杆的位置
        this.joystick.setPosition(new cc.Vec2(0, 0));
        this.dir = new cc.Vec2(0, 0);

        //注册触摸监听事件
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.cbTouchStart, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.cbTouchMove, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.cbTouchEnd, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.cbTouchCancel, this);
    }

    //注销触摸监听事件
    protected onDestroy(): void {
        this.touchNode.off(cc.Node.EventType.TOUCH_START, this.cbTouchStart, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_MOVE, this.cbTouchMove, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_END, this.cbTouchEnd, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_CANCEL, this.cbTouchCancel, this);
    }

    //在触摸范围外触摸结束回调
    public cbTouchCancel(event: cc.Touch) {
        if (event.getID() != this.touchID) {
            return;
        }
        else {
            this.touchID = null;
        }
        this.joystick.setPosition(new cc.Vec2(0, 0));
        this.dir = new cc.Vec2(0, 0);
    }
    //在触摸范围内触摸结束回调
    public cbTouchEnd(event: cc.Touch) {
        if (event.getID() != this.touchID) {
            return;
        }
        else {
            this.touchID = null;
        }
        this.joystick.setPosition(new cc.Vec2(0, 0));
        this.dir = new cc.Vec2(0, 0);
    }
    //触摸移动回调
    public cbTouchMove(event: cc.Touch) {
        if (event.getID() != this.touchID) { return; }  //验证单指触摸
        let pos = event.getLocation();
        let jPos = this.node.convertToNodeSpaceAR(pos);
        let len = jPos.mag();
        this.dir.x = jPos.x / len;
        this.dir.x = jPos.y / len;
        if (len > this.max_r) {
            jPos.x = this.max_r * jPos.x / len;
            jPos.y = this.max_r * jPos.y / len;
        }
        this.joystick.setPosition(jPos);
    }
    //开始触摸回调
    public cbTouchStart(event: cc.Touch) {
        if (this.touchID == null) { //验证单指触摸
            this.touchID = event.getID();
        }
        else {
            return;
        }
        let pos = event.getLocation();
        let jPos = this.node.convertToNodeSpaceAR(pos);
        let len = jPos.mag();
        this.dir.x = jPos.x / len;
        this.dir.y = jPos.y / len;
        if (len > this.max_r) {
            jPos.x = this.max_r * jPos.x / len;
            jPos.y = this.max_r * jPos.y / len;
        }
        this.joystick.setPosition(jPos);
    }

    // update (dt) {}
}
