import { IBeer, ServerResponce } from "../interfaces";
import { createTableThead, createTableTbody, createPagination, populateSelects, createEmptyMessage } from "../utils/createHtml";
import { formattingRawServerData, getUniqueValues, paginationDisplayData, sortData } from "../utils/formattingData";
import { Modal } from './modal';

export class BeerTable {
  private draftBeers: IBeer[];
  private bottlesBeer: IBeer[];
  private tableBeers!: IBeer[];
  private beerProperties: string[];

  // Pagination
  private itemsPerPage: number = 50;
  private currentPage: number = 1;
  private pagesCount!: number;

  // Unique select options
  private uniqueBeerCategories!: string[];
  private uniqueBeerStyles!: string[];
  private uniqueBeerMarks!: string[];
  
  private modalController: Modal;
  
  // DOM elements
  private main: HTMLElement;
  private form: HTMLFormElement;
  private sidebar: HTMLDivElement;
  private burgerMenu: HTMLDivElement;
  private closeSidebarBtn: HTMLSpanElement;

  constructor(modal: Modal){
    this.draftBeers = [];
    this.bottlesBeer = [];
    this.beerProperties = [];
    this.modalController = modal;

    this.main = document.querySelector('main')!;
    this.form = document.querySelector('#sort-form')!;
    this.sidebar = document.querySelector('.sidebar')!;
    this.burgerMenu =  document.querySelector('.menu-bar')!;
    this.closeSidebarBtn = document.querySelector('#close-sidebar')!;

    this.burgerMenu.addEventListener('click', this.handleBurgerMenuCloseOpen);
    this.closeSidebarBtn.addEventListener('click', this.handleBurgerMenuCloseOpen);
  }

  fetchData = async (): Promise<void> => {
    document.body.addEventListener('click', (event: Event) => this.modalController.closeModal(event));

    const req = await fetch('http://localhost:3001/shops');

    if (!req.ok) {
      this.modalController.openModal();
    } else {
      const res: ServerResponce = await req.json();
      this.structureData(res);

      this.populateFormSelects();
      this.drawTable(this.setDisplayData());

      this.form.addEventListener('submit', this.handleFormSubmit);
    }
  }

  structureData = (serverRawData: ServerResponce): void => {
    // Set formatted data
    this.draftBeers = formattingRawServerData(serverRawData.data.draft, 'draft');
    this.bottlesBeer = formattingRawServerData(serverRawData.data.bottles, 'bottle');
    this.beerProperties = Object.keys(this.bottlesBeer[0]);

    // Calculating pagination
    this.tableBeers = this.draftBeers;
    this.setPagesCount();

    // Set uniques values
    this.uniqueBeerCategories = getUniqueValues([...this.draftBeers, ...this.bottlesBeer], 'category');
    this.uniqueBeerMarks = getUniqueValues([...this.draftBeers, ...this.bottlesBeer], 'mark');
    this.uniqueBeerStyles = getUniqueValues([...this.draftBeers, ...this.bottlesBeer], 'style');
  }

  drawTable = (data: IBeer[]): void => {
    // Get and clear main container html
    this.main.innerHTML = '';

    if (data.length) {
      this.main.classList.add('table');

      // Creating table title
      const tableTitle = document.createElement('h1');
      tableTitle.textContent = `Beer - ${data[0].draft ? 'Darft' : 'Bottle'}`;

      // Creating table 
      const table = document.createElement('table');
      table.appendChild(createTableThead(this.beerProperties));
      table.appendChild(createTableTbody(data));

      // Append table 
      this.main.appendChild(tableTitle);
      this.main.appendChild(table);

      this.darwPagination();
    } else {
      this.main.classList.remove('table');
      this.main.appendChild(createEmptyMessage());
    }
  }


  darwPagination = (): void => {
    if (this.pagesCount > 1) {
      this.main.appendChild(createPagination(this.pagesCount, this.currentPage));
      [...document.querySelector('.pagination')?.querySelectorAll('li')!].forEach(li => {
        li.addEventListener('click', this.handelPageClick);
      });
    }
  }

  handleFormSubmit = (event: Event): void => {
    event.preventDefault();

    const obj: any = {};
    const elems = [...this.form.querySelectorAll('input'), ...this.form.querySelectorAll('select')];
    elems.forEach(elem => {
      const id = elem.id;
      let value = elem.value;
      obj[id] = value;
    });

    this.tableBeers = sortData(obj, [...this.bottlesBeer, ...this.draftBeers]);
    this.setCurrentPage(1);
    this.setPagesCount();
    this.drawTable(this.setDisplayData());
    
    this.handleBurgerMenuCloseOpen();
  };


  handleBurgerMenuCloseOpen = (): void => {
    this.burgerMenu.classList.toggle('change');
    this.sidebar.classList.toggle('show');
  }

  handelPageClick = (event: Event): void => {
    const page = +(<HTMLDataListElement>event.target).innerText;
    this.setCurrentPage(page);
  }

  populateFormSelects = (): void => {
    populateSelects('category', this.uniqueBeerCategories);
    populateSelects('mark', this.uniqueBeerMarks);
    populateSelects('style', this.uniqueBeerStyles);
  }

  setPagesCount = (): void => {
    this.pagesCount = Math.ceil(this.tableBeers.length / this.itemsPerPage);
  } 

  setCurrentPage = (value: number): void => {
    this.currentPage = value;
    this.drawTable(this.setDisplayData());
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  setDisplayData = (): IBeer[] => {
    return paginationDisplayData(this.itemsPerPage, this.currentPage, this.tableBeers);
  }
}