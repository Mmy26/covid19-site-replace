// chartに使用する過去の累積データを保管する型
export class AccInfo {
  constructor(
    // id
    private _id: number,
    // 日付
    private _date: string,
    // 県名（英語）
    private _name: string,
    // 救急搬送困難件数
    private _dischangedFromHospital: number,
    // 入院治療を要する者
    private _requiringInpatient: number
  ) {}

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }
  public get date(): string {
    return this._date;
  }

  public set date(date: string) {
    this._date = date;
  }
  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get dischangedFromHospital(): number {
    return this._dischangedFromHospital;
  }

  public set dischangedFromHospital(dischangedFromHospital: number) {
    this._dischangedFromHospital = dischangedFromHospital;
  }

  public get requiringInpatient(): number {
    return this._requiringInpatient;
  }

  public set requiringInpatient(requiringInpatient: number) {
    this._requiringInpatient = requiringInpatient;
  }
}
