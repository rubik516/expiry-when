export class Field<T> {
  #isTouched: boolean;
  #isValid: boolean;
  value: T;

  public constructor(value: T, validate?: (value: T) => boolean) {
    this.#isTouched = false;
    this.value = value;
    this.#isValid = validate?.(this.value) || true;
  }

  setTouched() {
    this.#isTouched = true;
  }
}
