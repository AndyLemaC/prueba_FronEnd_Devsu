import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  
  @Input() placeholder: string = 'Buscar...';
  @Output() searchTermChange = new EventEmitter<string>();
  
  searchControl = new FormControl('');
  private subscription = new Subscription();

  ngOnInit(): void {
    // Emitir el término de búsqueda después de 300ms de inactividad
    this.subscription.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(value => {
        this.searchTermChange.emit(value || '');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Limpiar la búsqueda
   */
  clearSearch(): void {
    this.searchControl.setValue('');
  }
}