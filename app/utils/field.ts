interface FieldConfig<T> {
  format?: (value: T) => string;
  validate?: (value: T) => boolean;
  value: T;
}

export class Field<T> {
  private validate: (value: T) => boolean;
  private format: (value: T) => string;

  public isValid: boolean;
  public value: T;

  public constructor(config: FieldConfig<T>) {
    this.value = config.value;
    this.validate = config.validate ?? ((value) => !!value); // check the presence of value by default
    this.format =
      config.format ?? ((value: T) => (typeof value === "string" ? value : ""));
    this.isValid = this.validate(this.value) ?? true;
  }

  get formattedValue(): string {
    return this.format(this.value);
  }

  update() {
    this.isValid = this.validate(this.value) ?? true;
  }
}
