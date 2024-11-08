import { Pipe, PipeTransform } from '@angular/core';
import { Gasolinera } from '../models/gas-item.dto';

@Pipe({
  name: 'googleMapsLink'
})
export class GoogleMapsLinkPipe implements PipeTransform {

  transform(gasolinera: Gasolinera, ...args: unknown[]): unknown {
    const sanitizedLatitude = this.sanitizeValue(gasolinera.latitude);
    const sanitizedLongitude = this.sanitizeValue(gasolinera.longitude);
    return `https://maps.google.com/?q=${sanitizedLatitude},${sanitizedLongitude}`;
  }

  sanitizeValue(value: string): string {
    return value.replace(',', '.');
  }
}
