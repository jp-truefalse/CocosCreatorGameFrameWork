/**
 * UI框架核心管理类
 * 解析保存的所有面板信息（需要在UIPanelTypeInfo类中修改添加面板类型和路径，在UIPanelType类中修改面板类型）
 * 创建并保存所有面板实例
 * 管理并保存所有显示的面板
 * 
 * 
 * 使用说明：
 * 1，创建面板预制体，预制体需要放在resources文件夹下
 * 2，面板需要挂载框架中的isPausePanel类，以便在panel类中实现
 * 3，更新框架中UIPanelType类的面板类型枚举，以及UIPanelTypeInfo类中的面板类型以及对应预制体的面板路径
 * 4，面板类需要继承BasePanel，并实现所有的功能函数（页面状态函数以及隐藏面板函数）
 * 5，UI动画可以交替使用，没有限制
 */
import Singleton from "../../Util/Singleton";
import BasePanel from "../BasePanel/BasePanel";
import Satck from "../DataStructure/Stack";
import { UIPanleType } from "../UIPanelType/UIPanelType";
import UIPanelTypeInfo from "../UIPanelType/UIPanelTypeInfo";

export default class UIManager extends Singleton {

    //存储面板类型对应的面板预制体路径
    public panelPathDic: Map<UIPanleType, string>;
    //存储面板类型对应的实例化面板
    public panelDic: Map<UIPanleType, BasePanel>;
    //页面栈
    public panelStack: Satck<BasePanel>;

    //面板父对象
    private canvasTransform: cc.Node;

    //获取面板父对象
    public get CanvasTransform(): cc.Node {
        if (this.canvasTransform == null) {
            this.canvasTransform = cc.find("Canvas");
        }
        return this.canvasTransform;
    }

    //构造函数
    constructor() {
        super();
        this.parseUIPanelTypeJson();
    }

    //解析UIPanelTypeInfo信息
    private parseUIPanelTypeJson(): void {
        this.panelPathDic = new Map<UIPanleType, string>();
        UIPanelTypeInfo.forEach(element => {
            this.panelPathDic.set(element.panelType, element.path);
        });
    }

    /**
     * 根据面板类型，得到实例化出来的面板
     * @param panelType 要实例化出来的面板类型
     * @returns 返回实例化出来的面板
     */
    public getPanel(panelType: UIPanleType) {
        if (this.panelDic == null) {
            this.panelDic = new Map<UIPanleType, BasePanel>();
        }
        let panel: BasePanel = this.panelDic.get(panelType);
        if (panel == null) {
            let path = this.panelPathDic.get(panelType);
            return new Promise((resolve: (value: BasePanel) => void, reject) => {
                cc.resources.load(path, cc.Prefab, (err, prefab) => {
                    if (err) {
                        reject(err);
                        console.log('预制体加载失败');
                        return;
                    }
                    var instPanel = cc.instantiate(prefab) as unknown as cc.Node;
                    instPanel.setParent(this.CanvasTransform);
                    instPanel.active = true;
                    this.panelDic.set(panelType, instPanel.getComponent("BasePanel"));
                    resolve(instPanel.getComponent("BasePanel"));
                });
            })
        }
        else {
            return new Promise((resolve: (value: BasePanel) => void, reject) => {
                resolve(panel);
            });
        }
    }

    /**
     * 入栈操作，显示页面
     * @param panelType 入栈页面的页面类型
     */
    public pushPanel(panelType: UIPanleType): void {
        if (this.panelStack == null) {
            this.panelStack = new Satck<BasePanel>();
        }
        if (this.panelStack.size() > 0) {
            let topPanel: BasePanel = this.panelStack.peek();
            topPanel.OnPause();
        }
        let promise = this.getPanel(panelType);
        Promise.all([promise]).then((basePanel) => {
            console.log("11111");
            let panel = basePanel[0];
            this.panelStack.push(panel);
            panel.OnEnter();
        });
    }

    /**
     * 出栈操作，隐藏删除页面
     * 移除栈顶页面
     */
    public popPanel(): void {
        if (this.panelStack == null) {
            this.panelStack = new Satck<BasePanel>();
        }
        if (this.panelStack.size() <= 0) { return; }
        //关闭栈顶，并移除栈顶
        let topPanel: BasePanel = this.panelStack.pop();
        topPanel.OnExit();
        if (this.panelStack.size() <= 0) { return; }
        let topPanel2: BasePanel = this.panelStack.peek();
        topPanel2.OnResume();
    }
}
