import { Category } from "@/types/product";

export const getCategoryIdByName = (data: Category[], name: string) => {
  return data.find((c) => c.name === name)?.id;
};
