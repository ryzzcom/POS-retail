export const productsInventoryService = {
  getProducts: async () => Promise.resolve([]),
  getProductById: async (_id: string) => Promise.resolve(null),
  createProduct: async (_data: unknown) => Promise.resolve(),
  updateProduct: async (_id: string, _data: unknown) => Promise.resolve(),
  archiveProduct: async (_id: string) => Promise.resolve(),
  adjustStock: async (_data: unknown) => Promise.resolve(),
};
