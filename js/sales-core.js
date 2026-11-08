/**
 * Risiti — authoritative sale calculation and local-first sync core.
 *
 * Rules:
 * - All monetary values are stored as integer cents.
 * - A sale is not considered saved until its items, payment method,
 *   discounts, VAT, totals and receipt data are written together.
 * - Sales are saved locally first, then synced once when online.
 * - Stock movements are linked to the sale that caused them.
 */

const SALE_STATUS = {
  SAVED_LOCAL: "saved_local",
  SYNCED: "synced",
  VOIDED: "voided"
};

const money = {
  toCents(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount) || amount < 0) return 0;
    return Math.round(amount * 100);
  },
  fromCents(cents) {
    return (Number(cents || 0) / 100).toFixed(2);
  }
};

function calculateSaleTotals(items, discount = 0, vatEnabled = false) {
  const itemTotals = (items || []).map((item) => {
    const quantity = Math.max(0, Number(item.quantity) || 0);
    const unitPriceCents = money.toCents(item.price);
    const lineDiscountCents = money.toCents(item.lineDiscount || 0);

    const lineTotalCents = Math.max(
      0,
      quantity * unitPriceCents - lineDiscountCents
    );

    return {
      ...item,
      quantity,
      unitPriceCents,
      lineDiscountCents,
      lineTotalCents
    };
  });

  const subtotalCents = itemTotals.reduce(
    (total, item) => total + item.lineTotalCents,
    0
  );

  const discountCents = Math.min(
    money.toCents(discount),
    subtotalCents
  );

  const taxableCents = subtotalCents - discountCents;
  const vatCents = vatEnabled ? Math.round(taxableCents * 0.16) : 0;
  const totalCents = taxableCents + vatCents;

  return {
    items: itemTotals,
    subtotalCents,
    discountCents,
    vatCents,
    totalCents
  };
}

function validateSale(sale) {
  if (!sale.items?.length) {
    throw new Error("Add at least one item before saving.");
  }

  if (!["cash", "mpesa"].includes(sale.paymentMethod)) {
    throw new Error("Choose Cash or M-Pesa.");
  }

  const calculated = calculateSaleTotals(
    sale.items,
    sale.discount,
    sale.vatEnabled
  );

  if (calculated.totalCents !== sale.totalCents) {
    throw new Error("Sale total does not match its items.");
  }

  if (sale.totalCents < 0) {
    throw new Error("Sale total cannot be negative.");
  }

  return calculated;
}

function createSaleId() {
  return `sale_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildSaleFromDraft(draft, shop) {
  const totals = calculateSaleTotals(
    draft.items,
    draft.discount,
    shop?.vatEnabled || false
  );

  return {
    id: createSaleId(),
    shopId: shop?.id || null,
    createdAt: new Date().toISOString(),

    items: totals.items,
    paymentMethod: draft.paymentMethod,
    paymentStatus:
      draft.paymentMethod === "cash" ? "paid" : "pending",
    customerPhone: draft.phone || null,
    mpesaReference: draft.mpesaReference || null,

    discount: draft.discount || 0,
    vatEnabled: shop?.vatEnabled || false,

    subtotalCents: totals.subtotalCents,
    discountCents: totals.discountCents,
    vatCents: totals.vatCents,
    totalCents: totals.totalCents,

    receipt: {
      number: `R-${String(Date.now()).slice(-6)}`,
      issuedAt: new Date().toISOString(),
      version: 1
    },

    stockMovements: totals.items.map((item) => ({
      productId: item.id,
      productName: item.name,
      quantityChange: -item.quantity,
      reason: "sale",
      saleId: null
    })),

    status: SALE_STATUS.SAVED_LOCAL,
    syncedAt: null
  };
}

function readSales() {
  try {
    return JSON.parse(localStorage.getItem("risiti_sales") || "[]");
  } catch (error) {
    return [];
  }
}

function writeSales(sales) {
  localStorage.setItem("risiti_sales", JSON.stringify(sales));
}

function saveSaleLocally(sale) {
  const sales = readSales();

  if (sales.some((existing) => existing.id === sale.id)) {
    throw new Error("This sale has already been saved.");
  }

  sales.push(sale);
  writeSales(sales);
}

function getUnsyncedSales() {
  return readSales().filter(
    (sale) => sale.status === SALE_STATUS.SAVED_LOCAL
  );
}

function markSaleSynced(saleId) {
  const sales = readSales();
  const sale = sales.find((item) => item.id === saleId);

  if (!sale) return;

  sale.status = SALE_STATUS.SYNCED;
  sale.syncedAt = new Date().toISOString();

  writeSales(sales);
}

async function syncSale(sale) {
  const response = await fetch("/api/sales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sale)
  });

  if (!response.ok) {
    throw new Error("Could not sync sale.");
  }

  markSaleSynced(sale.id);
}

async function syncPendingSales() {
  const pending = getUnsyncedSales();

  for (const sale of pending) {
    try {
      await syncSale(sale);
    } catch (error) {
      break;
    }
  }
}

window.addEventListener("online", syncPendingSales);
