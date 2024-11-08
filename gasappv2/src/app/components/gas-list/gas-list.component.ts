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
  filteredPostalCodes: Observable<string[]> | undefined;
  comunidades: any[] = [];
  comunidadSeleccionada: string = '';
  provincias: any[] = [];
  provinciaSeleccionada: string = '';

  constructor(private gasService: GasService) { }

  ngOnInit() {
    this.loadGasList();
    this.loadComunidades();
    this.filteredPostalCodes = this.postalCodeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPostalCodes(value || ''))
    );
    this.postalCodeControl.valueChanges.subscribe(value => {
      this.filtrarGasolineras();
    });
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

  private loadComunidades() {
    this.gasService.getComunidades().subscribe((respuesta) => {
      console.log('Comunidades cargadas:', respuesta); // Añadir este log
      this.comunidades = respuesta;
    });
  }

  private loadProvincias(IDCCAA: string) {
    this.gasService.getProvincias(IDCCAA).subscribe((respuesta) => {
      console.log('Provincias cargadas:', respuesta); // Añadir este log
      this.provincias = respuesta;
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
        gasolineraChusquera['Longitud (WGS84)'],
        gasolineraChusquera['IDCCAA'],
        gasolineraChusquera['IDProvincia'] // Asignar la provincia correctamente
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
      this.rotulos,
      this.comunidadSeleccionada,
      this.provinciaSeleccionada // Añadir provinciaSeleccionada al filtrado
    );
    this.noResults = this.listadoGasolineras.length === 0;
  }

  private _filterPostalCodes(value: string): string[] {
    const filterValue = value.trim().toLowerCase();
    const postalCodes = this.originalListadoGasolineras.map(g => g.postalCode);
    return postalCodes.filter(option => option.toLowerCase().includes(filterValue));
  }

  onRotuloChange(event: any) {
    const rotulo = event.target.value;
    if (event.target.checked) {
      this.rotulos.push(rotulo);
    } else {
      this.rotulos = this.rotulos.filter(r => r !== rotulo);
    }
  }

  onComunidadChange() {
    if (this.comunidadSeleccionada) {
      this.loadProvincias(this.comunidadSeleccionada);
    } else {
      this.provincias = [];
      this.provinciaSeleccionada = '';
    }
  }

  mostrarFiltros: boolean = false;

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }
}