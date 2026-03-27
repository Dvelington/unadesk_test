import { ElementRef, inject, Injectable, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IAnotationItem, ISelection } from './annotation.service';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private _sanitizer = inject(DomSanitizer);

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  highlightedHtml = signal<SafeHtml>('');

  renderHighlights(text: string, annotations: IAnotationItem[]) {
    const html = this.buildHighlightedHtml(text, annotations);
    this.highlightedHtml.set(this._sanitizer.bypassSecurityTrustHtml(html));
  }

  private buildHighlightedHtml(text: string, anns: IAnotationItem[]): string {
    if (!text) return '';

    const sortedAnns = [...anns].sort(
      (a, b) => a.selection.start - b.selection.start,
    );

    let result = '';
    let lastIndex = 0;

    for (const ann of sortedAnns) {
      const { start, end } = ann.selection;

      if (start > lastIndex) {
        result += this.escapeHtml(text.slice(lastIndex, start));
      }

      const title = ann.annotation.text || '';
      const color = ann.annotation.color || '#ffeb3b';

      result += `<span class="annotation" 
                       style="text-decoration: underline; text-decoration-color: ${color};"
                       title="${this.escapeHtml(title)}">
                  ${this.escapeHtml(text.slice(start, end))}
                 </span>`;

      lastIndex = Math.max(lastIndex, end);
    }

    if (lastIndex < text.length) {
      result += this.escapeHtml(text.slice(lastIndex));
    }

    return result;
  }

  toSnapshot(
    sel: Selection | null,
    postBody?: ElementRef<HTMLDivElement>,
  ): ISelection | null {
    if (!sel || sel.rangeCount === 0 || !postBody) return null;

    const range = sel.getRangeAt(0);
    const container = postBody.nativeElement;

    const start = this.getGlobalOffset(
      container,
      range.startContainer,
      range.startOffset,
    );
    const end = this.getGlobalOffset(
      container,
      range.endContainer,
      range.endOffset,
    );

    return {
      text: sel.toString(),
      start,
      end,
    };
  }

  private getGlobalOffset(
    root: HTMLElement,
    node: Node,
    offset: number,
  ): number {
    let totalChars = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    let currentNode: Node | null;
    while ((currentNode = walker.nextNode())) {
      if (currentNode === node) {
        return totalChars + offset;
      }
      totalChars += (currentNode as Text).length;
    }
    return -1;
  }
}
