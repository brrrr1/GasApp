export class Gasolinera {
  constructor(
    public id: number,
    public nombre: string,
    public price95: number,
    public priceDiesel: number,
    public postalCode: string,
    public rotulo: string,
    public latitude: string,
    public longitude: string,
    public comunidad: string
  ) {}
}
