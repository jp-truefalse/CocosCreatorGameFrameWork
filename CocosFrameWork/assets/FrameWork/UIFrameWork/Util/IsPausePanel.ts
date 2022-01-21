/**
 * 节点控制类
 * 
 * 需要挂载在面板下
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class IsPausePanel extends cc.Component {

    /**
     * 是否禁止交互
     * @param isBan 禁止还是非禁止交互
     */
    public banInterAction(isBan:boolean) {
        //处理父物体上的交互逻辑
        let buttonArray = this.node.getComponentsInChildren(cc.Button);
        if (buttonArray.length > 0) {
            buttonArray.forEach(element => {
                element.interactable = isBan;
            });
        }
    }

    /**
     * 设置节点是否显示
     */
    public setIsActive(isShow) {
        this.node.active = isShow;
    }

}
