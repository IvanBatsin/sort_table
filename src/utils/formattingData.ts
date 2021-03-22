import { BeerProps, BeerType, IBeer, RawServerData } from "../interfaces";

export const formattingRawServerData = (rawData: RawServerData[], draft: BeerType): IBeer[] => {
  const result: IBeer[] = rawData.map(data => {
    const beer: IBeer = {
      id: +data.i,
      category: data.c,
      price: +data.p,
      title: data.t,
      style: data.s,
      density: +data.d,
      alcohol: parseFloat(data.a),
      mark: data.m,
      tap: +data.tap,
      draft: draft === 'draft'
    }
    return beer;
  });

  return result;
}

export const capitalizeCategory = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export const getUniqueValues = (beers: IBeer[], key: BeerProps): string[] => {
  const allValues = beers.map(beer => beer[key]);
  const uniqueValues = [...new Set(allValues)] as string[];
  return uniqueValues;
}


const filterByNumberValue = (data: IBeer[], value: number, key: BeerProps): IBeer[] => {
  return data.filter(beer => beer[key] === value);
}

const filterByType = (data: IBeer[], sortType: string, key: BeerProps): IBeer[] => {
  return data.filter(beer => beer[key] === sortType);
}

const filterByDraft = (data: IBeer[], isDraft: boolean): IBeer[] => {
  return data.filter(beer => beer.draft === isDraft);
}

const filterByTitle = (data: IBeer[], title: string): IBeer[] => {
  return data.filter(beer => beer.title.toLowerCase().startsWith(title));
}


const sortByTypeFunction = (key: BeerProps, beersArray: IBeer[], value: string): IBeer[] => {
  if (key === 'id' || key === 'price' || key === 'density' || key === 'tap' || key === 'alcohol') {
    return key === 'alcohol' 
      ? filterByNumberValue(beersArray, parseFloat(value), key)
      : filterByNumberValue(beersArray, +value, key);
  } 

  if (key === 'category' || key === 'mark' || key === 'style') {
    return filterByType(beersArray, value, key);
  }

  if (key === 'draft') {
    return filterByDraft(beersArray, value === 'draft');
  }

  return filterByTitle(beersArray, value.toLowerCase());
}

export const sortData = (sortObj: IBeer, allBeer: IBeer[]): IBeer[] => {
  let result: IBeer[] = allBeer;
  (Object.keys(sortObj) as Array<keyof typeof sortObj>).forEach(key => {
    if (sortObj[key]) {
      result = sortByTypeFunction(key, result, sortObj[key] as string);
    }
  });
  return result;
}


export const paginationDisplayData = (itemsPerPage: number, page: number, beerArray: IBeer[]): IBeer[] => {
  const trimStart = page * itemsPerPage - itemsPerPage;
  const trimEnd = trimStart + itemsPerPage;

  return beerArray.slice(trimStart, trimEnd);
}