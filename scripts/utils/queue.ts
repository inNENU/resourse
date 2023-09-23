export interface Task {
  /** 函数本身 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (next: () => void, ...args: any) => void;
  /** 函数的运行上下文 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
  /** 函数的参数 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;
}

/**
 * 一个队列，在上一个函数执行完毕后执行 `next()`  才会开始执行下一个函数。
 */
export class Queue {
  constructor(
    /** 允许同时并行的任务数 */
    public capacity = 1,
  ) {}

  /** 回调队列 */
  public funcQueue: Task[] = [];

  /** 正在运行的数量 */
  public running = 0;

  /** 执行下一个函数 */
  public next(): void {
    /** 即将执行的任务 */
    const task = this.funcQueue.shift();

    if (task) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { func, ctx, args } = task;
      const taskFunc = (): void => {
        func.apply(ctx, [
          (): void => {
            this.running -= 1;
            this.next();
          },
          ...[].slice.call(args, 0),
        ]);
      };

      this.running += 1;
      taskFunc();
    }
  }

  /**
   * 添加函数
   * @param func 函数
   * @param ctx 函数运行上下文
   * @param args 函数参数
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public add<T, A extends any[]>(
    func: (next: () => void, ...args: A) => void,
    ctx?: T,
    ...args: A
  ): void {
    this.funcQueue.push({
      func,
      ctx,
      args: [].slice.call(args, 0),
    });

    // 开始第一个队列
    if (this.running < this.capacity) this.next();
  }

  /** 清除队列，不再执行尚未执行的函数 */
  public clear(): void {
    this.funcQueue = [];
  }
}

/**
 * 一个队列，在上一个函数执行完毕后执行 `next()`  才会开始执行下一个函数。
 */
export const promiseQueue = (
  promiseList: (() => Promise<void>)[],
  capacity = 1,
): Promise<void> =>
  new Promise((resolve) => {
    /** 回调队列 */
    const queue: (() => Promise<void>)[] = promiseList;

    let running = 0;

    /** 执行下一个函数 */
    const next = (): void => {
      /** 即将执行的任务 */
      const task = queue.shift();

      if (task) {
        running += 1;
        task().then(() => {
          running -= 1;
          next();
        });
      } else if (running === 0) resolve();
    };

    let counter = 0;

    while (counter < capacity) {
      counter += 1;
      next();
    }
  });
