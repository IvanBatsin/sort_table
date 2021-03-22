import { IBeer, SortNames } from "../interfaces";
import { capitalizeCategory } from "./formattingData";

export const createTableBodyTr = (beer: IBeer): HTMLTableRowElement => {
  const tr = document.createElement('tr');

  (Object.keys(beer) as Array<keyof typeof beer>).forEach(key => {
    if (key !== 'draft') {
      const td = document.createElement('td');
      td.setAttribute('data-label', key);
      td.textContent = `${beer[key]}`;
      tr.appendChild(td);
    }
  });

  return tr;
}

export const createTableTbody = (beers: IBeer[]): HTMLTableSectionElement => {
  const tbody = document.createElement('tbody');
  
  for(let i=0; i<beers.length; i++) {
    tbody.appendChild(createTableBodyTr(beers[i]));
  }

  return tbody;
}

export const createTableThead = (categories: string[]): HTMLTableSectionElement => {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  categories.forEach(category => {
    if (category !== 'draft') {
      const th = document.createElement('th');
      th.innerText = capitalizeCategory(category);
      tr.appendChild(th);
    }
  });
  thead.append(tr);

  return thead;
}

export const createPagination = (pagesCount: number, currentPage: number): HTMLUListElement => {
  const ul = document.createElement('ul');
  ul.classList.add('pagination');

  for(let i=1; i<=pagesCount; i++) {
    const li = document.createElement('li');
    li.textContent = `${i}`;
    i === currentPage && li.classList.add('active');
    ul.appendChild(li);
  }

  return ul;
}


export const populateSelects = (sortTypeName: SortNames, sortValues: string[]): void => {
  const select = document.querySelector(`#${sortTypeName}`);

  const firstOption = document.createElement('option');
  firstOption.value = '';
  firstOption.textContent = '';

  select?.appendChild(firstOption);

  sortValues.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = capitalizeCategory(value);
    select?.appendChild(option);
  });
}


export const createEmptyMessage = (): HTMLDivElement => {
  const div = document.createElement('div');
  div.classList.add('empty');

  const span = document.createElement('span');
  span.textContent = 'Beer not found :(';

  const p = document.createElement('p');
  p.textContent = 'We have a huge selection of beers, try to find something new for yourself';

  const img = document.createElement('img');
  img.src = 'assets/box.svg';
  img.alt = 'Empty';

  div.appendChild(span);
  div.appendChild(p);
  div.appendChild(img);

  return div;
}