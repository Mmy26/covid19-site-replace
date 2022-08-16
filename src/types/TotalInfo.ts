export class TotalInfo {
  constructor(
    // 現在の病床使用率
    private _currentAvarage: number,
    // 現在の患者数
    private _currentPatient: number,
    // 累積患者数
    private _accumulationPatient: number,
    // 累積死者数
    private _accumulationDead: number
  ) {}
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
}
