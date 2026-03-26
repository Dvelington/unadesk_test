import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appRightClick]',
  standalone: true,
})
export class RightClickDirective {
  @Output() appRightClick = new EventEmitter<MouseEvent>();

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.appRightClick.emit(event);
  }
}
