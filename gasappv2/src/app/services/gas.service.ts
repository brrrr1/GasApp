import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gasolinera } from '../models/gas-item.dto';

@Injectable({
  providedIn: 'root',
})
export class GasService {
  constructor(private http: HttpClient) {}

  getGasList(): Observable<any> {
    return this.http.get(
      'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'
    );
  }

  filterGasList(
    gasolineras: Gasolinera[],
    tipoCombustible: string,
    precioMin: number,
    precioMax: number,
    postalCode: string,
    rotulos: string[]
  ): Gasolinera[] {
    return gasolineras.filter((gasolinera) => {
      const precio =
        tipoCombustible === 'gasolina'
          ? gasolinera.price95
          : gasolinera.priceDiesel;
      const matchesPostalCode = postalCode ? gasolinera.postalCode === postalCode : true;
      const matchesRotulo = rotulos.length > 0 ? rotulos.includes(gasolinera.rotulo) : true;
      return (
        precio >= precioMin &&
        precio <= precioMax &&
        matchesPostalCode &&
        matchesRotulo
      );
    });
  }
}
