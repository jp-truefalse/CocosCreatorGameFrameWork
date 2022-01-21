/**
 * 工具类
 * 
 * 加载场景
 */
import Singleton from "./Singleton";

export default class Util extends Singleton {

    /**
     * 加载场景
     * @param scenceName 场景名 
     */
    public loadScence(scenceName: string) {
        cc.director.loadScene(scenceName);
    }

    /**
     * 获取当前时间
     * @returns 返回当前时间
     */
    public getTime() {
        return new Date().getTime();
    }

    /**
     * 小时换算成毫秒
     * @param hour 小时
     * @returns 返回毫秒数
     */
    public hourToMilliSecond(hour: number): number {
        return 60 * 60 * 1000 * hour;
    }

    /**
     * 屏幕适配规则
     * 
     * UI适配规则：
     * 根据UIwidget来设置对齐规则，使UI显示在视图内
     */
    public screenFit() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let sysInfo = wx.getSystemInfoSync();
            let realWidth = sysInfo.screenWidth;
            let realHeight = sysInfo.screenHeight;
            let realResolution = realWidth / realHeight;
            let canvas = cc.director.getWinSize();
            let designWidth = canvas.width;
            let designHeight = canvas.height;
            let designResolution = designWidth / designHeight;
            console.log("进来了");
            if (designResolution >= realResolution) {
                console.log('适配高');
                cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_HEIGHT);
            }
            else if(designResolution < realResolution){
                console.log('适配宽');
                cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_WIDTH);
            }
        }
    }

}
