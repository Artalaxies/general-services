/* eslint-disable require-jsdoc */


export class EntityParameters<A> {
  _tag: string;
  parameters: A;

  update = (data: Partial<A>) => updateEntityParameter(this, data);

  constructor(tag: string, data: A) {
    this._tag = tag;
    this.parameters = data;
  }
}

export const updateEntityParameter =
<A>(entityParameter: EntityParameters<A>, data: Partial<A>) =>
    new EntityParameters<A>(entityParameter._tag, {
      ...entityParameter.parameters,
      ...data,
    } );

