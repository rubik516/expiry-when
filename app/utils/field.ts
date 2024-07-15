export class Field<T> {
  isValid: boolean;
  value: T;
  #validate?: (value: T) => boolean;

  public constructor(value: T, validate?: (value: T) => boolean) {
    this.value = value;
    this.isValid = validate?.(this.value) ?? true;
    this.#validate = validate;
  }

  update() {
    this.isValid = this.#validate?.(this.value) ?? true;
  }
}
