import { UseTime } from "@/types/usage";

const usages = [
  {
    id: 1000,
    productId: 1,
    productName: "Product 1",
    useDate: "1713743195125",
    useTime: UseTime.Daytime,
  },
  {
    id: 1001,
    productId: 1,
    productName: "Product 1",
    useDate: "1713743195125",
    useTime: UseTime.Nighttime,
  },
  {
    id: 1002,
    productId: 2,
    productName: "Product 2",
    useDate: "1713743195125",
    useTime: UseTime.Daytime,
  },
];

export default usages;
