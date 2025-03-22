export type eventFunction<T> = (v: T) => void;
export class Events<T> {
    public id: string;
    private subscribers: Record<string, eventFunction<T>> = {};
    constructor(id: string) {
        this.id = id;
    }

    public subscribe(key: string, func: eventFunction<T>) {
        this.subscribers[key] = func;
    }

    public alert(v: T) {
        Object.values(this.subscribers).forEach((s) => {
            s(v);
        });
    }
}
