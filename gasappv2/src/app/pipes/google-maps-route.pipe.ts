import { Pipe, PipeTransform } from '@angular/core';
import { Gasolinera } from '../models/gas-item.dto';

@Pipe({
  name: 'googleMapsRoute'
})
export class GoogleMapsRoutePipe implements PipeTransform {

  transform(gasolinera: Gasolinera, ...args: unknown[]): unknown {
    return `https://www.google.com/maps/dir/?api=1&destination=${this.sanitizeValue(gasolinera.latitude)},${this.sanitizeValue(gasolinera.longitude)}`;
  }

  sanitizeValue(value: string): string {
    return value.replace(',', '.');

  }

}
