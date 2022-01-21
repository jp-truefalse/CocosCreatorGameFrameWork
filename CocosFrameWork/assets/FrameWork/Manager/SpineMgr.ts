/**
 * spine动画管理类
 */
import Singleton from "../Util/Singleton";
import ResMgr from "./ResMgr";

export default class SpineMgr extends Singleton {

    /**
     * 将远程加载的spine资源重新配置为spine，可将资源直接放在资源加载成功后转换，直接使用spine
     * @param atlasName atlas文件资源名
     * @param jsonName json文件资源名
     * @param textureName 材质文件资源名
     * @returns 返回spine
     */
    public initSkeletonData(atlasName: string, jsonName: string, textureName: string) {
        let skeletonData = new sp.SkeletonData();
        let atlas = ResMgr.Instance(ResMgr).getResByName(atlasName);
        skeletonData.atlasText = atlas.text;
        let json = ResMgr.Instance(ResMgr).getResByName(jsonName);
        skeletonData.skeletonJson = json.json;
        let texture = ResMgr.Instance(ResMgr).getResByName(textureName);
        skeletonData.textures = [texture];
        skeletonData.textureNames = ['luxiaoqi.png'];
        return skeletonData;
    }

    /**
     * 混合动画，使动画切换时的过渡更加自然
     * @param node spine节点
     * @param animation1 animation动画名
     * @param animation2 animation动画名
     * @param number 混合时间（从当前值开始差值）
     */
    public setMix(node: cc.Node, animation2: string, number: number) {
        let animation1 = this.getAnimation(node);
        node.getComponent(sp.Skeleton).setMix(animation1, animation2, number);
    }

    /**
     * spine节点上的动画是否相同
     * @param node spine节点
     * @param animation 动画名称
     * @returns 返回结果
     */
    public isSameAn(node: cc.Node, animation: string) {
        return node.getComponent(sp.Skeleton).animation = animation;
    }

    /**
     * 获取spine节点上的动画
     * @param node spine节点
     * @returns 返回spine节点上的动画
     */
    public getAnimation(node: cc.Node) {
        return node.getComponent(sp.Skeleton).animation;
    }

    /**
     * 设置动画回调函数，动画每执行一次，调用一次
     * @param node spine节点
     * @param callBack 回调函数
     */
    public setAnCallBack(node: cc.Node, callBack: () => void) {
        node.getComponent(sp.Skeleton).setCompleteListener(callBack);
    }

    /**
     * 移除动画设置的回调函数，
     * @param node spine节点
     */
    public removeAnCallBack(node: cc.Node) {
        node.getComponent(sp.Skeleton).setCompleteListener(null);
    }

    /**
     * 暂停spine动画
     * @param node spine节点
     */
    public pauseAnimation(node: cc.Node) {
        node.getComponent(sp.Skeleton).timeScale = 0;
    }

    /**
     * 恢复spine节点动画
     * @param node spine节点
     */
    public resumeAnimation(node: cc.Node) {
        node.getComponent(sp.Skeleton).timeScale = 1;
    }

    /**
     * spine节点的皮肤是否相同
     * @param node spine节点
     * @param skinName 皮肤名称
     * @returns 返回结果
     */
    public isSameSkin(node: cc.Node, skinName: string) {
        return node.getComponent(sp.Skeleton).defaultSkin = skinName;
    }

    /**
     * 设置spine皮肤（整体更换皮肤）
     * @param node spine节点
     * @param skinName 皮肤名
     */
    public setSpineSkin(node: cc.Node, skinName: string) {
        if (!this.isSameSkin(node, skinName)) {
            node.getComponent(sp.Skeleton).setSkin(skinName);
        }
    }

    /**
     * 执行spine动画
     * @param node spine节点
     * @param animation 动画名
     * @param bool 是否循环播放
     * @param number 混合时间（从当前值开始差值）
     * @param callBack 回调函数
     */
    public setAnimation(node: cc.Node, animation: string, bool: boolean, number: number, callBack: () => void) {
        if (!this.isSameAn(node, animation)) {
            this.setMix(node, animation, number);
            node.getComponent(sp.Skeleton).setAnimation(0, animation, bool);
            if (callBack) {
                this.setAnCallBack(node, callBack);
            }
        }
    }

    /**
     * 局部换装，更换attachment，需要做很多个皮肤(保证有插槽和attachment对象，不然方法也没用)
     * @param node spine节点
     * @param slotName 插槽名称
     * @param targetSkinName 目标皮肤名称（要换成的皮肤名称）
     * @param targetAttachName 目标attachment对象
     * @returns 
     */
    public localChaneDress(node:cc.Node,slotName:string,targetSkinName:string,targetAttachName:string){
        let skeleton = node.getComponent(sp.Skeleton);
        let skeletonData = skeleton.skeletonData.getRuntimeData();
        let slot = skeleton.findSlot(slotName);
        let skin = skeletonData.findSkin(targetSkinName);
        let slotIndex = skeletonData.findSlotIndex(slotName);
        let attachment = skin.getAttachment(slotIndex,targetAttachName);
        if(!slot || !attachment){
            console.error(slot&&attachment,"slots:"+slotName+",attachment:"+targetAttachName+"不存在");
            return;
        }
        slot.setAttachment(attachment);
        //更新缓存
        skeleton.invalidAnimationCache();
    }

    /******************************************************************************************
     * spine挂点，实现武器的拾取等等
     */
    /**
     * 生成指定骨骼名称节点树
     * @param node spine节点
     * @param boneName 骨骼名称
     * @param prefab 预制体
     */
    public generateSomeNodes(node:cc.Node,boneName:string,prefab:cc.Prefab){
        let attachUtil = node.getComponent(sp.Skeleton).attachUtil;
        let boneNodes = attachUtil.generateAttachedNodes(boneName);
        let boneNode = boneNodes[0];
        boneNode.addChild(cc.instantiate(prefab));
    }

    /**
     * 销毁指定骨骼名称节点
     * @param node spine节点
     * @param boneName 骨骼名称
     */
    public destroySomeNodes(node:cc.Node,boneName:string){
        let attachUtil = node.getComponent(sp.Skeleton).attachUtil;
        attachUtil.destroyAttachedNodes(boneName);
    }

}
