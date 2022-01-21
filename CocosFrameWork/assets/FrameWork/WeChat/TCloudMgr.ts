/**
 * 云开发相关的管理类,利用微信开发工具来实现云开发的功能
 * 因为ts无法直接识别wx的Api所以需要引进wx.d.ts文件来扩展，可以避免wx标红（不引进也可以，其实没啥用，主要是开发的时候看着舒服）
 * 有些api仍然标红是因为wx.d.ts文件尚未包含，可以自行扩展，以后可以作为自己开发的文件使用
 * 只要api没写错，不用去管标红的东西，不影响正常使用
 * wx.d.ts文件需要和creator.d.ts放在同级目录下
 * 需要注意的是数据库的开发权限，以免因为数据库权限错误而导致开发错误
 * 
 * 如何在本地开发云函数并在微信引擎里正确使用
 * 1，在assets文件的同级目录中新建build-templates/wechatgames/functions文件夹
 * 2，构建项目，在微信开发工具中新建云函数，并引用tcb-router包（具体步骤：右键点击云函数文件，外部打开终端窗口，输入npm install --save tcb-router）
 * 3，关闭微信开发工具，将构建的wechatgames文件中的functions文件夹中的文件复制粘贴到build-templates/wechatgames/functions文件夹中
 * 4，在build-templates/wechatgames/functions文件夹下的云函数文件中用tcb-router进行云函数的开发（构建后，build-templates/wechatgames/functions文件夹中的内容会覆盖build/wechatgames/functions文件夹里的内容）
 * 5，开发完成后，再次构建打开微信开发工具，需要右键上传部署云函数
 * 云函数结构：
 *  const app = new TcbRouter({
        event
    });
    app.router("UID",async(ctx,next)=>{
        
        ctx.body = ？？？？;
    });
 */
import Singleton from "../Util/Singleton";

//云开发环境名，需要设置为项目自己的
const envName = "test-1g6fmcaqc00fb341";

export default class TCloudMgr extends Singleton {

    // /**
    //  * 初始化云环境
    //  * env,云开发环境名，在云开发面板获取
    //  */
    // public initCloud() {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         wx.cloud.init({
    //             env: envName,
    //             traceUser: true,
    //         });
    //     }
    // }

    /*****************************************************************************************************************
     * 云开发存储相关操作，调用云函数
     * 下载文件
     * 
     *****************************************************************************************************************/
    /**
     * 从腾讯云存储下载文件
     * @param url 文件路径，fileId
     * @param callBack 回调函数
     */
    public downLoadFile(url: string, callBack: (path: string) => void) {
        // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        //     this.initCloud();
        //     wx.cloud.downloadFile({
        //         fileID: url,
        //         success: (res) => {
        //             callBack(res.tempFilePath);
        //         },
        //         fail: (err) => {
        //             console.log(err);
        //         }
        //     });
        // }
        //初始化环境
        let app = cc.cloud && cc.cloud.initialize();
        app.getTempFileURL({
            fileList:[url]
        }).then((res)=>{
            console.log("云开发文件下载链接:",res.fileList[0].download_url);
            callBack(res.fileList[0].tempFileURL);
        });
    }

    // /************************************************************************************************************************************************************
    //  * 数据库操作，调用云函数
    //  * userInfo云函数（uid查询）,用于获取uid
    //  * receivedGiftInfoInGroup云函数操作数据库（上传（更新）数据，查询数据），该数据库用于判断是否领取过群组里玩家的礼物，以及规定时间内是否已经领取过该玩家的礼物（只限定于群里数据）
    //  * receivedGiftsInfoInGroup云函数操作数据库（上传数据，查询数据,删除数据），该数据库用于判断礼物是否已经被领取过（只限定于群组数据）
    //  * receivedGifts云函数操作数据库（上传删除数据）,该数据库用于记录被领取的礼物（用于全局消息广播，游戏内聊天）
    //  ************************************************************************************************************************************************************/

    // /**
    //  * 调用userInfo云函数获取用户id
    //  * @returns 返回peomise对象
    //  */
    // public getOpenID(): Promise<any> {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         return new Promise((resolve: (value) => void, reject) => {
    //             wx.cloud.callFunction({
    //                 name: "userInfo",  //云函数名称
    //                 data: {
    //                     $url: 'UID',  //路由名称
    //                 }
    //             }).then((res) => {
    //                 console.log('UID:' + res);
    //                 resolve(res.result);
    //             });
    //         })
    //     }
    // }

    // /**
    //  * 调用receivedGiftInfoInGroup云函数上传数据到receivedGiftInfoInGroup数据库
    //  * 该数据库用于判断是否领取过群组里玩家的礼物，以及规定时间内是否已经领取过该玩家的礼物（只限定于群里数据）
    //  * @param openid 礼物赠送者的uid
    //  * @param receivedTime 礼物领取的时间
    //  */
    // public uploadReceivedGiftInfoInGroupCollection(openid: string, receivedTime: number) {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         wx.cloud.callFunction({
    //             name: 'receivedGiftInfoInGroup',
    //             data: {
    //                 $url: 'update',
    //                 openid,
    //                 receivedTime,
    //             }
    //         }).then((res) => {
    //             console.log("上传数据成功:", res);
    //         });
    //     }
    // }

    // /**
    //  * 调用receivedGiftInfoInGroup云函数查询receivedGiftInfoInGroup数据库中的数据
    //  * 该数据库用于判断是否领取过群组里玩家的礼物，以及规定时间内是否已经领取过该玩家的礼物（只限定于群里数据）
    //  * sendTime传入空值时，只返回最近一次
    //  * @param openid 礼物赠送者的uid
    //  * @returns 返回promise对象
    //  */
    // public inquireReceivedGiftInfoInGroupCollection(openid: string): Promise<Array<any>> {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         return new Promise((resolve: (value) => void, reject) => {
    //             this.initCloud();
    //             wx.cloud.callFunction({
    //                 name: 'receivedGiftInfoInGroup',
    //                 data: {
    //                     $url: 'inquire',
    //                     openid,
    //                 }
    //             }).then((res) => {
    //                 resolve(res.result);
    //             });
    //         });
    //     }
    // }

    // /**
    //  * 调用receivedGiftsInfoInGroup云函数上传数据到receivedGiftsInfoInGroup数据库
    //  * 该数据库用于判断礼物是否已经被领取过（只限定于群组数据）
    //  * @param openid 礼物赠送者的uid
    //  * @param sendTime 礼物赠送的时间
    //  */
    // public uploadReceivedGiftsInfoInGroupCollection(openid: string, sendTime: number) {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         wx.cloud.callFunction({
    //             name: 'receivedGiftsInfoInGroup',
    //             data: {
    //                 $url: 'upload',
    //                 openid,
    //                 sendTime,
    //             }
    //         }).then((res) => {
    //             console.log('数据上传成功');
    //         });
    //     }
    // }

    // /**
    //  * 调用receivedGiftsInfoInGroup云函数查询receivedGiftsInfoInGroup数据库中的数据
    //  * 该数据库用于判断礼物是否已经被领取过（只限定于群组数据）
    //  * @param openid 礼物赠送者的uid
    //  * @param sendTime 礼物赠送的时间
    //  * @returns 返回promise对象
    //  */
    // public inquireReceivedGiftsInfoGroupCollection(openid: string, sendTime: number): Promise<Array<any>> {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         return new Promise((resolve, reject) => {
    //             this.initCloud();
    //             wx.cloud.callFunction({
    //                 name: 'receivedGiftsInfoInGroup',
    //                 data: {
    //                     $url: 'inquire',
    //                     openid,
    //                     sendTime,
    //                 }
    //             }).then((res) => {
    //                 resolve(res.result);
    //             });
    //         });
    //     }
    // }

    // /**
    //  * 调用receivedGiftsInfoInGroup云函数删除receivedGiftsInfoInGroup数据库中的数据
    //  * 该数据库用于判断礼物是否已经被领取过（只限定于群组数据）
    //  * 删除比当前时间早24小时的数据
    //  */
    // public deleteReceivedGiftsInfoGroupCollection() {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         let time = null;
    //         time = new Date().getTime() - Util.Instance(Util).hourToMilliSecond(24);
    //         wx.cloud.callFunction({
    //             name: "receivedGiftsInfoInGroup",
    //             data: {
    //                 $url: 'delete',
    //                 time,
    //             }
    //         }).then((res) => {
    //             console.log("数据删除成功", res);
    //         });
    //     }
    // }

    // /**
    //  * 上传数据到监听数据库，用于保存当前监听所有的数据
    //  * @param receivedTime 收到礼物的时间
    //  * @param userName 用户名
    //  * @param type 礼物类型
    //  */
    // public uploadReceivedGiftsInfo(receivedTime: number, userName: string, type: string) {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         wx.cloud.callFunction({
    //             name: 'receivedGifts',
    //             data: {
    //                 $url: 'upload',
    //                 receivedTime,
    //                 userName,
    //                 type,
    //             }
    //         }).then((res) => {
    //             console.log("数据上传成功");
    //         });
    //     }
    // }

    // /**
    //  * 删除无用的数据
    //  */
    // public deleteReceivedGiftsInfo() {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         wx.cloud.callFunction({
    //             name: 'receivedGifts',
    //             data: {
    //                 $url: 'delete',
    //                 time: new Date().getTime(),
    //             }
    //         }).then((res) => {
    //             console.log("删除成功");
    //         });
    //     }
    // }

    // /**
    //  * 数据监听，监听数据库中的数据变化，来执行相关逻辑
    //  * 需要在游戏开始之前开启监听
    //  * 根据实际需求自行修改逻辑
    //  */
    // public onWatcher() {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         let db = wx.cloud.dataBase();
    //         db.collection('receivedGifts')
    //             .watch({
    //                 onChange: (snapshot) => {
    //                     let changesEvents = [];
    //                     if (snapshot.docChanges.length == 0) { return; }
    //                     for (let i = 0; i < snapshot.docChanges.length; i++) {
    //                         if (snapshot.docChanges[i].dataType == 'add') {
    //                             //这里是指当数据库中的数据增加时，记录增加的数据中的USERNAME和TYPE属性值，dataType的值通过官网自行查看
    //                             changesEvents.push({
    //                                 userName: snapshot.docChanges[i].doc.USERNAME,
    //                                 type: snapshot.docChanges[i].doc.TYPE,
    //                             });
    //                         }
    //                     }
    //                     if (changesEvents.length == 0) { return; }
    //                     //处理监听后的数据，数据都保存在changesEvents数组中,可传一个回调函数进来处理，将所有逻辑调用限制在wechat函数内

    //                 },
    //                 onError: (err) => {
    //                     console.log('监听出错:', err);
    //                 }
    //             })
    //     }
    // }

    // /**
    //  * 上传数据到排行榜数据库
    //  * @param openid 用户openid
    //  * @param url 用户头像
    //  * @param userName 用户名
    //  * @param data 排行依据的数据
    //  */
    // public uploadRankInfo(openid: string, url: string, userName: string, data: number) {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         wx.cloud.callFunction({
    //             name: 'rankInfo',
    //             data: {
    //                 $url: 'upload',
    //                 openid,
    //                 url,
    //                 userName,
    //                 data,
    //             }
    //         }).then((res) => {
    //             console.log('数据上传成功');
    //         });
    //     }
    // }

    // /**
    //  * 取出排行榜所有数据(从大到小排序)
    //  */
    // public inquireRankInfo() {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         wx.cloud.callFunction({
    //             name: 'rankInfo',
    //             data: {
    //                 $url: 'inquire',
    //             }
    //         }).then((res) => {
    //             console.log("我靠:" + res);
    //             // let data = res.result.data;
    //             // data.sort((a:{openid:string,url:string,userName:string,data:number},b:{openid:string,url:string,userName:string,data:number}):number=>{
    //             //     return b.data-a.data;
    //             // });  //sort,为true的时候交换，a-b从小到大排序，b-a从大到小排序
    //             // return data;
    //         });
    //     }
    // }

    // public inquire() {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         wx.cloud.callFunction({
    //             name: 'rankInfo',
    //             data: {
    //                 $url: 'inquireOne',
    //             }
    //         }).then((res) => {
    //             console.log("我是你爸爸:" + res.result);
    //         });

    //         // let db = wx.cloud.database({
    //         //     env:envName
    //         // }); 
    //         // db.collection('rankInfo').get().then((res)=>{
    //         //     //res.data
    //         //     // console.log("这是啥:"+res.data[0].score);
    //         //     for (let i = 0; i < res.data.length; i++) {
    //         //         console.log(res.data[i].score);                   
    //         //     }
    //         // });
    //     }
    // }

    // public update() {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //         this.initCloud();
    //         // wx.cloud.callFunction({
    //         //     name:'rankInfo',
    //         //     data:{
    //         //         $url:'update',
    //         //         openid:'string3',
    //         //         url:'string',
    //         //         userName:'string',
    //         //         data:20,
    //         //     }
    //         // }).then((res)=>{
    //         //     console.log("上传成功");
    //         // }); 

    //         let db = wx.cloud.database({
    //             env: envName
    //         });

    //         db.collection('rankInfo').where({
    //             OPENID: 'string2',  //如果有数据,只能取一条出来
    //         }).get().then((res) => {
    //             if (res.data.length == 0) {
    //                 db.collection('rankInfo').add({
    //                     data: {
    //                         OPENID: 'string2',
    //                         URL: 'string2',
    //                         USERNAME: 'string2',
    //                         DATA: 1,
    //                     }
    //                 }).then((res) => {
    //                     console.log('数据上传成功');
    //                 });
    //             }
    //             else {
    //                 console.log(res.data[0].DATA);
    //                 if (res.data[0].DATA < 8) {
    //                     let _id = res.data[0]._id;
    //                     db.collection('rankInfo').doc(_id).update({
    //                         //这里是怕头像和名字有所改变，所以干脆一起传了
    //                         data: {
    //                             URL: 'string2',
    //                             USERNAME: 'string2',
    //                             DATA: 8,
    //                         }
    //                     }).then((res) => {
    //                         console.log('排行数据更新成功');
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // }


    //////////////////////////////////////////////////////////////////////////////////功能分割///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 云开发还是推荐使用这种方法来做
     * 利用cocos自带的腾讯云开发插件提供的sdk，直接在本地实现并测试云函数
     * 云开发初始化需要更新环境id以及appAccessKeyId和appAccessKey，如果手机号不可用，需要修改，直接修改cocos账号绑定的手机号，主账号里是找不到该子用户的
     * 匿名登陆使用默认的appAccessKeyId和appAccessKey
     * 需要注意的是云函数的开发环境和配置文件的开发环境一定要一致，不然是访问不了云函数和数据库的，配置文件就不用说了，可以在云函数中初始化数据库的时候带上云开发环境id，避免因为环境而造成数据库无法访问连接
     * 云函数更新完毕后，需要重新更新上传云函数（此处的云函数调用和实现，与上面（微信开发工具）的云函数实现有细微的差别，需要注意别搞混淆了，微信小程序中实现肯定还是推荐tcb-router来实现，毕竟更方便）
     * 关于跨域问题导致资源加载失败，直接在后台环境安全配置添加域名
     * 
     * 提示：
     * 使用该sdk后，在微信开发者工具中进行调试的时候会提示未配置域名，这里直接勾选不验证域名即可，真机上没有这个问题（出现这个问题的主要原因是https无法给到验证域名白名单中，所以无法配置，当然只是针对这一个域名而已，其他的域名该配置还是得配）
     */

    /**
     * 初始化云开发环境，环境名称需要到云开发配置文件中更新对应的云开发环境（如果云开发环境变更，则配置文件中的云开发环境一定要更新）
     */
    public initCloud() {
        let app = cc.cloud && cc.cloud.initialize();
        let auth = app.auth({
            persistence: 'local'  //本地登录状态保留期限
        });
        return auth.anonymousAuthProvider().signIn()
        // .then((res) => {
        //     // 需要先做授权才能正常调用。此处使用匿名登陆方式访问云开发资源
        //     // 请到腾讯云后台 -> 云开发 -> 选择当前环境 -> 环境设置/登录授权中，确认已经启用匿名登录
        //     // 匿名登录有一定限制，可以更换为自定义登录等其他方式（需要自己实现，示例官方文档中都有）
        //     console.log('云开发初始化成功');
        // });
    }

    /**
     * 云函数调用模板
     * @param tcbFunName 云函数名称 
     * @param valueList 云函数传入的数据list，一般用一个action来区别调用的是哪个功能
     * @param callBack 回调函数
     */
    public callTcbFunction(tcbFunName: string, valueList: {}) {
        let app = cc.cloud && cc.cloud.initialize();
        return app.callFunction({
            name: tcbFunName,
            data: valueList
        })
    }

    /**
     * 获取玩家UID
     */
    public getUID() {
        let value = {
            action: 'getUID',
        };
        return this.callTcbFunction('userInfo', value);
    }

    /**
     * 上传玩家数据到数据库
     * @param uid 玩家uid
     * @param url 玩家头像url
     * @param userName 玩家nickName
     * @param data 数据
     */
    public upLoadRankInfo(uid: string, url: string, userName: string, data: number) {
        let value = {
            action: 'upload',
            param: {
                uid,
                url,
                userName,
                data,
            }
        };
        this.callTcbFunction('rankInfo', value).then((res) => {
            console.log('数据上传成功:', res.result);
        });
    }

    /**
     * 查询玩家排行榜数据
     * @param startNumber 从第startNumber个数据开始取
     * @param maxLimitNumber 每次查maxLimitNumber个数据
     */
    public inquireRankInfo(startNumber: number, maxLimitNumber: number) {
        let value = {
            action: 'inquire',
            param: {
                startNumber,
                maxLimitNumber,
            }
        };
        return this.callTcbFunction('rankInfo', value);
        // .then((res)=>{
        //     console.log("数据查询成功:",res.result);
        //     return res.result;
        // })
    }

    /**
     * 查询排行榜数据库中，自己的数据（或者任一uid的数据）
     * @param uid 玩家uid
     */
    public inquireMyselfRankInfo(uid: string) {
        let value = {
            action: 'inquireMyself',
            param: {
                uid,
            }
        }
        return this.callTcbFunction('rankInfo', value)
        // .then((res)=>{
        //     console.log('查询自己的数据:',res.result);
        //     return res.result;
        // });
    }

    /**
     * 查询所有的排行榜数据
     */
    public inquireAllRankInfo() {
        let value = {
            action: 'inquireAll',
            param: {

            }
        }
        return this.callTcbFunction('rankInfo', value);
    }

    /**
     * 上传玩家数据到已领取玩家信息数据库
     * @param uid 赠送礼物的玩家uid
     */
    public uploadReceivedGiftPlayerInfoInGroup(uid: string) {
        let value = {
            action: 'upload',
            param: {
                uid
            }
        }
        this.callTcbFunction('receivedGiftPlayerInfoInGroup', value).then((res) => {
            console.log('上传成功');
        });
    }

    /**
     * 查询领取礼物的信息
     * @param uid 赠送礼物的玩家uid
     */
    public inquireReceivedGiftPlayerInfoInGroup(uid: string): Promise<Array<any>> {
        let value = {
            action: 'inquire',
            param: {
                uid
            }
        }
        return new Promise((resolve, reject) => {
            this.callTcbFunction('receivedGiftPlayerInfoInGroup', value).then((res) => {
                console.log(res.result);
                resolve(res.result);
            });
        })
    }

    /**
     * 清除已领取玩家信息数据库中无效的数据
     */
    public deleteReceivedGiftPlayerInfoInGroup() {
        let value = {
            action: 'delete',
            param: {

            }
        }
        this.callTcbFunction('receivedGiftPlayerInfoInGroup', value).then((res) => {
            console.log('数据删除成功:', res.result);
        });
    }

    /**
     * 上传数据到已领取礼物信息数据库
     * @param uid 赠送礼物的玩家uid
     * @param sendTime 礼物赠送时间
     */
    public uploadReceivedGiftInfoInGroup(uid: string, sendTime: number) {
        let value = {
            action: 'upload',
            param: {
                uid,
                sendTime,
            }
        }
        this.callTcbFunction('receivedGiftInfoInGroup', value).then((res) => {
            console.log('上传成功:', res.result);
        });
    }

    /**
     * 查询礼物是否已经被领取
     * @param uid 赠送礼物的玩家UID
     * @param sendTime 赠送礼物的时间
     */
    public inquireReceivedGiftInfoInGroup(uid: string, sendTime: number): Promise<Array<any>> {
        let value = {
            action: 'inquire',
            param: {
                uid,
                sendTime
            }
        }
        return new Promise((resolve, reject) => {
            this.callTcbFunction('receivedGiftInfoInGroup', value).then((res) => {
                resolve(res.result);
            });
        })
    }

    /**
     * 清除已领取礼物信息数据库中的失效数据
     */
    public deleteReceivedGiftInfoInGroup() {
        let value = {
            action: 'delete',
            param: {

            }
        }
        this.callTcbFunction('receivedGiftInfoInGroup', value).then((res) => {
            console.log('数据清除成功:', res.result);
        });
    }

    /**
     * 上传数据到消息推送数据库
     * @param userName 用户名
     * @param type 礼物类型
     */
    public uploadReceivedGifts(userName: string, type: string) {
        let value = {
            action: 'upload',
            param: {
                userName,
                type,
            }
        }
        this.callTcbFunction('receivedGifts', value).then((res) => {
            console.log('上传成功:', res.result);
        });
    }

    /**
     * 删除消息推送数据库中的无效数据（可以定时清数据库数据，或者在进游戏或者退出游戏的时候执行）
     */
    public deleteReceivedGifts() {
        let value = {
            action: 'delete',
            param: {

            }
        }
        this.callTcbFunction('receivedGifts', value).then((res) => {
            console.log("删除数据成功:", res.result);
        });
    }

    /**
     * 开启消息推送监听（需要在游戏一开始开启）
     */
    public onWatcherReceivedGifts() {

        //初始化环境
        let app = cc.cloud && cc.cloud.initialize();
        let db = app.database();
        db.collection("receivedGifts")
            .watch({
                onChange: function (snapshot) {
                    let changesEvents = [];
                    if (snapshot.docChanges.length == 0) { return; }
                    for (let i = 0; i < snapshot.docChanges.length; i++) {
                        //这里是指当数据库中的数据增加时，记录增加的数据中的USERNAME和TYPE属性值，dataType的值通过官网自行查看
                        if (snapshot.docChanges[i].dataType == 'add') {
                            console.log("添加了");
                            changesEvents.push({
                                userName: snapshot.docChanges[i].doc.USERNAME,
                                type: snapshot.docChanges[i].doc.TYPE,
                            });
                        }
                    }
                    if (changesEvents.length == 0) { return; }
                    console.log('一次监听结束:', changesEvents);
                    //处理监听后的数据，数据都保存在changesEvents数组中,可传一个回调函数进来处理，将所有逻辑调用限制在wechat函数内

                },
                onError: function (err) {
                    console.error("the watch closed because of error", err);
                }
            });
    }
}
