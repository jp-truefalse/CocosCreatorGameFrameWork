import { playerState } from "../../FrameWork/Data/StateConstValue";
import ResMgr from "../../FrameWork/Manager/ResMgr";
import SpineMgr from "../../FrameWork/Manager/SpineMgr";
import StateMachineMgr from "../../FrameWork/Manager/StateMachineMgr";
import Util from "../../FrameWork/Util/Util";
import TCloudMgr from "../../FrameWork/WeChat/TCloudMgr";
import WeChatMgr from "../../FrameWork/WeChat/WeChatMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {

    @property(cc.Node)
    parentNode: cc.Node = null;

    @property(cc.Sprite)
    spriteNode: cc.Sprite = null;

    @property(sp.Skeleton)
    spineNode: sp.Skeleton = null;

    @property(cc.Prefab)
    generatePrefab: cc.Prefab = null;


    @property(cc.Node)
    cameraNode: cc.Node = null;


    @property(cc.Node)
    targetNode: cc.Node = null;


    // @property
    // text: string = 'hello';
    public app = null;

    onLoad() {
        Util.Instance(Util).screenFit();
        // StateMachineMgr.Instance(StateMachineMgr).onClick();
    }

    start() {

        // WeChatMgr.Instance(WeChatMgr).onLaunchOptionsSync();

        // let resMap = ResMgr.Instance(ResMgr).resMap;

        // AudioMgr.Instance(AudioMgr).init(resMap.get('m1'));

        // console.log(resMap);
        // AudioMgr.Instance(AudioMgr).playBGM();

        // let prefab = resMap.get('localPrefab1');
        // let node = cc.instantiate(prefab);
        // node.parent = this.parentNode;

        // let spriteFrame = resMap.get('p3');
        // console.log(typeof spriteFrame._nativeAsset);
        // this.spriteNode.spriteFrame = spriteFrame;

        // let skeletonData = SpineMgr.Instance(SpineMgr).initSkeletonData('skeletonAtlas1', 'skeletonJson1', 'skeletonP1');
        // this.spineNode.skeletonData = skeletonData;

        // this.spineNode.skeletonData = resMap.get('skeleton1Atlas');
        // SpineMgr.Instance(SpineMgr).localChaneDress(this.spineNode.node, 'xianglian', 'pifu5_yuguang2', 'xianglian');

        // SpineMgr.Instance(SpineMgr).generateSomeNodes(this.spineNode.node, 'yuguang',this.generatePrefab);


        // StateMachineMgr.Instance(StateMachineMgr).onState();

        // TCloudMgr.Instance(TCloudMgr).update();
        // TCloudMgr.Instance(TCloudMgr).inquire();

        // this.app = cc.cloud && cc.cloud.initialize();
        // let auth = this.app.auth();
        // auth.anonymousAuthProvider().signIn().then(res => {
        //    // ????????????????????????????????????????????????????????????????????????????????????
        //    // ????????????????????? -> ????????? -> ?????????????????? -> ????????????/????????????????????????????????????????????????
        //    // ?????????????????????????????????????????????????????????????????????????????????
        //    console.log('TCB inited');
        //    this.app.callFunction({
        //        // ????????????????????????????????????????????????
        //        name: "rankInfo",
        //        // ????????????????????????
        //        data: {
        //            a: 1
        //        }
        //    }).then(res => {
        //        console.log('function', res);
        //    }).catch(console.error);
        // });

        // WeChatMgr.Instance(WeChatMgr).setData(25);
        // WeChatMgr.Instance(WeChatMgr).getData(0,5);
        // TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftPlayerInfoInGroup('123');
        // TCloudMgr.Instance(TCloudMgr).inquireReceivedGiftPlayerInfoInGroup('123');
        // TCloudMgr.Instance(TCloudMgr).uploadReceivedGiftInfoInGroup('string1111',564644);
        // let receivedGiftPromise = TCloudMgr.Instance(TCloudMgr).inquireReceivedGiftPlayerInfoInGroup('123');
        // Promise.all([receivedGiftPromise]).then((res) => {
        //     console.log(res[0].length);
        // });
        // TCloudMgr.Instance(TCloudMgr).uploadReceivedGifts('???????????????','1');
        // TCloudMgr.Instance(TCloudMgr).deleteReceivedGifts();

        let resMap = ResMgr.Instance(ResMgr).resMap;
        console.log(resMap);
        let res1 = ResMgr.Instance(ResMgr).getResByName('beimianAtlas');
        console.log(res1);
        let res2 = ResMgr.Instance(ResMgr).getResByName('beimianJSON');
        console.log(res2);
        let res3 = ResMgr.Instance(ResMgr).getResByName('beimianPicture');
        console.log(res3);

        let skeleton = SpineMgr.Instance(SpineMgr).initSkeletonData('spineAtlas','spineJSON','spinePicture');
        console.log("1:",skeleton);
        this.spineNode.skeletonData = skeleton;
        // console.log('2:',Util.Instance(Util).screenFit());
        // SpineMgr.Instance(SpineMgr).generateSomeNodes(this.spineNode.node,"tou",this.generatePrefab);
        // this.spineNode.setSkin('pifu4');
        // this.spineNode.setAnimation(0,'daiji',true);
        // console.log(this.spineNode.skeletonData);
        // console.log(this.spineNode.skeletonData);
        // let res = ResMgr.Instance(ResMgr).getResByName('text');
        // let node = cc.instantiate(res);
        // node.parent = this.parentNode;
    }

    // update (dt) {}

    public share() {
        // this.share.name
        WeChatMgr.Instance(WeChatMgr).share('', '');
    }

    

    public send() {
        WeChatMgr.Instance(WeChatMgr).giveGift('1', '', '');
        // this.share.name = 'share';
        // console.log(this.share.name);
    }
}

