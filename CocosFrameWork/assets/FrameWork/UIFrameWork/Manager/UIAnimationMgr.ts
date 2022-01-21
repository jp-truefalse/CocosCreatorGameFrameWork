/**
 * UI动画管理类（一些简单的UI动画）
 * 缩放动画
 * 透明度动画
 * 位移动画
 * 进度条加载动画
 */

import Singleton from "../../Util/Singleton";

export default class UIAnimationMgr extends Singleton {

    /**
     * UI缩放动画
     * @param panel 面板节点
     * @param isShow 显示(true)/隐藏(fasle)
     */
    public scaleAnimation(panel: cc.Node, isShow: boolean) {
        if (isShow) {
            panel.active = true;
            panel.scale = 0;
            cc.tween(panel)
                .to(0.2, { scale: 1 })
                .call(() => {
                    panel.scale = 1;
                })
                .start();
        }
        else {
            panel.scale = 1;
            cc.tween(panel)
                .to(0.2, { scale: 0 })
                .call(() => {
                    panel.scale = 1;
                    panel.active = false;
                })
                .start();
        }
    }

    /**
     * UI透明度动画
     * @param panel 面板节点
     * @param isShow 显示(true)/隐藏(fasle)
     */
    public opacityAnimation(panel: cc.Node, isShow: boolean) {
        if (isShow) {
            panel.active = true;
            panel.opacity = 0;
            cc.tween(panel)
                .to(0.2, { opacity: 225 })
                .call(() => {
                    panel.opacity = 255;
                })
                .start()
        }
        else {
            panel.opacity = 255;
            cc.tween(panel)
                .to(0.2, { opacity: 0 })
                .call(() => {
                    panel.opacity = 255;
                    panel.active = false;
                })
                .start()
        }
    }


    /**
     * UI位移动画
     * @param panel 面板节点
     * @param startPos 开始位置（画面外节点位置）
     * @param endPos 结束位置（面板在画面内的节点位置）
     * @param time UI动画时间
     * @param isShow 显示(true)/隐藏(fasle)
     */
    public posAnimation(panel: cc.Node, startPos: cc.Vec3, endPos: cc.Vec3, time: number, isShow: boolean) {
        if (isShow) {
            panel.active = true;
            panel.position = startPos;
            cc.tween(panel)
                .to(time, { position: endPos })
                .call(() => {

                })
                .start()
        }
        else {
            var panelPos = panel.position;
            cc.tween(panel)
                .to(time, { position: startPos })
                .call(() => {
                    panel.position = panelPos;
                    panel.active = false;
                })
                .start()
        }
    }

    /**
     * 进度条UI加载动画
     * @param node 挂载cc.ProgressBar组件的节点 
     * @param number 进度条值[0,1]
     */
    public uploadingUIAnimation(node: cc.Node, number: number) {
        node.getComponent(cc.ProgressBar).progress = number;
    }

}
