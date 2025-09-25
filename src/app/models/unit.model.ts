export interface UnitModel {
  unitId: number;
  unitName: string;
}

export interface UnitStructureModel {
  headUnit: UnitModel;
  childUnits: UnitModel[];
  peerUnits: UnitModel[];
}
