const acaiImage = "/assets/acai-product.png";

import { Product } from "../types";

// --- Adicionais Comuns ---
const commonAddons = [
  { id: "leite-ninho", name: "Leite Ninho", price: 1.00 },
  { id: "leite-cond", name: "Leite Condensado", price: 0.50 },
  { id: "granola", name: "Granola Crocante", price: 0.50 },
  { id: "banana", name: "Banana em Rodelas", price: 1.00 },
  { id: "morango", name: "Morango Fresco", price: 1.50 },
  { id: "kiwi", name: "Kiwi", price: 1.50 },
  { id: "nutella", name: "Nutella Original", price: 2.50 },
  { id: "pacoca", name: "Paçoca", price: 0.50 },
  { id: "confete", name: "Confetes (M&M's)", price: 1.00 },
  { id: "chocolate", name: "Raspas de Chocolate", price: 1.50 },
  { id: "chantilly", name: "Chantilly", price: 1.50 },
  { id: "mel", name: "Mel", price: 1.00 },
];

export const menuItems: Product[] = [
  // --- Promoção Teste (Mantendo em 500ml por enquanto ou removendo se não encaixar) ---
  {
    id: "1",
    name: "Açaí Completo 500ml (Promo)",
    description: "PROMOÇÃO: Açaí batido com banana, morango, leite em pó e leite condensado.",
    price: 15.00,
    originalPrice: 28.00,
    image: acaiImage,
    category: "Açaí 500ml",
    availableAddons: commonAddons,
    discount: "SUPER OFERTA"
  },

  // --- 200ml ---
  {
    id: "200-1",
    name: "Açaí Puro 200ml",
    description: "Copo pequeno, ideal para um lanche rápido. Totalmente personalizável.",
    price: 10.00,
    originalPrice: 15.00,
    image: acaiImage,
    category: "Açaí 200ml",
    availableAddons: commonAddons,
    discount: "OFERTA"
  },
  {
    id: "200-2",
    name: "Açaí com Banana 200ml",
    description: "Açaí batido com banana (massa sabor banana), cremoso e sem pedaços.",
    price: 12.00,
    originalPrice: 18.00,
    image: acaiImage,
    category: "Açaí 200ml",
    availableAddons: commonAddons,
    discount: "OFERTA"
  },

  // --- 500ml ---
  {
    id: "500-1",
    name: "Açaí Puro 500ml",
    description: "O tamanho favorito! Meio litro de açaí puro.",
    price: 15.00,
    originalPrice: 25.00,
    image: acaiImage,
    category: "Açaí 500ml",
    availableAddons: commonAddons,
    discount: "OFERTA"
  },
  {
    id: "500-2",
    name: "Açaí com Banana 500ml",
    description: "Açaí batido com banana (massa sabor banana), super cremoso.",
    price: 20.00,
    originalPrice: 28.00,
    image: acaiImage,
    category: "Açaí 500ml",
    availableAddons: commonAddons,
    discount: "OFERTA"
  },

  // --- 1 Litro ---
  {
    id: "1000-1",
    name: "Açaí Puro 1 Litro",
    description: "Para quem ama muito açaí! Pote de 1 Litro pra dividir com a galera.",
    price: 30.00,
    originalPrice: 45.00,
    image: acaiImage,
    category: "Açaí 1 Litro",
    availableAddons: commonAddons,
    discount: "MEGA PROMO"
  },
  {
    id: "1000-2",
    name: "Açaí com Banana 1 Litro",
    description: "1 Litro de açaí batido com banana (massa sabor banana).",
    price: 35.00,
    originalPrice: 50.00,
    image: acaiImage,
    category: "Açaí 1 Litro",
    availableAddons: commonAddons,
    discount: "MEGA PROMO"
  }
];
