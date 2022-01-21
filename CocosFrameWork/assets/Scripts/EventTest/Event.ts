import EventCenter from "../../FrameWork/EventFrameWork/EventCenter";
import { EventType } from "../../FrameWork/EventFrameWork/EventType";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Event extends cc.Component {

    // public eventCenter = new EventCenter();

    onLoad () {
        
    }

    start() {
        // EventCenter.Instance(EventCenter).AddLister(EventType.showText,this.show);
        // this.node.on(EventType.showText,()=>{});
        EventCenter.Instance(EventCenter).addListener(EventType.showText, this.show,this.node);

        this.node.on('click', () => {
            EventCenter.Instance(EventCenter).boradcast(this.node,EventType.showText,'我是你爸爸',1,2,3,4);
        }, this);
    }

    protected onDestroy(): void {
        // EventCenter.Instance(EventCenter).RemoveListener(EventType.showText,this.show);
        EventCenter.Instance(EventCenter).removeListener(EventType.showText, this.show, this.node);
    }

    // update (dt) {}

    public show(string:string,number:number,number1:number,number2:number,number3:number) {
        console.log(string+number.toString()+number1.toString()+number2.toString(),+number3.toString());
    }

}
