/**
 * 微信api开发管理类
 */

/**
 * 广告id，需要自行去微信公众号平台申请后更新才能使用
 */
/**
 * 激励广告id
 */
const ADMOB_REWARDED_ID = "2338muvdfvp87ifnc8";
/**
 * 插页广告id
 */
const ADMOB_INTERSTITIAL_ID = '1724972a0edd51bc6f';
/**
 * 格子广告id
 */
const ADMOB_GRID_ID_ARRAY = "adunit-40f6fc418571620e";
/**
 * banner广告id
 */
const ADMOB_BANNER_ID_ARRAY = [
    'c6fl858g1bce8nmo62',  // 主菜单的banner
    //'adunit-d71a764cb018ae2d',  // gameover的banner
    //'adunit-402a05d6c504a1c5',  // 点击跳过的banner
    //'adunit-0556c9fdcae6d96a',
]

import AudioMgr from "../Manager/AudioMgr";
import StorageMgr from "../Manager/StorageMgr";
import Singleton from "../Util/Singleton";
import Util from "../Util/Util";
import TCloudMgr from "./TCloudMgr";

export default class WeChatMgr extends Singleton {

    /**
     * 初始化微信开发管理类，
     * @param rewardVideoSuccessBack 激励视频播放成功的回调 
     * @param rewardVideoFailBack 激励视频中途退出的回调
     */
    public init(rewardVideoSuccessBack?: () => void, rewardVideoFailBack?: () => void) {
        this.login();
        this.openFriendShare();
        this.onShow();
        // TCloudMgr.Instance(TCloudMgr).initCloud();
        // this.getUID();
        // TCloudMgr.Instance(TCloudMgr).onWatcherReceivedGifts();
        // this.createBannerAd();
        // this.createInterstitialAd();
        // this.createRewardVideoAd(rewardVideoSuccessBack, rewardVideoFailBack);
        // this.createGridAd();
    }


    /**************************************************************************************************************************************************************************
     * 用户登陆功能实现
     *
     * 获取用户登陆信息（登陆）
     * 
     * 
     * 
     * ************************************************************************************************************************************************************************/

    /**
     * 记录是否已经登陆游戏
     */
    public islogin: boolean = false;
    /**
     * 记当前用户的用户名称
     */
    public userName: string = null;
    /**
     * 记录头像url
     */
    public headUrl: string = null;
    /**
     * 获取用户授权信息
     * 登陆游戏
     */
    public login() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let sysInfo = wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            var self = this;
            wx.getSetting({
                success: (res) => {
                    if (res.authSetting["scope.userInfo"]) {
                        wx.getUserInfo({
                            success: (res) => {
                                self.setIsLogin(true);
                                this.setUserName(res.userInfo.nickName);
                                this.setUserHeadUrl(res.userInfo.avatarUrl);
                            }
                        });
                    }
                    else {
                        let button = wx.createUserInfoButton({
                            type: 'text',
                            text: '',
                            style: {
                                left: 0,
                                top: 0,
                                width: width,
                                height: height,
                            }
                        });
                        button.onTap((res) => {
                            if (res.userInfo) {
                                self.setIsLogin(true);
                                this.setUserName(res.userInfo.nickName);
                                this.setUserHeadUrl(res.userInfo.avatarUrl);
                                button.destroy();
                            }
                            else {
                                self.showModal("提示", "需要获取您的用户信息登陆游戏");
                            }
                        });
                    }
                }
            });
        }
        else {
            this.setIsLogin(true);
        }
    }

    /**
     * 获取用户是否已经登录游戏
     * @returns 
     */
    public getIsLogin(): boolean {
        return this.islogin;
    }

    /**
     * 设置用户是否已经登陆游戏
     * @param isTrue 是否已经登陆游戏
     */
    public setIsLogin(isTrue: boolean) {
        this.islogin = isTrue;
    }

    /**
     * 得到用户名
     * @returns 
     */
    public getUserName(): string {
        return this.userName;
    }

    /**
     * 设置当前用户名
     * @param nickName 用户nickName
     */
    public setUserName(nickName: string) {
        this.userName = nickName;
    }

    /**
     * 得到头像url
     * @returns 
     */
    public getUserHeadUrl(): string {
        return this.headUrl;
    }

    /**
     * 设置头像Url
     * @param url 头像url
     */
    public setUserHeadUrl(url: string) {
        this.headUrl = url;
    }

    /**************************************************************************************************************************************************************************
     * 广告功能实现，广告接口
     *
     * bannner广告
     * 插页广告
     * 激励视频广告
     * 格子广告
     * 
     * 
     * 
     * ************************************************************************************************************************************************************************/

    /**
     * 用来存储创建的bannner广告
     */
    public bannerADArray = [];
    /**
     * 创建banner广告
     * 广告的位置可以通过修改onResize来修订
     * 横竖屏的计算方式不一样
     * 广告的宽高可以通过style来修订
     */
    public createBannerAd() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (wx.createBannerAd) {
                for (let i = 0; i < ADMOB_BANNER_ID_ARRAY.length; i++) {
                    this.bannerADArray[i] = wx.createBannerAd({
                        adUnitId: ADMOB_BANNER_ID_ARRAY[i],
                        style: {
                            left: wx.getSystemInfoSync().windowHeight - wx.getSystemInfoSync().windowHeight * 43 / 150,//(43/150广告固定宽高比)
                            top: (wx.getSystemInfoSync().windowHeight - 300) / 2,
                            width: 600,
                        },
                        adIntervals: 30,
                    });
                    this.bannerADArray[i].onResize((size) => {
                        const { windowWidth, windowHeight } = wx.getSystemInfoSync();
                        this.bannerADArray[i].style.left = (windowHeight - size.height) / 2;
                        if (cc.sys.os === cc.sys.OS_IOS && (size.width / size.height) > 2.1) {
                            this.bannerADArray[i].style.top = windowWidth * 0.93 - size.width;
                        }
                        else {
                            this.bannerADArray[i].style.top = windowWidth - size.width;
                        }
                    });
                    this.bannerADArray[i].onError(err => {
                        console.log(err);
                        console.log("banner广告创建失败");
                    });
                }
            }
            else {
                this.showModal("提示", "当前版本过低，无法加载广告");
            }
        }
    }

    /**
     * 显示隐藏banner广告
     * @param isShow 显示/隐藏banner广告
     * @param index 第几个广告
     */
    public showBannerAd(isShow: boolean, index: number = -1) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            for (let i = 0; i < this.bannerADArray.length; i++) {
                if (this.bannerADArray[i] != null) {
                    if (i == index) {
                        if (isShow) {
                            this.bannerADArray[i].show();
                            setTimeout(() => {
                                this.bannerADArray[i].show();
                            }, 500);
                        }
                        else {
                            this.bannerADArray[i].hide();
                            setTimeout(() => {
                                this.bannerADArray[i].hide();
                            }, 500);
                        }
                    }
                    else {
                        this.bannerADArray[i].hide();
                        setTimeout(() => {
                            this.bannerADArray[i].hide();
                        }, 500);
                    }
                }

            }
        }
    }

    /**
     * 用来保存创建的插屏广告
     */
    public interstitialAd = null;
    /**
     * 创建插屏广告
     */
    public createInterstitialAd() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (wx.createInterstitialAd) {
                this.interstitialAd = wx.createInterstitialAd({
                    adUnitId: ADMOB_INTERSTITIAL_ID,
                });
            }
        }
    }

    /**
     * 展示插屏广告
     */
    public showInterstitialAd() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (this.interstitialAd) {
                this.interstitialAd.show().catch((err) => {
                    console.error(err);
                });
            }
        }
    }

    /**
     * 用来存储创建的激励视频广告
     */
    public rewardVideoAd = null;
    /**
     * 记录激励视频广告是否加载成功
     */
    public loadVideo = false;
    /**
     * 创建激励视频广告
     * @param successCallBack 激励视频播放成功后的回调 
     * @param failCallBack 激励视频未成功播放后的回调
     */
    public createRewardVideoAd(successCallBack: () => void, failCallBack: () => void) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (wx.createRewardVideoAd) {
                this.rewardVideoAd = wx.createRewardVideoAd({
                    adUnitId: ADMOB_REWARDED_ID
                });
                this.loadVideo = false;
                this.rewardVideoAd.onLoad(() => {
                    console.log("视频加载成功");
                    this.loadVideo = true;
                });
                this.rewardVideoAd.onError((err) => {
                    console.log("视频加载失败");
                    this.loadVideo = false;
                });
                this.rewardVideoAd.onClose((res) => {
                    this.loadVideo = false;
                    if (res && res.isEnd || res === undefined) {
                        console.log("播放完成之后再关闭");
                        //正常关闭后的回调
                        successCallBack();
                    }
                    else {
                        console.log("中途关闭播放");
                        //非正常关闭的回调
                        failCallBack();
                    }
                    //恢复背景音乐
                    AudioMgr.Instance(AudioMgr).resumeBGM();
                });
            }
        }
    }

    /**
     * 显示激励视频广告
     */
    public showRewardVideoAd() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (this.rewardVideoAd != null) {
                if (this.loadVideo) {
                    this.showTips("暂时没有可播放的广告，请稍后再试！");
                }
                this.rewardVideoAd.show().then(() => {
                    AudioMgr.Instance(AudioMgr).pauseBGM();
                }).catch((err) => {
                    this.rewardVideoAd.load().then(() => {
                        AudioMgr.Instance(AudioMgr).pauseBGM();
                    });
                });
            }

        }
    }

    /**
     * 用来保存创建的格子广告
     */
    public gridAd = null;
    /**
     * 用来记录格子广告是否创建成功
     */
    public gridAdError = false;
    /**
     * 创建格子广告
     */
    public createGridAd() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let offsetY = 100;
            let size = cc.view.getVisibleSize();
            if (cc.sys.os === cc.sys.OS_IOS && size.height / size.width > 2.1) {
                offsetY = 120;
            }
            this.gridAd = wx.createGridAd({
                adUnitId: ADMOB_GRID_ID_ARRAY,
                adTheme: 'white',
                gridCount: 5,
                style: {
                    left: wx.getSystemInfoSync().windowWidth / 2 - 330 / 2,
                    top: wx.getSystemInfoSync().windowHeight - offsetY,
                    width: 330,
                    opacity: 0.8,
                },
            });
            this.gridAd.onLoad(() => {
                this.gridAdError = false;
            });
            this.gridAd.onError(err => {
                this.gridAdError = true;
                this.gridAd.destroy();
                console.log(err);
                console.log('createGridAd fail');
            });
        }
    }

    /**
     * 显示/隐藏格子广告
     * @param isShow 显示/隐藏
     */
    public showGridAd(isShow: boolean) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (wx.createGridAd) {
                if (this.gridAd != null) {
                    if (isShow) {
                        if (this.gridAdError) {
                            this.gridAdError = false;
                            this.createGridAd();
                            this.showBannerAd(true, 0);
                        }
                        else {
                            this.gridAd.show();
                        }
                    }
                    else {
                        this.gridAd.hide();
                    }
                }
            }
            else {
                this.showBannerAd(true, 0);
            }
        }
    }

    /**************************************************************************************************************************************************************************
     * shareAppMessage相关功能实现(分享图宽高比5:4)
     *
     * 开启右上角三个点的转发（转发到好友/朋友圈）
     * 普通转发
     * 礼物赠送功能
     * 监听上述事件触发回调
     * 
     * 赠送礼物的规则：
     * 只要点击赠送按钮之后，礼物就一律默认已经送出，不管有没有转发消息出去
     * 每天不限赠送次数（如果需求要限制次数可以自行添加）
     * 
     * 领取规则：
     * 不能领取自己赠送的礼物
     * 不能领取已超过领取时间的礼物
     * 不能领取已被领取过的礼物
     * 领取一个改价赠送的礼物后，在规定时间内，不能再次领取该玩家赠送的礼物，（时间可以根据需求自定义）
     * 
     * ************************************************************************************************************************************************************************/

    /**
     * 记录朋友圈的转发
     */
    public isShareToFriendCircle = false;
    /**
     * 记录右上角三个点的转发
     */
    public isUpShare = false;
    /**
     * 开启右上角三个点的转发
     * 转发到好友和朋友圈开启
     */
    public openFriendShare() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.showShareMenu({
                withShareTicket: true,
                menus: ["shareAppMessage", "shareTimeline"]
            });

            //带海报的分享
            wx.onShareTimeline(() => {
                this.isShareToFriendCircle = true;
                return {
                    title: "", //需要自行填写
                    imageUrl: "",//需要自行填写
                    imageUrlId: '',
                    imagePreviewUrl: "",//需要自行填写
                    imagePreviewUrlId: '',
                    query: '',
                    path: '',
                }
            });

            //不带任何感情色彩，就只是分享游戏，带图片的转发
            wx.onShareAppMessage(() => {
                this.isUpShare = true;
                return {
                    title: "",//需要自行填写
                    imageUrl: "",//需要自行填写
                    query: '',
                    imageUrlId: '',
                    promise: '',
                    toCurrentGroup: false,
                    path: '',
                }
            });
        }
    }

    /**
     * 记录普通转发（普通转发）
     */
    public isDriveShare = false;
    /**
     * 普通转发，啥也不做
     * @param title 转发的标题
     * @param imageUrl 转发的图片路径
     */
    public share(title: string, imageUrl: string) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.isDriveShare = true;
            wx.shareAppMessage({
                title: title,
                imageUrl: imageUrl,
                query: "",
                imageUrlId: ""
            });
        }
    }

    /**
     * 记录赠送礼物
     */
    public isGiveGiftShare = false;
    /**
     * 记录当前赠送的是什么礼物
     */
    public currentGiveGift = null;
    /**
     * 赠送礼物
     * @param type 礼物类型，送的是什么礼物 
     * @param title 转发的标题
     * @param imageUrl 转发的图片路径
     */
    public giveGift(type: string, title: string, imageUrl: string) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.updateShareMenu({
                withShareTicket: true,
                isPrivateMessage: true,
                success: (res) => {
                    this.isGiveGiftShare = true;
                    this.currentGiveGift = type;
                    wx.shareAppMessage({
                        title: title,
                        imageUrl: imageUrl,
                        query: "type=" + type + "&uid=" + this.UID + "&time=" + Util.Instance(Util).getTime(),
                        imageUrlId: ""
                    });
                }
            });
        }
    }

    /**
     * 记录是否收礼物（用来控制收礼物的逻辑，防止多次调用）
     */
    public isReceivedGift = true;
    /**
     * 开启分享的时间
     */
    public startShareTime = null;
    /**
     * 监听游戏进入退出后台事件
     */
    public onShow() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.onHide(() => {
                this.isReceivedGift = true;
                this.startShareTime = new Date().getTime();
            });
            wx.onShow((res) => {
                //普通转发成功的回调
                if (this.isDriveShare) {
                    this.isDriveShare = false;
                    if ((new Date().getTime() - this.startShareTime) > Util.Instance(Util).hourToMilliSecond(5 / 60 / 60)) {
                        this.showTips('分享成功');
                        //可以在此处补充分享成功的回调
                    }
                    else {
                        this.showTips("分享失败");
                    }
                }

                //转发到朋友圈成功的回调
                if (this.isShareToFriendCircle) {
                    this.isShareToFriendCircle = false;
                    if ((new Date().getTime() - this.startShareTime) > Util.Instance(Util).hourToMilliSecond(5 / 60 / 60)) {
                        this.showTips('分享成功');
                        //可以在此处补充分享成功的回调
                    }
                    else {
                        this.showTips("分享失败");
                    }
                }

                //右上角三个点的转发成功回调
                if (this.isUpShare) {
                    this.isUpShare = false;
                    if ((new Date().getTime() - this.startShareTime) > Util.Instance(Util).hourToMilliSecond(5 / 60 / 60)) {
                        this.showTips('分享成功');
                        //可以在此处补充分享成功的回调
                    }
                    else {
                        this.showTips("分享失败");
                    }
                }

                /**
                 * 赠送礼物成功的回调，这里的回调，无论你是否真的把礼物赠送出去一定会触发，只要按了赠送按钮，就一定会触发
                 */
                if (this.isGiveGiftShare) {
                    this.isGiveGiftShare = false;
                    this.showTips("赠送成功");
                    //赠送礼物成功的回调函数callback，一般是从背包里把物品删掉一个，金币啥的，看具体需求进行处理
                    //callback,赠送的物品通过currentGiveGift获取

                    this.currentGiveGift = null;
                }

                //收礼物的监听回调,这个监听的冷启动事件，即游戏已在后台运行
                if (this.isReceivedGift && res.query.uid != undefined) {
                    this.isReceivedGift = false;
                    let uid = res.query.uid;
                    let type = res.query.type;
                    let time = res.query.time;
                    let chatType = res.query.chatType;  //1,2是私聊会话窗口，3,4是群聊会话窗口
                    if (chatType == 3 || chatType == 4) {
                        //如果是群聊里领取的礼物，验证需要通过外部的数据库来进行验证
                        if (this.checkGiftInGroupChat(uid, Number(time))) {
                            TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftPlayerInfoInGroup(uid);
                            TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftInfoInGroup(uid, time);
                            // TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftsInfo(new Date().getTime(), this.getUserName(), type);
                            //根据type来进行后续逻辑处理

                        }
                    }
                    else {
                        //私聊领取的礼物
                        if (this.checkGiftInPrivateChat(uid, Number(time))) {
                            this.showModal('', '礼物领取成功！');
                            StorageMgr.Instance(StorageMgr).updateReceivedGiftsInfo(uid, new Date().getTime().toString());
                            StorageMgr.Instance(StorageMgr).updateDisabledGiftsInfo(uid, time.toString());
                            // TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftsInfo(new Date().getTime(), this.getUserName(), type);
                            //根据type，来进行礼物成功领取后的逻辑处理

                        }
                    }
                }
            });
        }
    }

    /**
     * 监听热启动事件（游戏没有启动）,赠送礼物事件
     */
    public onLaunchOptionsSync() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let value = wx.getLaunchOptionsSync();
            if (value.query.uid != undefined) {
                let uid = value.query.uid;
                let type = value.query.type;
                let time = value.query.time;
                let chatType = value.query.chatType;
                if (chatType == 3 || chatType == 4) {
                    //如果是群聊里领取的礼物，验证需要通过外部的数据库来进行验证
                    if (this.checkGiftInGroupChat(uid, Number(time))) {
                        TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftPlayerInfoInGroup(uid);
                        TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftInfoInGroup(uid, time);
                        // TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftsInfo(new Date().getTime(), this.getUserName(), type);
                        //根据type来进行后续逻辑处理

                    }
                }
                else {
                    //私聊领取的礼物
                    if (this.checkGiftInPrivateChat(uid, Number(time))) {
                        this.showModal('', '礼物领取成功！');
                        StorageMgr.Instance(StorageMgr).updateReceivedGiftsInfo(uid, new Date().getTime().toString());
                        StorageMgr.Instance(StorageMgr).updateDisabledGiftsInfo(uid, time.toString());
                        // TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftsInfo(new Date().getTime(), this.getUserName(), type);
                        //根据type，来进行礼物成功领取后的逻辑处理

                    }
                }
            }
        }
    }

    public lostTime = Util.Instance(Util).hourToMilliSecond(24);

    /**
     * 验证玩家收到的礼物是否合法（这里只验证非群消息入口）
     * @param openid 赠送礼物的玩家openid
     * @param sendTime 赠送礼物的时间
     * @returns 返回验证结果
     */
    public checkGiftInPrivateChat(uid: string, sendTime: number): boolean {
        //验证是否是自己赠送的礼物
        if (uid == this.UID) {
            this.showModal('', '不能领取自己赠送的礼物');
            return false;
        }
        //验证礼物是否失效，24个小时不领取就失效了
        if ((new Date().getTime() - sendTime) >= this.lostTime) {  //失效时间可以自定义
            this.showModal('', '抱歉，礼物已失效！');
            return false;
        }
        let disabledGiftInfo = StorageMgr.Instance(StorageMgr).getDisabledGiftsInfo();
        //验证是否领取过该礼物
        for (let i = 0; i < disabledGiftInfo.length; i++) {
            if (disabledGiftInfo[i].openid == uid && Number(disabledGiftInfo[i].sendTime) == sendTime) {
                this.showModal('', '您已领取过该礼物，不能重复领取！');
                return false;
            }
        }
        // let receivedGiftInfo = StorageMgr.Instance(StorageMgr).getReceivedGiftsInfo();
        // if (receivedGiftInfo.length == 0) { return; }
        // for (let i = 0; i < receivedGiftInfo.length; i++) {
        //     //是否领取过该玩家的礼物
        //     if (receivedGiftInfo[i].openid == openid) {
        //         //验证距离上一次领取该玩家礼物是否超过了规定时间,规定时间内不能领取同一个玩家的礼物多次
        //         if ((new Date().getTime() - Number(receivedGiftInfo[i].receivedTime) < Util.Instance(Util).hourToMilliSecond(2))) {
        //             this.showModal('', '您在两小时内已领取过该玩家赠送的礼物，请稍后再试!');
        //             return false;
        //         }
        //     }
        // }
        let receivedGiftPromise = TCloudMgr.Instance(TCloudMgr).inquireReceivedGiftPlayerInfoInGroup(uid);
        Promise.all([receivedGiftPromise]).then((res) => {
            let gift = res[0];
            console.log('gift:', gift);
            let receivedGiftInfo = StorageMgr.Instance(StorageMgr).getReceivedGiftsInfo();
            let privateGiftInfo = null;
            let groupGiftInfo = null;
            //一个玩家的礼物也没有领取过
            if (gift == null && receivedGiftInfo.length == 0) { return true; }
            for (let i = 0; i < gift.length; i++) {
                //是否领取过该玩家赠送的礼物(群组中)
                if (gift[i].UID == uid) {
                    // if ((new Date().getTime() - Number(gift[i].receivedTime)) < Util.Instance(Util).hourToMilliSecond(2)) {
                    //     this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                    //     return false;
                    // }
                    groupGiftInfo = gift[i];
                }
            }
            for (let i = 0; i < receivedGiftInfo.length; i++) {
                //是否领取过该玩家赠送的礼物(私聊)
                if (receivedGiftInfo[i].openid == uid) {
                    privateGiftInfo = receivedGiftInfo[i];
                }
            }
            if (groupGiftInfo != null && privateGiftInfo != null) {
                if (groupGiftInfo.RECEIVEDTIME >= privateGiftInfo.receivedTime) {
                    if ((new Date().getTime() - Number(groupGiftInfo.RECEIVEDTIME) < Util.Instance(Util).hourToMilliSecond(2))) {
                        this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                        return false;
                    }
                }
                else {
                    if ((new Date().getTime() - Number(privateGiftInfo.receivedTime) < Util.Instance(Util).hourToMilliSecond(2))) {
                        this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                        return false;
                    }
                }
            }
            if (groupGiftInfo != null && privateGiftInfo == null) {
                if ((new Date().getTime() - Number(groupGiftInfo.RECEIVEDTIME) < Util.Instance(Util).hourToMilliSecond(2))) {
                    this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                    return false;
                }
            }
            if (groupGiftInfo == null && privateGiftInfo != null) {
                if ((new Date().getTime() - Number(privateGiftInfo.receivedTime) < Util.Instance(Util).hourToMilliSecond(2))) {
                    this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * 验证群组里的玩家收到的礼物是否合法（这里只查验群组里的礼物）
     * @param openid 赠送礼物的玩家uid
     * @param sendTime 赠送礼物的时间
     * @returns 
     */
    public checkGiftInGroupChat(uid: string, sendTime: number) {
        if (uid == this.UID) {
            this.showModal('', '不能领取自己赠送的礼物');
            return false;
        }
        //验证礼物是否失效，24个小时不领取就失效了
        if ((new Date().getTime() - sendTime) >= this.lostTime) {
            this.showModal('', '抱歉，礼物已失效！');
            return false;
        }
        let receivedGiftsPromise = TCloudMgr.Instance(TCloudMgr).inquireReceivedGiftInfoInGroup(uid, sendTime);
        Promise.all([receivedGiftsPromise]).then((res) => {
            let gifts = res[0];
            //该礼物是否已经被群里的人领取过了
            if (gifts != null) {
                return false;
            }
            else {
                //没被领取
                let receivedGiftPromise = TCloudMgr.Instance(TCloudMgr).inquireReceivedGiftPlayerInfoInGroup(uid);
                Promise.all([receivedGiftPromise]).then((res) => {
                    let gift = res[0];
                    let receivedGiftInfo = StorageMgr.Instance(StorageMgr).getReceivedGiftsInfo();
                    let privateGiftInfo = null;
                    let groupGiftInfo = null;
                    //一个玩家的礼物也没有领取过
                    if (gift == null && receivedGiftInfo.length == 0) { return true; }
                    for (let i = 0; i < gift.length; i++) {
                        //是否领取过该玩家赠送的礼物(私聊中)
                        if (gift[i].UID == uid) {
                            // if ((new Date().getTime() - Number(gift[i].receivedTime)) < Util.Instance(Util).hourToMilliSecond(2)) {
                            //     this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                            //     return false;
                            // }
                            groupGiftInfo = gift[i];
                        }
                    }
                    for (let i = 0; i < receivedGiftInfo.length; i++) {
                        //是否领取过该玩家赠送的礼物(群组中)
                        if (receivedGiftInfo[i].openid == uid) {
                            privateGiftInfo = receivedGiftInfo[i];
                        }
                    }
                    if (groupGiftInfo != null && privateGiftInfo != null) {
                        if (groupGiftInfo.RECEIVEDTIME >= privateGiftInfo.receivedTime) {
                            if ((new Date().getTime() - Number(groupGiftInfo.RECEIVEDTIME) < Util.Instance(Util).hourToMilliSecond(2))) {
                                this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                                return false;
                            }
                        }
                        else {
                            if ((new Date().getTime() - Number(privateGiftInfo.receivedTime) < Util.Instance(Util).hourToMilliSecond(2))) {
                                this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                                return false;
                            }
                        }
                    }
                    if (groupGiftInfo != null && privateGiftInfo == null) {
                        if ((new Date().getTime() - Number(groupGiftInfo.RECEIVEDTIME) < Util.Instance(Util).hourToMilliSecond(2))) {
                            this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                            return false;
                        }
                    }
                    if (groupGiftInfo == null && privateGiftInfo != null) {
                        if ((new Date().getTime() - Number(privateGiftInfo.receivedTime) < Util.Instance(Util).hourToMilliSecond(2))) {
                            this.showModal("", "您在两小时内已领取过该玩家赠送的礼物，请稍后再试!");
                            return false;
                        }
                    }
                    return true;
                });
            }
        });
    }

    /**************************************************************************************************************************************************************************
     * 利用云开发功能实现世界排行榜功能
     * 排行榜加载性能优化处理建议：
     * 给scrollView添加触底的状态更新函数，每次触底之后从数据库中取一次数据，显示到页面上去。每次关闭清除掉排行榜，打开之后重新查询数据库
     * openid
     * 头像
     * 名字
     * 排行依据（根据什么数据来排）
     * 
     * 上传排行榜数据
     * 获取排行榜数据
     * 
     * ************************************************************************************************************************************************************************/
    /**
     * 上传用户数据
     * @param data 
     */
    public setData(data: number) {
        // TCloudMgr.Instance(TCloudMgr).uploadRankInfo(this.UID, this.getUserHeadUrl(), this.getUserName(), data);
        console.log('UID:', this.UID);
        TCloudMgr.Instance(TCloudMgr).upLoadRankInfo(this.UID, this.getUserHeadUrl(), this.getUserName(), data);
    }

    /**
     * 获取排行榜数据,利用获取的数据实现排行榜界面的搭建
     * @param startNumber 从第startNumber个数据开始取
     * @param maxLimitNumber 每次查maxLimitNumber个数据
     */
    public getData(startNumber: number, limitNumber: number) {
        // return TCloudMgr.Instance(TCloudMgr).inquireRankInfo();
        TCloudMgr.Instance(TCloudMgr).inquireRankInfo(startNumber, limitNumber).then((res) => {
            console.log(res.result);
            return res.result;
        });
    }

    /**
     * 查询所有的排行榜数据
     */
    public getAllData() {
        TCloudMgr.Instance(TCloudMgr).inquireAllRankInfo().then((res) => {
            console.log(res.result);
            return res.result;
        });
    }

    /**
     * 查询自己在数据库中的排行榜数据
     */
    public getMyselfData() {
        TCloudMgr.Instance(TCloudMgr).inquireMyselfRankInfo(this.UID).then((res) => {
            console.log(res.result);
            return res.result;
        });
    }


    /**************************************************************************************************************************************************************************
     * 其他基础功能实现
     *
     * 获取用户uid（具有唯一标识）
     * 文本提示消息，动态提示框，需要手动关闭
     * 显示消息提示框，不需要手动关闭
     * 震动
     * 自定义播放视频功能
     * 云开发数据库监听（用于实现大厅消息等功能，当数据库中的数据发生变化时，所有客户端都能监听到，从而实现对应的函数逻辑）
     * 
     * 
     * ************************************************************************************************************************************************************************/

    /**
     * 用来保存获取的uid
     */
    public UID = null;
    /**
     * 获取用户id，具有唯一标识
     */
    public getUID() {
        // console.log('进来了吗');
        // let uidPromise = TCloudMgr.Instance(TCloudMgr).getUID();
        // Promise.all([uidPromise]).then((res) => {
        //     this.UID = res[0].result;
        //     console.log(this.UID);
        // });
        // // this.UID = TCloudMgr.Instance(TCloudMgr).getUID();
        // // console.log(this.UID);
        TCloudMgr.Instance(TCloudMgr).getUID().then((res) => {
            // console.log('成功：',res);
            this.UID = res.result;
            console.log('成功:', this.UID);
        });

    }

    /**
     * 文本提示消息,动态提示框，需要手动关闭
     * @param title 提示标题 
     * @param text 提示文本
     * @param successCallback 成功按钮的回调
     */
    public showModal(title: string, text: string, successCallback?: () => void) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.showModal({
                title: title,
                content: text,
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: () => {
                    if (successCallback) { successCallback(); }
                }
            });
        }
    }

    /**
     * 显示消息提示框，不需要手动关闭
     * @param title 显示消息的文本
     */
    public showTips(title: string) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.showToast({
                title: title,
                icon: 'none',
                duration: 2000,
            });
        }
    }

    /**
     * 手机震动
     */
    public vibrateShort() {
        wx.vibrateLong({
            success: (result) => {
                console.log("震动成功");
            },
            fail: () => {
                console.log("震动失败");
            },
        });
    }

    /**
     * 保存自己创建的自定义视频
     */
    public selfVideo = null;
    /**
     * 创建自定义视频
     * @param src 视频源，这个是远程服务器上的地址
     * @param successCallBack 视频播放成功后的回调
     */
    public createSelfVideo(src: string, successCallBack: () => void) {
        if (!AudioMgr.Instance(AudioMgr).getIsCloseMusic()) {
            AudioMgr.Instance(AudioMgr).pauseAllMusic();
        }
        let sysInfo = wx.getSystemInfoSync();
        let width = sysInfo.screenWidth;
        let height = sysInfo.screenHeight;
        this.selfVideo = wx.createVideo({
            x: 0,
            y: 0,
            width: width,
            height: height,
            src,
            autoplay: true,
            obeyMuteSwitch: true,
            showCenterPlayBtn: false,
            // 显示默认的视频控件
            controls: false,
            showProgress: true,
            showProgressInControlMode: true,
        });
        this.selfVideo.onEnded(() => {
            this.selfVideo.destroy();
            this.selfVideo.offEnded();
            this.showTips("视频播放成功");
            successCallBack();
            if (!AudioMgr.Instance(AudioMgr).getIsCloseMusic()) {
                AudioMgr.Instance(AudioMgr).resumeAllMusic();
            }
        });
        this.selfVideo.onError((err) => {
            this.selfVideo.destroy();
            this.selfVideo.offEnded();
            this.showTips("视频播放失败");
            successCallBack();
            if (!AudioMgr.Instance(AudioMgr).getIsCloseMusic()) {
                AudioMgr.Instance(AudioMgr).resumeAllMusic();
            }
        });
    }

    /**
    * 截图（指定位置，大小）
    * @param satrtPos = cc.v2(225,202); //以canvas左上角为坐标圆点，计算出来的位置坐标
    * @param box = cc.v2(300,500); // 以图片长宽计算出来的坐标
    */
    public screenShot(satrtPos: cc.Vec2, box: cc.Vec2) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            var designCanvas = cc.game.canvas;
            var res = wx.getSystemInfoSync();
            var rate = res.screenWidth / designCanvas.width;
            var width = res.screenWidth / rate * (box.x / 750);
            var height = res.screenHeight / rate * (box.y / 1624);

            var tempFilePath = cc.game.canvas.toTempFilePathSync({
                x: designCanvas.width / 2 * (satrtPos.x / (750 / 2)),
                y: designCanvas.height / 2 * (satrtPos.y / (1624 / 2)),
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
            });
            return tempFilePath;
        }
    }

    /**
     * 获取当前网络状态
     */
    public getNetworkType():Promise<any>{
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            return new Promise((resolve, reject) => {
                wx.getNetworkType({
                    success: (result) => {
                        // console.log("是否有网络:", result.networkType);
                        resolve(result.networkType);
                    },
                });
            })

        }
        else {
            return null;
        }
    }

}
