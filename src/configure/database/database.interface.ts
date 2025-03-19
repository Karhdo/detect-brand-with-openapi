import { ModelCtor } from 'sequelize-typescript';

export interface DatabaseModuleOption {
  name: string;
  entities: ModelCtor[];
}
