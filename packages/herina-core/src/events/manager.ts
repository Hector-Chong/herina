type EventHandler = (...args: any[]) => void | Promise<void>;

class EventManager<T extends string> {
  private eventsMap: Map<string, Set<EventHandler>> = new Map();

  public isRegistered(event: T) {
    return this.eventsMap.has(event);
  }

  private getQueue(event: T) {
    return this.eventsMap.get(event) || new Set();
  }

  public clearQueue(event: T) {
    this.eventsMap.set(event, new Set());
  }

  public on(event: T, handler: EventHandler) {
    if (!this.isRegistered(event)) {
      this.eventsMap.set(event, new Set([handler]));
    } else {
      this.getQueue(event).add(handler);
    }
  }

  public once(event: T, handler: EventHandler) {
    const queue = this.getQueue(event);

    const onceHandler = (...args: any[]) => {
      handler(...args);

      queue.delete(onceHandler);
    };

    this.on(event, onceHandler);
  }

  public emit(event: T, ...args: any[]) {
    const queue = this.getQueue(event);

    for (const handler of queue) {
      handler(...args);
    }
  }

  public async emitAsync(event: T, ...args: any[]) {
    const queue = this.getQueue(event);

    for (const handler of queue) {
      await handler(...args);
    }
  }
}

export default EventManager;
