/**
 * 进入游戏的加载页面管理类
 * 
 * 关于适配的相关问题：
 * 750*1624的分辨率设置，fit
 */
import ResConstValue from "../Data/ResConstValue";
import ResMgr from "../Manager/ResMgr";
import UIAnimationMgr from "../UIFrameWork/Manager/UIAnimationMgr";
import Singleton from "../Util/Singleton";
import Util from "../Util/Util";
import TCloudMgr from "../WeChat/TCloudMgr";
import WeChatMgr from "../WeChat/WeChatMgr";

export default class LoadingMgr extends Singleton {

    //资源是否已经加载完毕
    public isload: boolean = false;

    //控制进度条参数
    public loadNumber: number = 0;

    /**
    * 对加载页面进行初始化
    * 这个需要放在最前面调用，等分包和资源加载完毕之后再进行其他的初始化操作
    */
    public init() {
        // console.log('网络状态:',await WeChatMgr.Instance(WeChatMgr).getNetworkType());
        Promise.all([WeChatMgr.Instance(WeChatMgr).getNetworkType()]).then((networkType: any) => {
            console.log("当前网络状态:", networkType[0]);
            if (networkType[0] == 'none') {
                WeChatMgr.Instance(WeChatMgr).showModal('', '网络已断开，请检查网络状态后重试');
            }
            else {
                WeChatMgr.Instance(WeChatMgr).init();
                Util.Instance(Util).screenFit();
                this.setIsLoad(false);
                TCloudMgr.Instance(TCloudMgr).initCloud().then((res) => {
                    console.log('云开发初始化成功:', res);
                    WeChatMgr.Instance(WeChatMgr).getUID();
                    TCloudMgr.Instance(TCloudMgr).onWatcherReceivedGifts();
                    this.loadSubPackages().then(() => {
                        console.log("分包加载完成");
                        ResMgr.Instance(ResMgr).loadAllRes().then(() => {
                            //分包加载完成后执行回调
                            this.setIsLoad(true);
                        });
                    });
                });
            }
        });
    }

    /**
     * 加载单个分包
     * @param packageName 分包名
     * @returns 返回promise对象
     */
    public loadSubPackage(packageName: string) {
        return new Promise((reslove: (value) => void, reject) => {
            cc.assetManager.loadBundle(packageName, (err) => {
                if (err) {
                    console.log("分包加载出错：", err);
                    return;
                }
                reslove(reject);
            })
        });
    }

    /**
     * 加载所有分包
     * @returns 返回Promise对象
     */
    public loadSubPackages() {
        let packagesArray = [];
        for (let i = 0; i < ResConstValue.PACKAGES_NAME.length; i++) {
            packagesArray.push(this.loadSubPackage(ResConstValue.PACKAGES_NAME[i]));
        }
        console.log("分包：", packagesArray);
        return Promise.all(packagesArray);
    }

    /**
     * 返回资源加载结果
     * @returns 是否已经加载完毕
     */
    public getIsload(): boolean {
        return this.isload;
    }

    /**
     * 设置资源加载结果
     * @param isTrue 是否已经加载完毕
     */
    public setIsLoad(isTrue: boolean) {
        this.isload = isTrue;
    }

    /**
     * 获取控制进度条参数值
     * @returns 返回进度条参数值
     */
    public getLoadNumber(): number {
        return this.loadNumber;
    }

    /**
     * 设置当前进度条参数值
     * @param number 当前进度条参数值
     */
    public setLoadNumber(number: number) {
        this.loadNumber = number;
    }

    /**
     * 监听进度条
     * 该函数需要放在update函数下   
     * @param node 挂载cc.Progress的节点
     */
    public onLoading(node: cc.Node) {
        if (WeChatMgr.Instance(WeChatMgr).getIsLogin()) {
            node.active = true;
            if (this.getLoadNumber() <= 0.25) {
                this.loadNumber += 0.002;
            }
            else if (this.getLoadNumber() > 0.25 && this.getLoadNumber() <= 0.5) {
                if (this.getIsload()) {
                    this.loadNumber += 0.002;
                }
                else {
                    this.loadNumber += 0.001;
                }
            }
            else if (this.getLoadNumber() > 0.5 && this.getLoadNumber() <= 0.75) {
                if (this.getIsload()) {
                    this.loadNumber += 0.02;
                }
                else {
                    this.loadNumber += 0.005;
                }
            }
            else if (this.getLoadNumber() > 0.75 && this.getLoadNumber() <= 1) {
                if (this.getIsload()) {
                    this.loadNumber += 0.02;
                }
                else {
                    this.loadNumber += 0.005;
                }
            }

            UIAnimationMgr.Instance(UIAnimationMgr).uploadingUIAnimation(node, this.loadNumber);
            if (this.getIsload() && this.getLoadNumber() >= 1) {
                //加载下一个场景,需要自行填写
                Util.Instance(Util).loadScence("GameScence");
                this.setIsLoad(false);
            }
        }
        else {
            node.active = false;
        }
    }




}
