import { Product } from "../product";

it("implements optimistic concurrency control", async () => {
  const product = Product.build({
    title: "tshirt",
    price: 10,
    userId: "123qwe",
  });

  await product.save();

  const firstInstace = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);

  firstInstace!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstace!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("version number increments on multiple saves", async () => {
  const product = Product.build({
    title: "tshirt",
    price: 10,
    userId: "123qwe",
  });

  await product.save();
  expect(product.version).toEqual(0);
  await product.save();
  expect(product.version).toEqual(1);
  await product.save();
  expect(product.version).toEqual(2);
});
