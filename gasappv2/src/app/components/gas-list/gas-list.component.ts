import { Component, OnInit } from '@angular/core';
import { GasService } from '../../services/gas.service';
import { Gasolinera } from '../../models/gas-item.dto';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrl: './gas-list.component.css',
})
export class GasListComponent implements OnInit {
  listadoGasolineras: Gasolinera[] = [];
  originalListadoGasolineras: Gasolinera[] = [];
  tipoCombustible: string = 'gasolina';
  precioMin: number = 0;
  precioMax: number = 2;
  postalCode: string = '';
  rotulos: string[] = [];
  noResults: boolean = false;
  postalCodeControl = new FormControl('');

  constructor(private gasService: GasService) { }

  ngOnInit() {
    this.loadGasList();
  }

  private loadGasList() {
    this.gasService.getGasList().subscribe((respuesta) => {
      const respuestaEnString = JSON.stringify(respuesta);
      let parsedData;
      try {
        parsedData = JSON.parse(respuestaEnString);
        let arrayGasolineras = parsedData['ListaEESSPrecio'];
        this.originalListadoGasolineras = this.cleanProperties(arrayGasolineras);
        this.listadoGasolineras = [...this.originalListadoGasolineras];
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });
  }

  private cleanProperties(arrayGasolineras: any) {
    let newArray: Gasolinera[] = [];
    arrayGasolineras.forEach((gasolineraChusquera: any) => {
      let gasolinera = new Gasolinera(
        gasolineraChusquera['IDEESS'],
        gasolineraChusquera['Rótulo'],
        parseFloat(gasolineraChusquera['Precio Gasolina 95 E5'].replace(',', '.')),
        parseFloat(gasolineraChusquera['Precio Gasoleo A'].replace(',', '.')),
        gasolineraChusquera['C.P.'],
        gasolineraChusquera['Rótulo'],
        gasolineraChusquera['Latitud'],
        gasolineraChusquera['Longitud (WGS84)']
      );
      newArray.push(gasolinera);
    });
    return newArray;
  }

  filtrarGasolineras() {
    this.postalCode = this.postalCodeControl.value ?? '';
    this.listadoGasolineras = this.gasService.filterGasList(
      this.originalListadoGasolineras,
      this.tipoCombustible,
      this.precioMin,
      this.precioMax,
      this.postalCode,
      this.rotulos
    );
    this.noResults = this.listadoGasolineras.length === 0;
  }

  onRotuloChange(event: any) {
    const rotulo = event.target.value;
    if (event.target.checked) {
      this.rotulos.push(rotulo);
    } else {
      this.rotulos = this.rotulos.filter(r => r !== rotulo);
    }
  }

  mostrarFiltros: boolean = false;

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }
}