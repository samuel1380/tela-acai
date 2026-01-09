export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  discount?: string;
  availableAddons?: Addon[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedAddons?: Addon[];
}
