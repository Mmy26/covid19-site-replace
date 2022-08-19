export class PreInfo {
  constructor(
    // id
    private _id: number,
    // 県名
    private _name: string,
    // 現在の病床使用率
    private _currentAvarage: number,
    // 現在の患者数
    private _currentPatient: number,
    // 対策病床数
    private _totalSickBed: number,
    // 累積患者数
    private _accumulationPatient: number,
    // 累積死者数
    private _accumulationDead: number,
    // 退院者数
    private _accumulationExits: number
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
}
