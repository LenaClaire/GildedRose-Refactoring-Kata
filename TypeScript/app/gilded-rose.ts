import {AgedBrieItem, BackstagePassesItem, ConjuredItem, SulfurasItem} from "./gilded-rose.types";

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  private maxQuality = 50;
  private minQuality = 0;

  private readonly items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    // Validate the incoming items
    items.forEach((item) => {
      const isSulfuras = this.isSulfuras(item)

      if (isSulfuras && item.quality !== 80) {
        throw new Error('Sulfuras quality must be 80')
      }

      if (!isSulfuras && (item.quality > this.maxQuality || item.quality < this.minQuality)) {
        throw new Error(`Quality must be between ${this.minQuality} and ${this.maxQuality} for ${item.name}`)
      }
    })

    this.items = items;
  }

  private isAgedBrie(item: Item): item is AgedBrieItem {
    return item.name.includes('Aged Brie')
  }

  private isBackstagePasses(item: Item): item is BackstagePassesItem {
    return item.name.includes('Backstage passes')
  }

  private isSulfuras(item: Item): item is SulfurasItem {
    return item.name.includes('Sulfuras')
  }

  private isConjured(item: Item): item is ConjuredItem {
    return item.name.includes('Conjured')
  }

  private getValidQuality(quality: number) {
    return Math.max(this.minQuality, Math.min(quality, this.maxQuality))
  }

  /**
   * Get the quality degradation factor for a normal item.
   * After the sellIn date has passed, the quality degrades twice as fast.
   */
  private getQualityDegradationFactor(item: Item) {
    return item.sellIn >= 0 ? 1 : 2;
  }

  /**
   * Update a normal item.
   * Quality degrades twice as fast after the sellIn date has passed.
   */
  private updateNormal(item: Item) {
    item.sellIn -= 1;
    item.quality = this.getValidQuality(item.quality - this.getQualityDegradationFactor(item));
    return item
  }

  /**
   * Update an aged brie item.
   * Quality increases at the same rate a normal item decreases.
   */
  private updateAgedBrie(item: AgedBrieItem) {
    item.sellIn -= 1;
    item.quality = this.getValidQuality(item.quality + this.getQualityDegradationFactor(item));
    return item
  }

  /**
   * Update a conjured item.
   * Quality degrades twice as fast as a normal item.
   */
  private updateConjured(item: ConjuredItem) {
    item.sellIn -= 1;
    item.quality = this.getValidQuality(item.quality - this.getQualityDegradationFactor(item) * 2);
    return item
  }


  /**
   * Update a backstage pass item.
   * - Quality is zero after the concert.
   * - Quality increases by 3 when there are less or equal to 5 days left.
   * - Quality increases by 2 when there are less or equal to 10 days left.
   * - Quality increases by 1 when there are more than 10 days left.
   */
  private updateBackstagePass(item: BackstagePassesItem) {
    item.sellIn -= 1;

    if (item.sellIn < 0) {
      item.quality = 0;
      return item
    }

    if (item.sellIn < 5) {
      item.quality = this.getValidQuality(item.quality + 3);
      return item
    }

    if (item.sellIn < 10) {
      item.quality = this.getValidQuality(item.quality + 2);
      return item
    }

    item.quality = this.getValidQuality(item.quality + 1);
    return item
  }

  private updateItem(item: Item) {
    if (this.isAgedBrie(item)) {
      return this.updateAgedBrie(item)
    }

    if (this.isBackstagePasses(item)) {
      return this.updateBackstagePass(item)
    }

    if (this.isConjured(item)) {
      return this.updateConjured(item)
    }

    if (this.isSulfuras(item)) {
      return item
    }

    return this.updateNormal(item)
  }

  updateQuality() {
    this.items.forEach((item) => this.updateItem(item))
    return this.items
  }
}
