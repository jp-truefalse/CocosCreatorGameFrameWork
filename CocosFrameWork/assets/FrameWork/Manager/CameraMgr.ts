/**
 * camera管理类，直接挂载到目标相机节点下就可以
 * 
 * 相机跟随
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraMgr extends cc.Component {

    @property(cc.Node)
    followTarget: cc.Node = null;

    // onLoad () {}

    start() {
        this.cameraFollow(this.followTarget);
    }

    // update (dt) {}

    /**
     * 相机跟随
     * @param node 跟踪的目标节点
     * @param minX 限制x的最小值
     * @param maxX 限制x的最大值
     * @param minY 限制y的最小值
     * @param maxY 限制y的最大值
     * @returns 
     */
    public cameraFollow(node: cc.Node, minX?: number, maxX?: number, minY?: number, maxY?: number) {
        //先转化为世界坐标
        let wPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        //转化为节点坐标
        let cPos = this.node.parent.convertToNodeSpaceAR(wPos);
        console.log(cPos);
        this.node.position = new cc.Vec3(cPos.x, cPos.y, 0);

        //有边界限制，限制相机位置
        // minX,maxX,minY,maxY
        console.log("1:",minX,maxX,minY,maxY);
        console.log(minX == undefined);
        if (minX == undefined || maxX == undefined || minY == undefined || maxY == undefined) { return; }
        let pos = this.node.position;
        if (pos.x >= maxX) {
            pos.x = maxX;
        } else if (pos.x <= minX) {
            pos.x = minX;
        }
        if (pos.y >= maxY) {
            pos.y = maxY;
        } else if (pos.y <= minY) {
            pos.y = minY;
        }
        this.node.setPosition(pos);
    }

}
