/**
 * 资源加载管理类
 * 本地资源加载
 * 远程服务器资源加载
 * 腾讯云资源加载（腾讯云开发的存储也可以当做远程服务器使用） * 
 * 
 * 注意：
 * 预制体不使用远程加载
 * 图片远程加载是cc.texture2D格式，可通过new cc.SpriteFrame(cc.texture2D)进行转化
 */
import ResConstValue from "../Data/ResConstValue";
import Singleton from "../Util/Singleton";
import TCloudMgr from "../WeChat/TCloudMgr";

export default class ResMgr extends Singleton {

    /**
     * 用于存储加载的Map资源
     */
    public resMap = new Map();
    /**
     * 加载单个本地资源
     * @param urlName 资源名
     * @param url 资源路径
     * @returns 返回存储的资源Map对象
     */
    public loadLocal(urlName: string, url: string) {
        return new Promise((reslove, reject) => {
            cc.resources.load(url, (err, res) => {
                if (err) {
                    // this.loadLocal(urlName, url);
                    console.log("本地资源加载失败");
                    // this.loadLocal(urlName,url);
                    return;
                }
                this.resMap.set(urlName, res);
                reslove(this.resMap);
            });
        });
    }

    /**
     * 加载所有的本地资源
     * @returns 返回promise对象
     */
    public loadLocals() {
        let localResArray = [];
        if (ResConstValue.LocalResList.length <= 0) {
            return new Promise((reslove, reject) => {
                reslove("资源为空");
            });
        }
        for (let i = 0; i < ResConstValue.LocalResList.length; i++) {
            localResArray.push(this.loadLocal(ResConstValue.LocalResList[i].resName, ResConstValue.LocalResList[i].resLocalPath));
        }
        return Promise.all(localResArray);
    }

    /**
     * 加载单个远程资源
     * @param key 资源名
     * @param url 资源路径
     * @returns 返回存储的资源Map对象
     */
    public loadRemote(urlName: string, url: string) {
        return new Promise((reslove, reject) => {
            cc.assetManager.loadRemote(url, (err, res) => {
                if (err) {
                    // this.loadRemote(urlName, url);
                    console.log("远程资源加载失败");
                    return;
                }
                this.resMap.set(urlName, res);
                reslove(this.resMap);
            });
        });
    }

    /**
     * 加载所有远程资源
     * @returns 返回promise对象
     */
    public loadRemotes() {
        let remoteResArray = [];
        if (ResConstValue.remoteResList.length <= 0) {
            return new Promise((reslove, reject) => {
                reslove("资源为空");
            });
        }
        for (let i = 0; i < ResConstValue.remoteResList.length; i++) {
            remoteResArray.push(this.loadRemote(ResConstValue.remoteResList[i].resName, ResConstValue.remoteResList[i].remoteResPath));
        }
        return Promise.all(remoteResArray);
    }

    //用来存储从腾讯云存储下载后的资源路径
    public tCloudTemFilePaths: { resName: string, temFilePath: string }[] = [];
    /**
     * 从腾讯云存储中下载资源
     * @param urlName 资源名
     * @param url 资源路径，即fileID
     * @returns 返回promise对象
     */
    public loadTCloudPath(urlName: string, url: string) {
        // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            return new Promise((reslove: (value: { resName: string, temFilePath: string }[]) => void, reject) => {
                TCloudMgr.Instance(TCloudMgr).downLoadFile(url, (path: string) => {
                    this.tCloudTemFilePaths.push({
                        resName: urlName,
                        temFilePath: path
                    });
                    reslove(this.tCloudTemFilePaths);
                });
            });
        // }
    }

    /**
     * 加载腾讯云存储的单个资源
     * @param urlName 资源名
     * @param url 资源从腾讯云服务器下载后的tempFilePath
     * @returns 返回promise对象
     */
    public loadTCload(urlName: string, url: string) {
        // if (cc.sys.platform != cc.sys.WECHAT_GAME) { return; }
        return new Promise((reslove, reject) => {
            cc.assetManager.loadRemote(url, (err, res) => {
                if (err) {
                    console.log("腾讯云资源加载失败");
                    // reject();
                    return;
                }
                // //判断资源类型是否为图片，进行一个转化能够直接使用
                // if (res._nativeAsset) {
                //     console.log(res._nativeAsset);
                //     res = new cc.SpriteFrame(res);
                // }
                console.log(res);
                this.resMap.set(urlName, res);
                console.log("资源数组:", this.resMap);
                reslove(this.resMap);
            })
        });
    }

    /**
     * 加载腾讯云存储里的所有资源
     * @returns 返回promise对象
     */
    public loadTClouds() {
        // if (cc.sys.platform != cc.sys.WECHAT_GAME) { return; }
        if (ResConstValue.tCloudResList.length <= 0) {
            return new Promise((reslove, reject) => {
                reslove("资源为空");
            });
        }
        let tCloudTemFilePathArray = [];
        for (let i = 0; i < ResConstValue.tCloudResList.length; i++) {
            tCloudTemFilePathArray.push(this.loadTCloudPath(ResConstValue.tCloudResList[i].resName, ResConstValue.tCloudResList[i].tCloudResPath));
        }
        return Promise.all(tCloudTemFilePathArray).then((temFilePaths) => {
            let tCloudResArray = [];
            for (let i = 0; i < temFilePaths[0].length; i++) {
                tCloudResArray.push(this.loadTCload(temFilePaths[0][i].resName, temFilePaths[0][i].temFilePath));
            }
            return Promise.all(tCloudResArray);
        });
    }

    /**
    * 根据key值获取已加载的资源
    * @param name 定义的key值,资源名
    * @returns 返回通过key值获取到的资源
    */
    public getResByName(name: string) {
        if (!this.resMap.get(name)) {
            console.log("资源不存在");
            return;
        }
        return this.resMap.get(name);
    }

    /**
     * 一次性加载，本地，远程服务器，云服务器上的所有资源（可根据项目实际情况，自行制定加载策略）
     * @returns 返回的是一个promise对象
     */
    public loadAllRes() {
        // console.log('调用几次');
        return this.loadLocals().then((res) => {
            // console.log("本地资源加载完成:", res);
            return this.loadRemotes().then((res) => {
                // console.log("远程资源加载完成:", res);
                // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                    return this.loadTClouds().then((res) => {
                        // console.log("腾讯云资源加载完成：", res);
                    });
                // }

            });
        });
    }

}
