/** Restored shared constants; payment and OTP flows remain simulations. */
const STORAGE_KEY='risiti.v5',DAY=864e5,VAT_RATE=.16,MAX_PRODUCTS=12,LOW_STOCK_DEFAULT=5,TRACK_STOCK_START=10,STK_DELAY_MS=4500,SLIDE_MS=5000,SPLASH_MS=1500,COUNT_UP_MS=750,OTP_LENGTH=6,DEMO_OTP='123456',OTP_RESEND_SECONDS=59,AUTOFILL_START_MS=900,AUTOFILL_DIGIT_MS=130;
const PERIODS=['All','Today','This week','This month'];
const SHOP_TYPES={
'Retail Shop':{emoji:'🛒',starter:[['Bread',70],['Milk 500ml',65],['Sugar 1kg',190],['Cooking oil 1L',320],['Maize flour 2kg',140],['Airtime',100]]},
Restaurant:{emoji:'🍽️',starter:[['Tea',30],['Chapati',20],['Mandazi',10],['Beef stew',250],['Chips',150],['Soda',60]]},
'Salon/Beauty':{emoji:'💈',starter:[['Haircut',400],['Braiding',1500],['Manicure',500],['Blow dry',600],['Hair wash',200],['Treatment',800]]},
'Tech Shop':{emoji:'📱',starter:[['Phone screen',2500],['Charger',600],['Earphones',500],['Phone case',400],['Airtime',100],['Repair fee',1000]]},
Pharmacy:{emoji:'💊',starter:[['Panadol',50],['Cough syrup',250],['Bandage',80],['Vitamin C',300],['Face mask',20],['Sanitiser',150]]}};
const SHOP_CATEGORIES=Object.keys(SHOP_TYPES);
const WELCOME_POINTS=[['rec','Professional receipts','Share on WhatsApp or SMS in a few taps'],['phone','Clear payments','Show your Till or Paybill and confirm once paid'],['box','Stock you can track','See what is running low before it runs out']];
