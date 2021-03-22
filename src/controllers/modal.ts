export class Modal {
  private overlay!: HTMLDivElement;

  constructor(){
    this.overlay = document.querySelector('.overlay')!;
  }

  openModal(): void {
    this.overlay.style.display = 'flex';
  }

  closeModal(event: Event): void {
    if ((<HTMLDivElement | HTMLSpanElement>event.target).classList.contains('overlay') || (<HTMLDivElement | HTMLSpanElement>event.target).id === 'close-modal') {
      this.overlay.style.display = 'none';
      document.body.removeEventListener('click', (event: Event) => this.closeModal(event));
    }
  }
}

export const modalController = new Modal();