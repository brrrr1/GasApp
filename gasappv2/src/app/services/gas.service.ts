import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gasolinera } from '../models/gas-item.dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GasService {
  constructor(private http: HttpClient) {}

  getGasList(): Observable<Gasolinera[]> {
    return this.http.get<Gasolinera[]>(
      'http://localhost:3000/gasolineras'
    );
  }

  getComunidades(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ComunidadesAutonomas'
    ).pipe(
      map(response => {
        console.log('Respuesta del servicio:', response); // Añadir este log
        return response.map(comunidad => ({
          IDCCAA: comunidad.IDCCAA,
          Comunidad: comunidad.Comunidad
        }));
      })
    );
  }

  filterGasList(
    gasolineras: Gasolinera[],
    tipoCombustible: string,
    precioMin: number,
    precioMax: number,
    postalCode: string,
    rotulos: string[],
    comunidad: string
  ): Gasolinera[] {
    return gasolineras.filter((gasolinera) => {
      const precio =
        tipoCombustible === 'gasolina'
          ? gasolinera.price95
          : gasolinera.priceDiesel;
      const matchesPostalCode = postalCode ? gasolinera.postalCode === postalCode : true;
      const matchesRotulo = rotulos.length > 0 ? rotulos.includes(gasolinera.rotulo) : true;
      const matchesComunidad = comunidad ? gasolinera.comunidad === comunidad : true;
      return (
        precio >= precioMin &&
        precio <= precioMax &&
        matchesPostalCode &&
        matchesRotulo &&
        matchesComunidad
      );
    });
  }
}
