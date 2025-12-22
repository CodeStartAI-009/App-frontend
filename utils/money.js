// utils/money.js

/* ---------- MINIMAL FALLBACK (ONLY FOR BROKEN INTL) ---------- */
const FALLBACK_SYMBOLS = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "$",
    CAD: "$",
    SGD: "$",
    AED: "د.إ",
    CHF: "CHF",
    CNY: "¥",
  };
  
  /* ---------- SYMBOL ONLY ---------- */
  export const formatCurrencyLabel = (currency = "INR") => {
    try {
      const parts = new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).formatToParts(0);
  
      const symbol = parts.find((p) => p.type === "currency")?.value;
  
      // Intl success → works for ALL countries
      if (symbol) return symbol;
  
      // Intl partially failed
      return FALLBACK_SYMBOLS[currency] || currency;
    } catch {
      // Android / Hermes fallback
      return FALLBACK_SYMBOLS[currency] || currency;
    }
  };
  
  /* ---------- FULL MONEY FORMAT ---------- */
  export const formatMoney = (amount = 0, currency = "INR") => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(Number(amount || 0));
    } catch {
      const symbol = formatCurrencyLabel(currency);
      return `${symbol}${Number(amount || 0).toLocaleString()}`;
    }
  };
  