enum OptionEnum {
  Some,
  None,
}

export class Option<T> {
  private val?: T

  private status: OptionEnum

  static none<T>() {
    return new Option<T>(OptionEnum.None);
  }

  static some<T>(val: T) {
    return new Option<T>(OptionEnum.Some, val);
  }

  constructor(status: OptionEnum, val?: T) {
    this.status = status;
    this.val = val;
  }

  unwrap(): T {
    return this.val!;
  }

  isNone(): boolean {
    return this.status === OptionEnum.None;
  }
}
