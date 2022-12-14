// 各県別のデータ型
export class PreInfo {
  constructor(
    // id
    private _id: number,
    // 県名
    private _name: string,
    // 県名
    private _nameEng: string,
    // 現在の病床使用率
    private _currentAvarage: number,
    // 現在の患者数
    private _currentPatient: number,
    // 対策病床数
    private _totalSickBed: number,
    // 対策病床数
    private _医療機関: number,
    // 対策病床数
    private _宿泊施設: number,
    // 累積患者数
    private _accumulationPatient: number,
    // 累積死者数
    private _accumulationDead: number,
    // 退院者数
    private _accumulationExits: number,
    // 前日比
    private _dcurrentpatients: number
  ) {}

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }
  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }
  public get nameEng(): string {
    return this._nameEng;
  }

  public set nameEng(nameEng: string) {
    this._nameEng = nameEng;
  }
  public get currentAvarage(): number {
    return this._currentAvarage;
  }

  public set currentAvarage(currentAvarage: number) {
    this._currentAvarage = currentAvarage;
  }
  public get currentPatient(): number {
    return this._currentPatient;
  }

  public set currentPatient(currentPatient: number) {
    this._currentPatient = currentPatient;
  }

  public get totalSickBed(): number {
    return this._totalSickBed;
  }
  public set totalSickBed(totalSickBed: number) {
    this._totalSickBed = totalSickBed;
  }
  public get 医療機関(): number {
    return this._医療機関;
  }
  public set 医療機関(医療機関: number) {
    this._医療機関 = 医療機関;
  }

  public get 宿泊施設(): number {
    return this._totalSickBed;
  }

  public set 宿泊施設(宿泊施設: number) {
    this._宿泊施設 = 宿泊施設;
  }
  public get accumulationPatient(): number {
    return this._accumulationPatient;
  }

  public set accumulationPatient(accumulationPatient: number) {
    this._accumulationPatient = accumulationPatient;
  }
  public get accumulationDead(): number {
    return this._accumulationDead;
  }

  public set accumulationDead(accumulationDead: number) {
    this._accumulationDead = accumulationDead;
  }
  public get accumulationExits(): number {
    return this._accumulationExits;
  }

  public set accumulationExits(accumulationExits: number) {
    this._accumulationExits = accumulationExits;
  }
  public get dcurrentpatients(): number {
    return this._dcurrentpatients;
  }

  public set dcurrentpatients(dcurrentpatients: number) {
    this._dcurrentpatients = dcurrentpatients;
  }
}
