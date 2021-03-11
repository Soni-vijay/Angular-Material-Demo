

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from './app.material.module';
import { AppComponent } from './app.component';
import { AddressService } from './services/addressService';
import { fakeBackendProvider } from './helper/faker'
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [AppComponent],
  entryComponents: [],
  bootstrap: [AppComponent],
  providers:[fakeBackendProvider,
    AddressService]
})
export class AppModule { }
