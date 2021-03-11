import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Country } from './models/country';
import { District } from './models/district';
import { State } from './models/state';
import { AddressService } from './services/addressService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  
  isDarkTheme = false;
  previousCountry:number = 0;
  previoustState:number = 0;
  countries: Country[] =[];
  states: State[]
  districts :District[];
  addressForm: FormGroup;    
  //countryCtl:FormControl ;
  constructor( private fb: FormBuilder, private addressService: AddressService) { }
  
  ngOnInit(){
    this.addressForm = this.fb.group({
      'countryCtl': ['', Validators.required],
      'stateCtl': [null, Validators.required],
      'districtCtl': [null]
    });
    this.addressService.getAllCountories().subscribe(data => {
      this.countries = data;
    });
  }
  get countryCtl() { return this.addressForm.get( 'countryCtl' ); }
  get stateCtl() { return this.addressForm.get( 'stateCtl' ); }
  get districtCtl() { return this.addressForm.get( 'districtCtl' ); }
  
  onCountryChange(): void {
    const countryId= this.countryCtl.value;
    if(countryId && this.previousCountry != countryId){
      this.addressService.getstateByCountoryId(countryId).subscribe((data:State[]) => {
        if(data.length == 0){
          this.states = [{ id:0,countryId:countryId,name: 'No Available'}]
        }else{
          this.states = data;
        }
      });
    }
  }
  onStateChange(): void {
    const stateId= this.stateCtl.value;
    if(stateId && this.previoustState != stateId){
      this.addressService.getstateByCountoryId(stateId).subscribe((data:District[]) => {
        this.districts = data;
        if(data.length == 0){
          this.districts = [{ id:0,stateId:stateId,name: 'No Available'}]
        }else{
          this.districts = data;
        }
      });
    }
  }
}