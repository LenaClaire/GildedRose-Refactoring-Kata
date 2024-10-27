import {Item} from './item';

interface AgedBrieItem extends Item {
  name: `${string}Aged Brie${string}`
}

interface BackstagePassesItem extends Item {
  name: `${string}Backstage passes${string}`
}

interface SulfurasItem extends Item {
  name: `${string}Sulfuras${string}`
}

interface ConjuredItem extends Item {
  name: `${string}Conjured${string}`
}

export type {AgedBrieItem, BackstagePassesItem, SulfurasItem, ConjuredItem}
