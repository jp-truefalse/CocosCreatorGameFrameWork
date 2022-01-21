/**
 * 数据存储管理类
 */
import Singleton from "../Util/Singleton";

export default class StorageMgr extends Singleton {

    /***************************************************************************************************************************
     * 数据本地存储管理
     * 
     * 存储音乐播放状态值，是否进行播放
     */


    /*************************音乐是否关闭相关处理，可应用于关闭开启音乐功能 ****************************************/
    /**
     * 得到存储的是否关闭背景音乐的值
     * @returns 返回关闭背景音乐的值
     */
    public getIsCloseMusic() {
        let isCloseMusic = cc.sys.localStorage.getItem('isCloseMusic');
        if (isCloseMusic == null || isCloseMusic == "") {
            isCloseMusic = true;
        }
        return isCloseMusic;
    }

    /**
     * 设置存储的是否关闭背景音乐的值
     * @param isClose 是否关闭背景音乐的值
     */
    public setIsCloseMusic(isClose: boolean) {
        cc.sys.localStorage.setItem('isCloseMusic', isClose);
    }

    /**
     * 获取已收到的礼物信息
     * @returns 返回礼物信息
     */
    public getReceivedGiftsInfo(): Array<{ openid: string, receivedTime: string }> {
        let receivedGiftInfo = cc.sys.localStorage.getItem("receivedGiftInfo");
        if (receivedGiftInfo == null || receivedGiftInfo == '') {
            receivedGiftInfo = new Array<{ openid: string, receiveTime: string }>();
        }
        else {
            receivedGiftInfo = JSON.parse(receivedGiftInfo);
        }
        return receivedGiftInfo;
    }

    /**
     * 更新已收到的礼物信息，用于判断一段时间内是否重复领取一个玩家赠送的礼物（一段时间内只能领取同一个玩家赠送的一个礼物，限制礼物领取数量）
     * @param openid 收到的礼物的赠送者openid
     * @param receiveTime 礼物领取时间
     * @returns 
     */
    public updateReceivedGiftsInfo(openid: string, receivedTime: string) {
        let receivedGiftInfo = this.getReceivedGiftsInfo();
        if (receivedGiftInfo.length == 0) {
            receivedGiftInfo.push({
                openid: openid,
                receivedTime: receivedTime,
            });
        }
        else {
            for (let i = 0; i < receivedGiftInfo.length; i++) {
                if (receivedGiftInfo[i].openid == openid) {
                    receivedGiftInfo[i].receivedTime = receivedTime;
                    cc.sys.localStorage.setItem("receivedGiftInfo", JSON.stringify(receivedGiftInfo));
                    return;
                }
            }
            receivedGiftInfo.push({
                openid: openid,
                receivedTime: receivedTime,
            });
        }
        cc.sys.localStorage.setItem("receivedGiftInfo", JSON.stringify(receivedGiftInfo));
    }

    /**
     * 获取已经失效的礼物信息
     * @returns 返回失效的礼物信息
     */
    public getDisabledGiftsInfo(): Array<{ openid: string, sendTime: string }> {
        let disabledGiftInfo = cc.sys.localStorage.getItem("disabledGiftInfo");
        if (disabledGiftInfo == null || disabledGiftInfo == '') {
            disabledGiftInfo = new Array<{ openid: string, time: string }>();
        }
        else {
            disabledGiftInfo = JSON.parse(disabledGiftInfo);
        }
        return disabledGiftInfo;
    }

    /**
     * 更新已失效的礼物（已经被领取过或领取时间已过）信息，用于判断礼物是否被领取过或者领取时间已过
     * @param openid 失效礼物的赠送者openid
     * @param sendTime 失效礼物的赠送时间
     */
    public updateDisabledGiftsInfo(openid:string,sendTime:string){
        let disabledGiftInfo = this.getDisabledGiftsInfo();
        disabledGiftInfo.push({
            openid:openid,
            sendTime:sendTime
        });
        cc.sys.localStorage.setItem("disabledGiftInfo",JSON.stringify(disabledGiftInfo));
    }

    /******************************************************************************************************************
     * 云开发数据存储管理
     * 
     */

}
