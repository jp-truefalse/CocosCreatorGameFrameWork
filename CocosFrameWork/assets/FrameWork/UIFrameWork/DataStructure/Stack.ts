/**
 * 利用数组实现自定义栈
 * 后进先出
 */
export default class Satck<T>{
    private array: Array<T>;

    constructor() {
        this.array = new Array<T>();
    }

    /**
     * 向栈顶添加元素
     * @param element 要添加的元素
     */
    public push(element: T): void {
        this.array.push(element);
    }

    /**
     * 出栈
     * 取出并删除栈顶元素
     * @returns 返回取出的栈顶元素
     */
    public pop(): T {
        return this.array.pop();
    }

    /**
     * 出栈
     * 取出栈顶元素，不做其他操作
     * @returns 返回取出的栈顶元素
     */
    public peek(): T {
        let length = this.array.length;
        return this.array[length - 1];
    }

    /**
     * 判断栈是否为空
     * 为空返回true，不为空返回false
     * @returns 返回是否为空
     */
    public isEmpty(): boolean {
        return this.array.length <= 0;
    }

    /**
     * 清空当前栈
     */
    public clear() {
        this.array = [];
    }

    /**
     * 得到栈的长度
     * @returns 返回当前栈的长度
     */
    public size():number{
        return this.array.length;
    }
}
