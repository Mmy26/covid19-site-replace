export class EcmoData {
  constructor(
    private _id: number,
    private _ECMO装置取扱: number,
    private _ECMO装置待機: number,
    private _マスク専用人工呼吸器取扱: number,
    private _マスク専用人工呼吸器待機: number,
    private _人工呼吸器取扱うち小児: number,
    private _人工呼吸器取扱: number,
    private _人工呼吸器待機: number,
    private _回答数: number,
    private _特定感染症指定医療機関: number,
    private _第一種感染症指定医療機関: number,
    private _第二種感染症指定医療機関: number,
    private _総CE: number,
    private _総病床: number,
    private _都道府県: string
  ) {}

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }
  public get ECMO装置取扱(): number {
    return this._ECMO装置取扱;
  }

  public set ECMO装置取扱(ECMO装置取扱: number) {
    this._ECMO装置取扱 = ECMO装置取扱;
  }
  public get ECMO装置待機(): number {
    return this._ECMO装置待機;
  }

  public set ECMO装置待機(ECMO装置待機: number) {
    this._ECMO装置待機 = ECMO装置待機;
  }
  public get マスク専用人工呼吸器取扱(): number {
    return this._マスク専用人工呼吸器取扱;
  }
  public set マスク専用人工呼吸器取扱(マスク専用人工呼吸器取扱: number) {
    this._マスク専用人工呼吸器取扱 = マスク専用人工呼吸器取扱;
  }
  public get マスク専用人工呼吸器待機(): number {
    return this._マスク専用人工呼吸器待機;
  }

  public set マスク専用人工呼吸器待機(マスク専用人工呼吸器待機: number) {
    this._マスク専用人工呼吸器待機 = マスク専用人工呼吸器待機;
  }
  public get 人工呼吸器取扱うち小児(): number {
    return this._人工呼吸器取扱うち小児;
  }

  public set 人工呼吸器取扱うち小児(人工呼吸器取扱うち小児: number) {
    this._人工呼吸器取扱うち小児 = 人工呼吸器取扱うち小児;
  }
  public get 人工呼吸器取扱(): number {
    return this._人工呼吸器取扱;
  }

  public set 人工呼吸器取扱(人工呼吸器取扱: number) {
    this._人工呼吸器取扱 = 人工呼吸器取扱;
  }
  public get 人工呼吸器待機(): number {
    return this._人工呼吸器待機;
  }

  public set 人工呼吸器待機(人工呼吸器待機: number) {
    this._人工呼吸器待機 = 人工呼吸器待機;
  }
  public get 回答数(): number {
    return this._回答数;
  }
  public set 回答数(回答数: number) {
    this._回答数 = 回答数;
  }
  public get 特定感染症指定医療機関(): number {
    return this._特定感染症指定医療機関;
  }
  public set 特定感染症指定医療機関(特定感染症指定医療機関: number) {
    this._特定感染症指定医療機関 = 特定感染症指定医療機関;
  }
  public get 第一種感染症指定医療機関(): number {
    return this._第一種感染症指定医療機関;
  }

  public set 第一種感染症指定医療機関(第一種感染症指定医療機関: number) {
    this._第一種感染症指定医療機関 = 第一種感染症指定医療機関;
  }
  public get 第二種感染症指定医療機関(): number {
    return this._第二種感染症指定医療機関;
  }
  public set 第二種感染症指定医療機関(第二種感染症指定医療機関: number) {
    this._第二種感染症指定医療機関 = 第二種感染症指定医療機関;
  }
  public get 総CE(): number {
    return this._総CE;
  }
  public set 総CE(総CE: number) {
    this._総CE = 総CE;
  }
  public get 総病床(): number {
    return this._総病床;
  }

  public set 総病床(総病床: number) {
    this._総病床 = 総病床;
  }
  public get 都道府県(): string {
    return this._都道府県;
  }
  public set 都道府県(都道府県: string) {
    this._都道府県 = 都道府県;
  }
}
