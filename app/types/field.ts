export class Field<T = string> {
  #isTouched: boolean;
  #isValid: boolean;
  #value: T;

  public constructor(value: T, validate?: (value: T) => boolean) {
    this.#isTouched = false;
    this.#value = value;
    this.#isValid = validate?.(this.#value) || true;
  }

  get value() {
    return this.#value;
  }

  set value(value: T) {
    this.#value = value;
  }

  setTouched() {
    this.#isTouched = true;
  }
}
