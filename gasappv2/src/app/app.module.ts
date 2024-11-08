import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GasListComponent } from './components/gas-list/gas-list.component';
import { provideHttpClient } from '@angular/common/http';
import { GoogleMapsLinkPipe } from './pipes/google-maps-link.pipe';
import { GoogleMapsRoutePipe } from './pipes/google-maps-route.pipe';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [AppComponent, GasListComponent, GoogleMapsLinkPipe, GoogleMapsRoutePipe],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  providers: [provideHttpClient(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
