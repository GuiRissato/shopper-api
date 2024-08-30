export class Measure {
  constructor(
    public id: number,
    public userId: number,
    public imageUrl: string,
    public value: number,
    public hasConfirmed: boolean
  ) {}

  confirmValue(newValue: number) {
    if (this.hasConfirmed) {
      throw new Error("CONFIRMATION_DUPLICATE");
    }
    this.value = newValue;
    this.hasConfirmed = true;
  }
}