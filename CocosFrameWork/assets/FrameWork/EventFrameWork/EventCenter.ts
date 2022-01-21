import { EventType } from "./EventType";
import Singleton from "./Singleton";

export default class EventCenter extends Singleton {

    private m_eventType: Map<EventType, Function> = new Map<EventType, Function>();

    /**
     * 添加监听事件(map设置key,value，如果key相同那么value会被覆盖，这里只允许key对应一个value，只有当当前key对应的value为空或者不存在时，才可以重新设置value)
     * @param eventType 事件码
     * @param callBack 事件回调
     * @param node 绑定事件对象节点
     */
    public addListener<T,X,Y,Z,U>(eventType: EventType, callBack: (arg0?: T,arg1?: X,arg2?: Y,arg3?: Z,arg4?: U) => void, node: cc.Node): void {
        if (!this.m_eventType.has(eventType)) {
            this.m_eventType.set(eventType, null);
        }
        let eventback = this.m_eventType.get(eventType);
        if (eventback != null) {
            console.error('事件已存在不能重复添加');
            return;
        }
        console.log('1');
        this.m_eventType.set(eventType, callBack);
        node.on(eventType, callBack, node);
        console.log(this.m_eventType);
    }

    /**
     * 移除监听事件
     * @param eventType 事件码 
     * @param callBack 事件回调
     * @param node 绑定事件对象节点
     * @returns 
     */
    /**
     * 移除监听事件
     * @param eventType 事件码 
     * @param callBack 事件回调
     * @param node 绑定事件对象节点
     */
    public removeListener<T,X,Y,Z,U>(eventType: EventType, callBack: (arg0?: T,arg1?: X,arg2?: Y,arg3?: Z,arg4?: U) => void, node: cc.Node) {
        if (this.m_eventType.has(eventType)) {
            let eventback = this.m_eventType.get(eventType);
            if (eventback == null) {
                console.error('事件为空，移除失败');
                return;
            }
            else if (eventback != callBack) {
                console.error('不存在该事件，请检查事件码是否正确');
                return;
            }
            this.m_eventType.delete(eventType);
        }
        node.off(eventType, callBack, node);
    }

    /**
     * 調用事件
     * @param node 绑定事件的对象节点
     * @param eventType 事件码
     * @param arg0 可选参数（与监听事件参数一致）
     * @param arg1
     * @param arg2 
     * @param arg3 
     * @param arg4 
     */
    public boradcast<T,X,Y,Z,U>(node: cc.Node, eventType: EventType, arg0?: T,arg1?: X,arg2?: Y,arg3?: Z,arg4?: U) {
        if (this.m_eventType.has(eventType)) {
            let eventback = this.m_eventType.get(eventType);
            if (eventback != null) {
                node.emit(eventType, arg0,arg1,arg2,arg3,arg4);
            }
            else {
                console.error('事件为空');
            }
        }
        else {
            console.error('事件不存在');
        }
    }
}
