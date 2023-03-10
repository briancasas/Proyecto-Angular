import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { fromEvent, map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { DestinoViaje } from '../models/destino-viaje.model';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})
export class FormDestinoViajeComponent {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  minLongitud = 3;
  searchResults : string[];

  constructor(fb: FormBuilder) {
    this.onItemAdded = new EventEmitter();

    this.fg = fb.group({
      nombre: ['', Validators.compose([
        Validators.required,
        this.nombreValidatorParametrizable(this.minLongitud)
      ])],
      url: ['']
    })
    this.fg.valueChanges.subscribe((form: any) => {
      console.log('cambio el formulario: ', form);
    });
   
  }
  gOnInit() {
  	let elemNombre = <HTMLInputElement>document.getElementById('nombre');
	fromEvent(elemNombre, 'input')
		.pipe(
		  map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
		  filter(text => text.length > 2),
		  debounceTime(120),
		  distinctUntilChanged(),
		  switchMap(() => ajax('/assets/datos.json'))
		).subscribe(ajaxResponse => {
	 		this.searchResults = ajaxResponse.response
				//filtramos client side solo para simplificar el ejemplo
	 			.filter(function(x: string){
	 				return x.toLowerCase().includes(elemNombre.value.toLowerCase());
 				});
		});
  }


  guardar(nombre: string, url: string): boolean {
    let d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }


  nombreValidator(control: FormControl): { [s: string]: boolean } {
    let l = control.value.toString().trim().length;
    if (l > 0 && l < 5) {
      return {invalidNombre: true};
    }
    
    return null;
    }
  
    nombreValidatorParametrizable(minLong: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
        let l = control.value.toString().trim().length;
          if (l > 0 && l < minLong) {
                return { 'minLongNombre': true };
            }
            return null;
        };
    }
}
function ajax(arg0: string): any {
  throw new Error('Function not implemented.');
}

