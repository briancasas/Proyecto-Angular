import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscriber } from 'rxjs';
import { AppState } from '../app.module';
import { DestinoViaje } from '../models/destino-viaje.model';
import { ElegidoFavoritoAction, NuevoDestinoAction } from '../models/destinos-viajes-state.model';
import { DestinosApiClient } from './../models/destinos-api-client.model';



@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
@Output() onItemAdded: EventEmitter<DestinoViaje>;
updates: string[];
 
constructor(
  private destinosApiClient:DestinosApiClient,
  private store: Store<AppState>
) {
this.onItemAdded = new EventEmitter();
this.updates = []; 
   
  }
  ngOnInit(){
    this.store.select(state => state.destinos.favorito)
    .subscribe(data => {
      const f = data;
        if (f != null) {
          this.updates.push('Se eligió: ' + f.nombre);
      }
    });

  }

  agregado(d: DestinoViaje)  {
    
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
    this.store.dispatch(new NuevoDestinoAction(d));
    
  }

  elegido(e: DestinoViaje) {
    this.destinosApiClient.elegir(e);
    this.store.dispatch(new ElegidoFavoritoAction(e));
  }
}
