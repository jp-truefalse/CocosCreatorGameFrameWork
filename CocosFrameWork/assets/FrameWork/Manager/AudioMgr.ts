/**
 * 音乐管理类
 * 
 * 注意：
 * 使用前要调用init函数对整个类进行初始化
 */
import Singleton from "../Util/Singleton";
import StorageMgr from "./StorageMgr";

export default class AudioMgr extends Singleton {

    /**
     * 背景音乐文件
     */
    public bgMusic: cc.AudioClip = null;
    //是否播放音效
    public isPlayEffect = true;
    //是否关闭声音
    public isCloseMusic = false;

    /**
     * 音乐管理类初始化
     * @param bgmClip 背景音乐文件
     */
    public init(bgmClip:cc.AudioClip){
        this.bgMusic = bgmClip;
        if(StorageMgr.Instance(StorageMgr).getIsCloseMusic()){
            this.pauseAllMusic();
        }
        else{
            this.resumeAllMusic();
        }
    }

    /**
     * 播放背景音乐
     */
    public playBGM() {
        cc.audioEngine.playMusic(this.bgMusic, true);
    }

    /**
     * 暂停背景音乐
     */
    public pauseBGM() {
        cc.audioEngine.pauseMusic();
    }

    /**
     * 恢复背景音乐
     */
    public resumeBGM() {
        cc.audioEngine.resumeMusic();
    }

    /**
     * 停止播放背景音乐
     */
    public stopBGM() {
        cc.audioEngine.stopMusic();
    }

    /**
     * 播放音效
     * @param clip 音效文件 
     */
    public playEffect(clip: cc.AudioClip) {
        if (this.isPlayEffect) {
            cc.audioEngine.playEffect(clip, false);
        }
    }

    /**
     * 暂停播放音效
     */
    public pauseEffect() {
        this.isPlayEffect = false;
    }

    /**
     * 恢复播放音效
     */
    public resumeEffect() {
        this.isPlayEffect = true;
    }

    /**
     * 暂停所有的声音
     */
    public pauseAllMusic(){
        this.pauseBGM();
        this.pauseEffect();
        this.setIsCloseMusic(true);
    }

    /**
     * 恢复所有的声音
     */
    public resumeAllMusic(){
        this.resumeBGM();
        this.resumeEffect();
        this.setIsCloseMusic(false);
    }

    /**
     * 获取是否关闭音乐
     * @returns 返回关闭音乐的结果
     */
    public getIsCloseMusic(){
        return this.isCloseMusic;
    }

    /**
     * 设置是否关闭音乐值
     * @param isClose 关闭音乐值
     */
    public setIsCloseMusic(isClose:boolean){
        this.isCloseMusic = isClose;
    }

}
