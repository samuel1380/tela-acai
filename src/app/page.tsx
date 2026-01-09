"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { menuItems } from "@/data/menu";
import { CartItem, Product, Addon } from "@/types";

// --- Icons ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);
const PlusIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);
const MinusIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const QrCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
);
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Açaí 200ml");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<"menu" | "checkout" | "payment" | "success">("menu");
  const [address, setAddress] = useState({ street: "", number: "", neighborhood: "", city: "", complement: "" });
  const [debtor, setDebtor] = useState({ name: "", email: "", document: "", phone: "" });
  const [pixData, setPixData] = useState<{ qrcode: string; qr_code_image_url: string; idTransaction: string } | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes in seconds

  // --- Addon State ---
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  // --- UI State ---
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === "payment" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const categories = ["Açaí 200ml", "Açaí 500ml", "Açaí 1 Litro"];
  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  const handleAddClick = (product: Product) => {
    if (product.availableAddons && product.availableAddons.length > 0) {
      setCustomizingProduct(product);
      setSelectedAddons([]);
      setIsAddonModalOpen(true);
    } else {
      addToCart(product);
    }
  };

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const confirmAddToCart = () => {
    if (!customizingProduct) return;

    // Create a unique ID for customizable items to allow multiple variations
    // Or simpler: just push to array. To simplify "updating quantity", we'll check deep equality or just treat as new line item.
    // For this simplified version, we'll treat every customized item as a distinct line item if it has addons.

    // Construct the item
    const newItem: CartItem = {
      ...customizingProduct,
      quantity: 1,
      selectedAddons: selectedAddons,
      // Override price? No, price is base check cartTotal logic
      // Ideally we store the base price and addons separately or sum them up in a 'finalPrice'
    };

    setCart(prev => [...prev, newItem]);
    setIsAddonModalOpen(false);
    setIsCartOpen(true);
    setCustomizingProduct(null);
    setSelectedAddons([]);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      // Logic for simple products without addons (deduplication)
      const existing = prev.find(item => item.id === product.id && (!item.selectedAddons || item.selectedAddons.length === 0));
      if (existing) {
        return prev.map(item => (item.id === product.id && (!item.selectedAddons || item.selectedAddons.length === 0)) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedAddons: [] }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const addonsTotal = item.selectedAddons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
    return acc + ((item.price + addonsTotal) * item.quantity);
  }, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    setView("checkout");
    setIsCartOpen(false);
  };

  const checkPaymentStatus = async (manual = false) => {
    if (!pixData?.idTransaction) {
      console.warn("Verify Payment: No Transaction ID found.");
      return;
    }

    if (manual) setIsVerifyingPayment(true);

    try {
      const response = await fetch("/api/pix/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idTransaction: pixData.idTransaction })
      });
      const data = await response.json();
      console.log("Status Check Response:", data);

      // Robust status check
      // Robust status check
      // Normalize to uppercase string and trim
      const rawStatus = data.status || data.transaction?.status || data.data?.status || "";
      const status = String(rawStatus).toUpperCase().trim();

      console.log(`[Status Polling] Raw: "${rawStatus}" | Normalized: "${status}"`);

      const successStatuses = [
        "PAID",
        "APPROVED",
        "COMPLETED",
        "CONFIRMED",
        "SETTLED",
        "RECEIVED",
        "SUCCESS",
        "PROCESSED",
        "FINISHED"
      ];

      if (successStatuses.includes(status)) {
        setView("success");
        setCart([]);
      } else {
        if (manual) {
          alert(`Pagamento ainda não confirmado. Status atual: ${rawStatus || "Desconhecido"}. Aguarde mais um pouco.`);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      if (manual) alert("Erro ao verificar status. Tente novamente.");
    } finally {
      if (manual) setIsVerifyingPayment(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === "payment" && pixData?.idTransaction) {
      // Immediate check
      checkPaymentStatus();
      interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [view, pixData]);

  const handlePayment = async () => {
    setIsGeneratingPix(true);
    try {
      const response = await fetch("/api/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cartTotal,
          debtor_name: debtor.name,
          email: debtor.email,
          debtor_document_number: debtor.document,
          phone: debtor.phone,
        })
      });

      const data = await response.json();
      console.log("PIX Create Response:", data);

      // Robust ID extraction
      const transactionId = data.id || data.idTransaction || data.transactionId || data.transaction_id || data.uuid || (data.data && data.data.id);

      if (data.qrcode && transactionId) {
        setPixData({
          ...data,
          idTransaction: transactionId
        });
        setTimeLeft(480);
        setView("payment");
      } else if (data.qrcode) {
        // Fallback if we have QR but no ID (shouldn't happen with correct API)
        console.warn("Received QR Code but NO Transaction ID. Polling will fail.");
        setPixData({ ...data, idTransaction: "" }); // Will cause polling to skip
        setView("payment");
        alert("Pix gerado, mas houve um erro ao identificar a transação para verificação automática. Por favor, guarde seu comprovante.");
      } else {
        console.error("Erro dados Pix:", data);
        alert(`Ops! Não conseguimos gerar o Pix.\n\nDetalhes: ${data.message || JSON.stringify(data) || "Erro desconhecido"}.\n\nVerifique o CPF e tente novamente.`);
      }
    } catch (error: any) {
      console.error("Erro na API Pix:", error);
      alert(`Erro de conexão: ${error.message || "Tente novamente"}`);
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const handleFinish = () => {
    checkPaymentStatus(true);
  };

  // --- LOADING OVERLAY (PIX) ---
  if (isGeneratingPix) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-900/90 backdrop-blur-md">
        <div className="relative">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-zinc-700 border-t-purple-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCodeIcon />
          </div>
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-xl font-bold text-white">Gerando seu Pix</h3>
          <p className="mt-2 text-sm text-zinc-400">Conectando com o banco...</p>
        </div>
      </div>
    );
  }

  // --- SUCCESS VIEW (Modern Timeline Style) ---
  if (view === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none fade-in-background">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl"></div>
        </div>

        <div className="w-full max-w-sm relative z-10 flex flex-col items-center animate-fade-in-soft">

          {/* Main Card */}
          <div className="w-full bg-white rounded-[32px] shadow-xl shadow-purple-900/5 p-8 border border-white/60 backdrop-blur-xl relative overflow-hidden">


            {/* Header Animation */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-purple-50 flex items-center justify-center animate-[scale-up_0.6s_cubic-bezier(0.16,1,0.3,1)_both] shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 animate-[draw-check_0.8s_ease-out_0.4s_both]"><path d="M20 6 9 17 4 12" /></svg>
                </div>
                {/* Ripple Circles */}
                <div className="absolute inset-0 rounded-full border border-purple-100 animate-[ping_2s_infinite]"></div>
                <div className="absolute inset-0 rounded-full border border-purple-50 animate-[ping_2s_infinite_0.4s]"></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Pedido Recebido!</h2>
            <p className="text-center text-zinc-500 text-sm leading-relaxed mb-6">
              Tudo certo com seu pagamento. Agora é relaxar que a gente cuida do resto! 💜
            </p>

            {/* WhatsApp Notification Box - NEW */}
            <div className="mb-8 flex items-start gap-3 rounded-2xl bg-gradient-to-br from-green-50 to-white p-4 border border-green-100 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16Z" /></svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-green-900">Acompanhe pelo WhatsApp</h4>
                <p className="text-xs text-green-700 leading-snug mt-0.5">
                  Vamos te avisar por lá a cada mudança de status do seu pedido. Fique de olho!
                </p>
              </div>
            </div>

            {/* Timeline / Status Steps */}
            <div className="space-y-6 relative">
              {/* Connecting Line */}
              <div className="absolute left-[19px] top-8 bottom-4 w-0.5 bg-gray-100"></div>

              {/* Step 1: Recebido */}
              <div className="relative flex gap-4 items-start z-10">
                <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-200 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 6 9 17 4 12" /></svg>
                </div>
                <div className="pt-1">
                  <h4 className="text-sm font-bold text-zinc-900">Pagamento Confirmado</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Seu pedido já apareceu na nossa tela!</p>
                </div>
              </div>

              {/* Step 2: Preparando */}
              <div className="relative flex gap-4 items-start z-10 animate-[fade-in-up_0.6s_ease-out_0.8s_both]">
                <div className="h-10 w-10 rounded-full bg-white border-2 border-purple-600 flex items-center justify-center shadow-sm shrink-0">
                  <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse"></div>
                </div>
                <div className="pt-1">
                  <h4 className="text-sm font-bold text-purple-600">Em Preparação</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Estamos montando seu açaí...</p>
                </div>
              </div>
            </div>

          </div>

          <button
            onClick={() => setView("menu")}
            className="mt-8 w-full rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white shadow-xl shadow-zinc-200/50 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Voltar para o Cardápio (Acompanhar)
          </button>
        </div>

        <style jsx>{`
          @keyframes scale-up {
             0% { transform: scale(0); opacity: 0; }
             100% { transform: scale(1); opacity: 1; }
          }
          @keyframes draw-check {
             0% { stroke-dasharray: 100; stroke-dashoffset: 100; opacity: 0; }
             100% { stroke-dasharray: 100; stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes fade-in-up {
             0% { transform: translateY(10px); opacity: 0; }
             100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }


  // --- PAYMENT VIEW ---
  if (view === "payment") {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md shadow-sm">
          <button
            onClick={() => setView("checkout")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200"
          >
            <ChevronLeftIcon />
          </button>
          <h2 className="text-lg font-bold">Pagamento</h2>
        </div>

        <div className="flex flex-1 flex-col items-center px-6 py-6 scroll-smooth">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-xl ring-1 ring-black/5 animate-slide-up-soft">
            {/* Timer Header */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-3 flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-red-600 ring-1 ring-red-100">
                <ClockIcon />
                <span className="text-xs font-bold uppercase tracking-wide">Expira em {formatTime(timeLeft)}</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Pague via Pix</h3>
              <p className="mt-1 text-sm text-zinc-500">Escaneie o QR Code ou copie a chave.</p>
            </div>

            {/* QR Code Container - FIXED SIZE to prevent glitches */}
            <div className="mb-8 flex justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-4">
                {pixData?.qrcode ? (
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-white shadow-sm">
                    <Image
                      src={pixData.qr_code_image_url}
                      alt="QR Code Pix"
                      fill
                      className="object-contain mix-blend-multiply"
                      unoptimized
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-zinc-400">
                    <QrCodeIcon />
                    <span className="mt-2 text-xs font-semibold">Carregando...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Copy Paste */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pix Copia e Cola</span>
              </div>

              <div className="relative flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-xs font-mono text-zinc-600">
                    {pixData?.qrcode || "..."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (pixData?.qrcode) {
                      navigator.clipboard.writeText(pixData.qrcode);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }
                  }}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95 ${isCopied ? "bg-emerald-500" : "bg-purple-600 hover:bg-purple-700"
                    }`}
                >
                  {isCopied ? <CheckCircleIcon /> : <CopyIcon />}
                  {isCopied ? "Copiado!" : "Toque para Copiar"}
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="mt-8 border-t border-zinc-100 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">Valor Total</span>
                <span className="text-2xl font-bold text-zinc-900">R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>



          {/* Dev Helper: Simulation Button */}


          <button
            onClick={handleFinish}
            disabled={isVerifyingPayment}
            className="mt-2 w-full max-w-sm rounded-[20px] bg-purple-600 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 active:scale-[0.98] disabled:opacity-70"
          >
            {isVerifyingPayment ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                Verificando...
              </span>
            ) : "Já fiz o pagamento"}
          </button>
        </div>
      </div>
    );
  }

  // --- CHECKOUT VIEW (Estilo Brasileiro) ---
  if (view === "checkout") {
    return (
      <div className="flex min-h-screen flex-col bg-white text-zinc-900 pb-32">
        {/* Header App-like */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setView("menu")}
            className="flex h-10 w-10 items-center justify-center -ml-2 text-purple-600 rounded-full hover:bg-purple-50 active:bg-purple-100 transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <h2 className="text-base font-bold text-gray-800">Finalizar pedido</h2>
        </div>

        <div className="px-5 mt-6 space-y-8">

          {/* Sessão: Endereço */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-purple-600">
              <MapPinIcon />
              <span className="text-gray-900">Endereço de entrega</span>
            </h3>

            <div className="space-y-4">
              {/* Rua */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">Rua / Avenida</label>
                <input
                  className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium placeholder:text-gray-400 border border-transparent focus:border-purple-100"
                  value={address.street}
                  placeholder="Ex: Av. Paulista"
                  onChange={e => setAddress({ ...address, street: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                {/* Número */}
                <div className="w-1/3">
                  <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">Número</label>
                  <input
                    className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium border border-transparent focus:border-purple-100"
                    value={address.number}
                    placeholder="123"
                    type="number"
                    onChange={e => setAddress({ ...address, number: e.target.value })}
                  />
                </div>
                {/* Bairro */}
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">Bairro</label>
                  <input
                    className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium border border-transparent focus:border-purple-100"
                    value={address.neighborhood}
                    placeholder="Bairro"
                    onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                  />
                </div>
              </div>

              {/* Complemento (Opcional) */}
              <div>
                <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">Complemento (opcional)</label>
                <input
                  className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium placeholder:text-gray-400 border border-transparent focus:border-purple-100"
                  value={address.complement || ""}
                  onChange={e => setAddress({ ...address, complement: e.target.value })}
                  placeholder="Apto 101, Bloco B, ao lado da padaria..."
                />
              </div>

              {/* Cidade - Escondido ou menor pois geralmente é local */}
              <div>
                <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">Cidade</label>
                <input
                  className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium border border-transparent focus:border-purple-100"
                  value={address.city}
                  placeholder="Sua cidade"
                  onChange={e => setAddress({ ...address, city: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Sessão: Dados Pessoais */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-purple-600">
              <UserIcon />
              <span className="text-gray-900">Dados de contato</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">Seu nome</label>
                <input
                  className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium placeholder:text-gray-400 border border-transparent focus:border-purple-100"
                  value={debtor.name}
                  placeholder="Nome completo"
                  onChange={e => setDebtor({ ...debtor, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">CPF <span className="text-gray-400 font-normal">(para a nota)</span></label>
                <input
                  className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium placeholder:text-gray-400 border border-transparent focus:border-purple-100"
                  value={debtor.document}
                  placeholder="000.000.000-00"
                  onChange={e => setDebtor({ ...debtor, document: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">Celular / WhatsApp</label>
                <input
                  type="tel"
                  className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium placeholder:text-gray-400 border border-transparent focus:border-purple-100"
                  value={debtor.phone}
                  placeholder="(11) 99999-9999"
                  onChange={e => setDebtor({ ...debtor, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">E-mail <span className="text-gray-400 font-normal">(para o comprovante)</span></label>
                <input
                  type="email"
                  className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium placeholder:text-gray-400 border border-transparent focus:border-purple-100"
                  value={debtor.email}
                  placeholder="seu@email.com"
                  onChange={e => setDebtor({ ...debtor, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Resumo Simples */}
          <div className="pb-8">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-lg font-bold text-gray-900">Resumo</h3>
              <button onClick={() => setIsCartOpen(true)} className="text-purple-600 text-sm font-bold hover:text-purple-700">Ver itens</button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-3 border-b border-gray-200 pb-3">
                <span>Taxa de entrega</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Fixo */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-40">
          <button
            disabled={!address.street || !address.number || !debtor.name || !debtor.document || !debtor.email}
            onClick={handlePayment}
            className="w-full rounded-2xl bg-purple-600 py-3.5 text-base font-bold text-white shadow-xl shadow-purple-200 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all"
          >
            Confirmar e Pagar
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN MENU VIEW ---
  return (
    <div className="flex min-h-screen justify-center bg-white sm:bg-gray-50 text-gray-900 font-sans">
      <div className="w-full min-h-screen max-w-md bg-white shadow-xl sm:min-h-0 sm:my-8 sm:rounded-[32px] sm:ring-1 sm:ring-gray-200 overflow-hidden relative pb-32">

        {/* Cover Image */}
        <div className="relative h-64 w-full">
          <Image
            src="/assets/header-bg-final.png"
            alt="Açaí Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

          {/* Store Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white pb-8 bg-gradient-to-t from-black/80 to-transparent">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Açaí do Paraíso</h1>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Aberto</span>
              <span className="flex items-center gap-1 text-white/90"><span className="text-yellow-400">★</span> 4.9 (120)</span>
              <span className="text-white/70">• 30-45 min</span>
            </div>
          </div>

          {/* Top Icons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* Categories - Sticky */}
        <div className="sticky top-0 z-20 bg-white py-3 shadow-none border-b border-gray-100">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-6 pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all ${activeCategory === cat
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="px-6 py-6 space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-purple-500"></span>
              {activeCategory}
            </h2>

            {filteredItems.map(item => (
              <div key={item.id} className="group flex gap-4 p-4 rounded-[24px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:border-purple-100 hover:shadow-[0_8px_30px_rgb(168,85,247,0.15)]">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="absolute top-0 right-0 p-2">
                    {item.discount && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                        {item.discount}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-600">
                      R$ {item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        R$ {item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-[20px] bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button
                    onClick={() => handleAddClick(item)}
                    className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg text-purple-600 transition-transform active:scale-90 hover:bg-purple-50"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Floating Bottom Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 flex justify-center px-6 pointer-events-none">
          <button
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto w-full max-w-sm flex items-center justify-between rounded-2xl bg-purple-600 py-4 px-6 text-white shadow-2xl shadow-purple-400/50 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-2.5 py-1 rounded-lg">
                <span className="font-bold text-sm">{cartCount}</span>
              </div>
              <span className="font-bold text-sm tracking-wide">Ver Cesta</span>
            </div>
            <span className="font-bold text-base">R$ {cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Enhanced Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in-soft">
          <div className="w-full max-w-md rounded-t-[32px] bg-white h-[85vh] flex flex-col shadow-2xl animate-slide-up-soft">
            <div className="flex items-center justify-between border-b border-gray-50 px-8 py-5">
              <h2 className="text-xl font-bold text-gray-900">Sua Cesta</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-dashed border-gray-100 last:border-0">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.selectedAddons.map(addon => (
                              <span key={addon.id} className="text-[10px] font-medium bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-md">
                                + {addon.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        R$ {((item.price + (item.selectedAddons?.reduce((sum, a) => sum + a.price, 0) || 0)) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-bold text-red-500/80 hover:text-red-600 uppercase tracking-wider"
                      >
                        Remover
                      </button>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-purple-600 transition-colors"><MinusIcon size={14} /></button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-purple-600 transition-colors"><PlusIcon size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-8 space-y-4 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Entrega</span>
                <span className="text-emerald-600 font-bold uppercase text-xs tracking-wide">Grátis</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200/60 dashed">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full rounded-2xl bg-purple-600 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-purple-200 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Addon Modal */}
      {isAddonModalOpen && customizingProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-fade-in-soft p-4 sm:p-0">
          <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slide-up-soft">
            {/* Header Modal */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center relative bg-purple-600 text-white">
              <div>
                <h3 className="text-lg font-bold">{customizingProduct.name}</h3>
                <p className="text-purple-100 text-sm opacity-90">Personalize seu açaí</p>
              </div>
              <button
                onClick={() => setIsAddonModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <XIcon />
              </button>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-3xl translate-y-3"></div>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Adicionais</p>
              <div className="space-y-3">
                {customizingProduct.availableAddons?.map(addon => {
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-100 hover:border-purple-200 bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? "bg-purple-500 border-purple-500" : "border-gray-300 bg-white"}`}>
                          {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12" /></svg>}
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? "text-purple-900" : "text-gray-700"}`}>{addon.name}</span>
                      </div>
                      <span className="text-sm font-bold text-purple-600">+ R$ {addon.price.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Total do item</span>
                <span className="text-xl font-bold text-purple-600">
                  R$ {(customizingProduct.price + selectedAddons.reduce((acc, curr) => acc + curr.price, 0)).toFixed(2)}
                </span>
              </div>
              <button
                onClick={confirmAddToCart}
                className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-200 active:scale-[0.98] transition-all hover:bg-purple-700"
              >
                Adicionar à Cesta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
