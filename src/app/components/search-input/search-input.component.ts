import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _injector = inject(Injector);

  query = signal('');

  search = output<string>();

  ngOnInit(): void {
    toObservable(this.query, { injector: this._injector })
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this.search.emit(value);
      });
  }

  clear(): void {
    this.query.set('');
  }

  handleInput(event: HTMLInputElement): void {
    this.query.set(event.value);
  }
}
