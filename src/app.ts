import './styles/style.css';
import { BeerTable } from './controllers/table';
import { modalController } from './controllers/modal';

const table = new BeerTable(modalController);
const loadButton: HTMLButtonElement = document.querySelector('#btn-load')!;


const loadButtonClick = async (): Promise<void> => {
  loadButton.disabled = true;
  loadButton.textContent = 'Loading...';
  await table.fetchData();
  loadButton.disabled = false;
  loadButton.textContent = 'Load Data';
}

loadButton?.addEventListener('click', loadButtonClick);