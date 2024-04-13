const allProducts = [
  {
    id: 1,
    name: "Product 1",
    openDate: "1705211309754",
    finishDate: undefined,
    bestBefore: undefined,
    usedWithin: 6,
    isActive: true,
    totalUses: 125,
  },
  {
    id: 2,
    name: "Product 2",
    openDate: "1697435393733",
    finishDate: undefined,
    bestBefore: {
      month: 8,
      year: 2025
    },
    usedWithin: 9,
    isActive: true,
    totalUses: 52,
  },
  {
    id: 3,
    name: "Product 3",
    openDate: "1686808366041",
    finishDate: "1712296547100",
    bestBefore: undefined,
    usedWithin: 12,
    isActive: false,
    totalUses: 212,
  },
];

export default allProducts;
