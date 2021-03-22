export type BeerType = 'draft' | 'bottle';
export type SortNames = 'mark' | 'style' | 'category';

export interface RawServerData {
  "i": string,
  "c": string,
  "p": string,
  "t": string,
  "s": string,
  "d": string,
  "a": string,
  "m": string,
  "tap": string
}

export interface ServerResponce {
  shop_id: number,
  data: {
    draft: RawServerData[],
    bottles: RawServerData[]
  } 
}

export interface IBeer {
  id: number,
  category: string,
  price: number,
  title: string,
  style: string,
  density: number,
  alcohol: number,
  mark: string,
  tap: number,
  draft: boolean
}

export type BeerProps = keyof IBeer;