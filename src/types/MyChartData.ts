// chartに使用するデータ型
export class MyChartData {
  constructor(
    // ラベル
    private _x: string,
    // データ
    private _y: number
  ) {}

  public get x(): string {
    return this._x;
  }

  public set x(x: string) {
    this._x = x;
  }
  public get y(): number {
    return this._y;
  }

  public set y(y: number) {
    this._y = y;
  }
}
