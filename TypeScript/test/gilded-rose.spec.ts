import { GildedRose, Item } from '@/gilded-rose';

const advanceDays = (gildedRose: GildedRose, amountOfDays: number) => {
  let items: Item[] = []
  for (let i = 0; i < amountOfDays; i++) {
    items = gildedRose.updateQuality()
  }
  return items
}

describe('Gilded Rose - updateQuality', () => {
  it('should decrease quality and sellIn property for a non-special item', () => {
    const gildedRose = new GildedRose([new Item('Basic Item', 10, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.name).toBe('Basic Item');
    expect(items[0]?.sellIn).toBe(9)
    expect(items[0]?.quality).toBe(19)
  });

  it('should decrease quality multiple days', () => {
    const gildedRose = new GildedRose([new Item('Basic Item', 10, 20)]);
    const items = advanceDays(gildedRose, 5);
    expect(items[0]?.quality).toBe(15)
    expect(items[0]?.sellIn).toBe(5)
  })

  it('should never decrease quality below zero', () => {
    const gildedRose = new GildedRose([
      new Item('Basic Item', 10, 0),
      new Item('Basic Item', 10, 1),
    ]);

    const items = advanceDays(gildedRose, 5);
    expect(items[0]?.quality).toBe(0)
    expect(items[0]?.sellIn).toBe(5)
    expect(items[1]?.quality).toBe(0)
    expect(items[1]?.sellIn).toBe(5)
  })

  it('should decrease quality twice as fast when sellIn is below 0', () => {
    const gildedRose = new GildedRose([new Item('Basic Item', 0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(18)
    expect(items[0]?.sellIn).toBe(-1)
  })

  it('Should not decrease quality twice as fast on final day', () => {
    const gildedRose = new GildedRose([new Item('Basic Item', 1, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(19)
    expect(items[0]?.sellIn).toBe(0)
  })

  it('should increase quality for Aged Brie', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 10, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(21)
    expect(items[0]?.sellIn).toBe(9)
  })

  it('should increase quality twice as fast for Aged Brie after sellIn date', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(22)
    expect(items[0]?.sellIn).toBe(-1)
  })

  it('should not increase quality above 50 for Aged Brie', () => {
    const gildedRose = new GildedRose([
      // Test if a +1 increase is capped at 50
      new Item('Aged Brie', 10, 45),
      // Test if a +2 increase is capped at 50
      new Item('Aged Brie', -1, 49),
      // Test if a 50 quality item does not increase
      new Item('Aged Brie', 10, 50),
    ]);
    const items = advanceDays(gildedRose, 8);

    expect(items[0]?.quality).toBe(50)
    expect(items[0]?.sellIn).toBe(2)

    expect(items[1]?.quality).toBe(50)
    expect(items[1]?.sellIn).toBe(-9)

    expect(items[2]?.quality).toBe(50)
    expect(items[2]?.sellIn).toBe(2)
  })

  it('should increase quality by 1 for Backstage passes if more than 10 days left', () => {
    const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(21)
    expect(items[0]?.sellIn).toBe(14)
  })

  it('should increase quality by 2 for Backstage passes if 10 days or less left', () => {
    const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(22)
    expect(items[0]?.sellIn).toBe(9)
  })

  it('should increase quality by 3 for Backstage passes if 5 days or less left', () => {
    const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(23)
    expect(items[0]?.sellIn).toBe(4)
  })

  it('should set quality to 0 for Backstage passes after concert', () => {
    const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(0)
    expect(items[0]?.sellIn).toBe(-1)
  })

  it('should not increase quality above 50 for Backstage passes', () => {
    const gildedRose = new GildedRose([
      // Test if a +1 increase is capped at 50
      new Item('Backstage passes to a TAFKAL80ETC concert', 100, 47),

      // Test if a +2 increase is capped at 50
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49),
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 45),


      // Test if a +3 increase is capped at 50
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49),

      // Test if a +2 and follow up +3 increase is capped at 50
      new Item('Backstage passes to a TAFKAL80ETC concert', 6, 47),


      // Test if a 50 quality item does not increase
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 50),
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 50),
    ]);

    // Only advance 4 days. Otherwise, the quality would be set to 0
    const items = advanceDays(gildedRose, 4);


    expect(items[0]?.quality).toBe(50)
    expect(items[0]?.sellIn).toBe(96)

    expect(items[1]?.quality).toBe(50)
    expect(items[1]?.sellIn).toBe(6)

    expect(items[2]?.quality).toBe(50)
    expect(items[2]?.sellIn).toBe(6)

    expect(items[3]?.quality).toBe(50)
    expect(items[3]?.sellIn).toBe(1)

    expect(items[4]?.quality).toBe(50)
    expect(items[4]?.sellIn).toBe(2)

    expect(items[5]?.quality).toBe(50)
    expect(items[5]?.sellIn).toBe(6)

    expect(items[6]?.quality).toBe(50)
    expect(items[6]?.sellIn).toBe(1)

  })

  it('should decrease quality twice as fast for Conjured items', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 10, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(18)
    expect(items[0]?.sellIn).toBe(9)
  })

  it('should decrease quality four times as fast for Conjured items after sellIn date', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(16)
    expect(items[0]?.sellIn).toBe(-1)
  })

  it('should leave Sulfuras quality and sellIn unchanged', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 80)]);
    const items = gildedRose.updateQuality();
    expect(items[0]?.quality).toBe(80)
    expect(items[0]?.sellIn).toBe(10)
  })
});

describe('Gilded Rose - input validation', () => {
  it('should throw an error if quality is below 0', () => {
    expect(() => new GildedRose([new Item('Basic Item', 10, -1)]))
      .toThrowError('Quality must be between 0 and 50 for Basic Item')
  })

  it('should throw an error if quality is above 50', () => {
    expect(() => new GildedRose([new Item('Basic Item', 10, 51)]))
      .toThrowError('Quality must be between 0 and 50 for Basic Item')
  })

  it('should throw an error if Sulfuras quality is not 80', () => {
    expect(() => new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 50)]))
      .toThrowError('Sulfuras quality must be 80')
  })
})
