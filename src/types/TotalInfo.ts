// 全国のデータ型
export class TotalInfo {
  constructor(
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
    private _accumulationExits: number,
    // 患者情報更新日
    private _updatePatientInfo: string,
    // 病院情報更新日
    private _updateHospitalInfo: string
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
  public get updatePatientInfo(): string {
    return this._updatePatientInfo;
  }

  public set updatePatientInfo(updatePatientInfo: string) {
    this._updatePatientInfo = updatePatientInfo;
  }
  public get updateHospitalInfo(): string {
    return this._updateHospitalInfo;
  }

  public set updateHospitalInfo(updateHospitalInfo: string) {
    this._updateHospitalInfo = updateHospitalInfo;
  }
}
