/**
 * Risiti - app-wide constants.
 * Keep every magic number here so behaviour can be tuned in one place.
 */
const STORAGE_KEY = 'risiti.v5';
const DAY = 864e5;
const VAT_RATE = 0.16;
const MAX_PRODUCTS = 12;
const LOW_STOCK_DEFAULT = 5;
const TRACK_STOCK_START = 10;
const STK_DELAY_MS = 4500;
const SLIDE_MS = 5000;
const SPLASH_MS = 1500;
const COUNT_UP_MS = 750;
const OTP_LENGTH = 6;
const DEMO_OTP = '123456';
const OTP_RESEND_SECONDS = 59;
const AUTOFILL_START_MS = 900;
const AUTOFILL_DIGIT_MS = 130;
const PERIODS = ['All', 'Today', 'This week', 'This month'];

/** Shop types shown during setup. `starter` items are pre-loaded so the first sale takes one tap. */
const SHOP_TYPES = {
  'Retail Shop': { emoji: '🛒', starter: [['Bread', 70], ['Milk 500ml', 65], ['Sugar 1kg', 190], ['Cooking oil 1L', 320], ['Maize flour 2kg', 140], ['Airtime', 100]] },
  Restaurant: { emoji: '🍽️', starter: [['Tea', 30], ['Chapati', 20], ['Mandazi', 10], ['Beef stew', 250], ['Chips', 150], ['Soda', 60]] },
  'Salon/Beauty': { emoji: '💈', starter: [['Haircut', 400], ['Braiding', 1500], ['Manicure', 500], ['Blow dry', 600], ['Hair wash', 200], ['Treatment', 800]] },
  'Tech Shop': { emoji: '📱', starter: [['Phone screen', 2500], ['Charger', 600], ['Earphones', 500], ['Phone case', 400], ['Airtime', 100], ['Repair fee', 1000]] },
  Pharmacy: { emoji: '💊', starter: [['Panadol', 50], ['Cough syrup', 250], ['Bandage', 80], ['Vitamin C', 300], ['Face mask', 20], ['Sanitiser', 150]] },
};
const SHOP_CATEGORIES = Object.keys(SHOP_TYPES);
