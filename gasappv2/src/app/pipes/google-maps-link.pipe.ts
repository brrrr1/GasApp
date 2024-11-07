import { Pipe, PipeTransform } from '@angular/core';
import { Gasolinera } from '../models/gas-item.dto';

@Pipe({
  name: 'googleMapsLink'
})
export class GoogleMapsLinkPipe implements PipeTransform {

  transform(gasolinera: Gasolinera, ...args: unknown[]): unknown {
    const sanitizedLatitude = this.sanitizeValue(gasolinera.latitude);
    const sanitizedAltitude = this.sanitizeValue(gasolinera.altittude);
    return `https://maps.google.com/?q=${sanitizedLatitude},${sanitizedAltitude}`;
  }

  sanitizeValue(value: string): string {
    return value.replace(',', '.');

  }
}
