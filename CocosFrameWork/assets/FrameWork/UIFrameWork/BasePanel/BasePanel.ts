/**
 * 面板的页面状态类
 * 面板的挂载类需要继承该类，
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BasePanel extends cc.Component {
   /**
    * 页面显示时触发
    */
   public abstract OnEnter();
   /**
    * 页面暂停时触发（有其他的页面弹出来了）
    */
   public abstract OnPause();
   /**
    * 页面恢复时触发（其他页面被移除）
    */
   public abstract OnResume();
   /**
    * 页面销毁时触发
    */
   public abstract OnExit();

   /**
    * 隐藏面板
    */
   public abstract closePanel();

}

