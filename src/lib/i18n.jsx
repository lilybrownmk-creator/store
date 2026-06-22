import React, { createContext, useContext, useState, useEffect } from 'react'

// ─── Translations ────────────────────────────────────────────────────────────
export const translations = {
  EN: {
    // Header / Nav
    menu:            'MENU',
    tagline:         'Personal delivery across North Macedonia ',
    search_ph:       'Search products...',
    no_results:      'No results for',
    clear_search:    'Clear search',

    // Category tab labels (broad)
    cat_all:         'All Products',
    cat_bestsellers: 'Best Sellers',
    cat_Perfume:     'PERFUMES',
    cat_Home_Scent:  'HOME SCENT',
    cat_Body:        'BODY',
    cat_Hands:       'HANDS',
    cat_Hair:        'HAIR',
    cat_Self_Care:   'SELF CARE',
    // Category tab labels (specific product types)
    cat_Hand_Cream:        'HAND CREAM',
    cat_Body_Cream:        'BODY CREAM',
    cat_Diffuser:          'DIFFUSERS',
    cat_Shower_Gel:        'SHOWER GEL',
    cat_Body_Scrub:        'BODY SCRUB',
    cat_Body_Oil:          'BODY OIL',
    cat_Body_Butter:       'BODY BUTTER',
    cat_Candle:            'CANDLES',
    cat_Liquid_Soap:       'LIQUID SOAP',
    cat_Soap:              'SOLID SOAP',
    cat_Dead_Sea_Salt:     'DEAD SEA SALT',
    cat_Shampoo:           'SHAMPOO',
    cat_Hair_Conditioner:  'CONDITIONER',
    cat_Keratin_Hair_Mask: 'HAIR MASK',
    // Legacy keys (kept for compat)
    cat_Hand_cream: 'HAND CREAM', cat_Body_cream: 'BODY CREAM',
    cat_Shower_gel: 'SHOWER GEL', cat_Body_scrub: 'BODY SCRUB',
    cat_Body_oil: 'BODY OIL', cat_Liquid_soap: 'LIQUID SOAP',
    cat_Solid_soap: 'SOLID SOAP', cat_Hair_conditioner: 'CONDITIONER',
    cat_Keratin_hair_mask: 'HAIR MASK', cat_Dead_sea_salt: 'DEAD SEA SALT',
    cat_Giftbox: 'GIFT SETS',

    // Section view
    see_all:         'See all',
    best_sellers_title: 'BEST SELLERS',

    // Banners
    bestsellers_count:  (n) => `${n} BESTSELLER PRODUCTS`,
    free_delivery_banner: (threshold) => `FREE DELIVERY ON ORDERS OVER ${threshold}`,

    // Product card / modal
    add_to_bag:      'ADD TO BAG',
    out_of_stock:    'OUT OF STOCK',
    only_left:       (n) => `ONLY ${n} LEFT`,
    back:            'BACK',
    swipe_browse:    'SWIPE TO BROWSE',
    add_to_cart:     'ADD TO CART',
    add_wishlist:    'Add to Wishlist',
    remove_wishlist: 'Remove from Wishlist',

    // Bottom nav
    shop:     'SHOP',
    wishlist: 'WISHLIST',
    bundle:   'BUNDLE',
    orders:   'ORDERS',
    bag:      'BAG',

    // Footer
    free_delivery_footer: (cur) => cur === 'EUR' ? '€150' : '9.230 ден',
    contact: 'CONTACT',

    // Cart drawer
    shopping_bag:   (n) => `SHOPPING BAG (${n})`,
    bag_empty:      'YOUR BAG IS EMPTY',
    away_free:      (amt) => `${amt} away from free delivery`,
    free_unlocked:  '✓ Free delivery unlocked',
    subtotal:       'SUBTOTAL',
    delivery:       'DELIVERY',
    free:           'FREE',
    total:          'TOTAL',
    checkout:       'CHECKOUT',
    secure_payment: 'SECURE ONLINE PAYMENT',

    // Filter panel
    filters:        'FILTERS',
    clear_all:      'Clear All',
    collections:    'Collections',
    bestsellers_filter: 'Best Sellers',
    new_arrivals:   'New Arrivals',
    in_stock_only:  'In Stock Only',
    price_range:    'Price Range',
    shop_by:        'Shop By',
    browse_by:      'Browse by Category',
    active_filters: 'Active Filters',
    in_stock_badge: 'In Stock',

    // Collection group labels (filter panel)
    col_perfume:    'Perfume',
    col_home_scent: 'Home Scent',
    col_body:       'Body',
    col_hands:      'Hands',
    col_self_care:  'Self Care',
    col_hair:       'Hair',
    col_travel:     'Travel Size',

    // Checkout form
    delivery_details:  'DELIVERY DETAILS',
    delivery_method:   'DELIVERY METHOD *',
    delivery_label:    'DELIVERY',
    delivery_sub:      'To your address',
    pickup_label:      'PICKUP',
    pickup_sub:        'Collect in store',
    pickup_location:   'PICKUP LOCATION',
    budapest_store:    'Skopje Store',
    pickup_note:       "We'll contact you when ready for pickup",
    pickup_date:       'PICKUP DATE *',
    delivery_date:     'DELIVERY DATE *',
    select_date:       'Select date',
    full_name:         'FULL NAME *',
    phone:             'PHONE *',
    email:             'EMAIL',
    notes_opt:         'PERSONAL ASSEMBLY NOTE (OPTIONAL)',
    notes_ph:          'e.g. Gift wrap, include a card, special presentation…',
    delivery_address:  'DELIVERY ADDRESS *',
    city:              'CITY *',
    postal_code:       'POSTAL CODE *',
    items_count:       (n) => `SUBTOTAL (${n} ITEMS)`,
    preparing_payment: 'PREPARING PAYMENT…',
    pay_revolut:       'PAY WITH REVOLUT',
    secure_revolut:    'SECURE PAYMENT VIA REVOLUT PAY',
    revolut_opening:   'REVOLUT PAY OPENING…',
    complete_popup:    'Complete your payment in the Revolut popup.',
    back_to_order:     '← Back to order details',
    thank_you:         'THANK YOU',
    order_confirmed:   'ORDER CONFIRMED',
    payment_received:  'Payment received. We will contact you to confirm delivery.',
    continue_shopping: 'CONTINUE SHOPPING',

    // Wishlist page
    back_to_shop:    'BACK TO SHOP',
    my_wishlist:     'MY WISHLIST',
    saved_items:     (n) => `${n} SAVED ITEMS`,
    loading:         'LOADING...',
    wishlist_empty:  'YOUR WISHLIST IS EMPTY',
    wishlist_hint:   'Save your favourite products to revisit them later',
    view_in_shop:    'VIEW IN SHOP',

    // Orders page
    my_orders:       'MY ORDERS',
    orders_count:    (n) => `${n} ORDERS`,
    order_number:    'ORDER NUMBER',
    items_label:     'ITEMS',
    quantity:        (n) => `Quantity: ${n}`,
    delivery_addr:   'DELIVERY ADDRESS',
    notes_label:     'NOTES',
    no_orders:       'NO ORDERS YET',
    no_orders_hint:  'Start shopping to see your orders here',
    start_shopping:  'START SHOPPING',
    status_pending:   { label: 'Order Received', desc: 'Your order has been received and is being processed' },
    status_confirmed: { label: 'Confirmed',      desc: 'Your order has been confirmed' },
    status_preparing: { label: 'Preparing',      desc: 'We are carefully preparing your order' },
    status_shipped:   { label: 'Shipped',        desc: 'Your order is on its way to you' },
    status_delivered: { label: 'Delivered',      desc: 'Your order has been delivered' },
    status_cancelled: { label: 'Cancelled',      desc: 'This order has been cancelled' },

    // Bundle builder
    back_to_shop_link:     'BACK TO SHOP',
    create_gift:           'CREATE YOUR GIFT SET',
    build_collection:      'BUILD A CUSTOM GIFT BOX COLLECTION',
    search_products_ph:    'Search products...',
    your_gift_set:         'YOUR GIFT SET',
    gift_set_name_ph:      'Gift Set Name (e.g., For Mom)',
    start_adding:          'Start adding products',
    subtotal_items:        (n) => `Subtotal (${n} items)`,
    discount_label:        'Discount (10%)',
    total_label:           'Total',
    discount_badge:        '10% DISCOUNT APPLIED',
    save_gift_set:         'SAVE GIFT SET',
    gift_set_saved_note:   'Saved gift sets can be viewed in your account',
    add_btn:               'ADD',

    // Toast messages
    toast_added_bag:     'Added to bag',
    toast_added_wishlist:'Added to wishlist',
    toast_removed_wishlist:'Removed from wishlist',
    toast_gift_saved:    'Gift set saved!',
  },

  MK: {
    // Header / Nav
    menu:            'МЕНИ',
    tagline:         'Лична достава низ цела Македонија ',
    search_ph:       'Пребарај производи...',
    no_results:      'Нема резултати за',
    clear_search:    'Исчисти пребарување',

    // Category tab labels (broad)
    cat_all:         'Сите производи',
    cat_bestsellers: 'Најпродавани',
    cat_Perfume:     'ПАРФЕМИ',
    cat_Home_Scent:  'ДОМАШНИ АРОМИ',
    cat_Body:        'ТЕЛО',
    cat_Hands:       'РАЦЕ',
    cat_Hair:        'КОСА',
    cat_Self_Care:   'НЕГА',
    // Category tab labels (specific product types)
    cat_Hand_Cream:        'КРЕМ ЗА РАЦЕ',
    cat_Body_Cream:        'КРЕМ ЗА ТЕЛО',
    cat_Diffuser:          'ДИФУЗЕРИ',
    cat_Shower_Gel:        'ГЕЛ ЗА ТУШ',
    cat_Body_Scrub:        'ПИЛИНГ',
    cat_Body_Oil:          'МАСЛО ЗА ТЕЛО',
    cat_Body_Butter:       'ПУТЕР ЗА ТЕЛО',
    cat_Candle:            'СВЕЌИ',
    cat_Liquid_Soap:       'ТЕЧЕН САПУН',
    cat_Soap:              'САПУН',
    cat_Dead_Sea_Salt:     'СОЛ ОД МРТВО МОРЕ',
    cat_Shampoo:           'ШАМПОН',
    cat_Hair_Conditioner:  'БАЛСАМ',
    cat_Keratin_Hair_Mask: 'КЕРАТИНСКА МАСКА',
    // Legacy keys (kept for compat)
    cat_Hand_cream: 'КРЕМ ЗА РАЦЕ', cat_Body_cream: 'КРЕМ ЗА ТЕЛО',
    cat_Shower_gel: 'ГЕЛ ЗА ТУШ', cat_Body_scrub: 'ПИЛИНГ',
    cat_Body_oil: 'МАСЛО ЗА ТЕЛО', cat_Liquid_soap: 'ТЕЧЕН САПУН',
    cat_Solid_soap: 'САПУН', cat_Hair_conditioner: 'БАЛСАМ',
    cat_Keratin_hair_mask: 'КЕРАТИНСКА МАСКА', cat_Dead_sea_salt: 'СОЛ ОД МРТВО МОРЕ',
    cat_Giftbox: 'ПОДАРОК СЕТ',

    // Section view
    see_all:         'Сите',
    best_sellers_title: 'НАЈПРОДАВАНИ',

    // Banners
    bestsellers_count:  (n) => `${n} НАЈПРОДАВАНИ ПРОИЗВОДИ`,
    free_delivery_banner: (threshold) => `БЕСПЛАТНА ДОСТАВА НАД ${threshold}`,

    // Product card / modal
    add_to_bag:      'ДОДАЈ ВО КОШНИЧКА',
    out_of_stock:    'НЕМА НА ЗАЛИХА',
    only_left:       (n) => `САМО ${n} ОСТАНУВААТ`,
    back:            'НАЗАД',
    swipe_browse:    'ЛИЗГАЈ ЗА ПРЕЛИСТУВАЊЕ',
    add_to_cart:     'ДОДАЈ ВО КОШНИЧКА',
    add_wishlist:    'Додај во листа на желби',
    remove_wishlist: 'Отстрани од листа на желби',

    // Bottom nav
    shop:     'ПРОДАВНИЦА',
    wishlist: 'ЖЕЛБИ',
    bundle:   'ПОДАРОК',
    orders:   'НАРАЧКИ',
    bag:      'КОШНИЧКА',

    // Footer
    free_delivery_footer: (cur) => cur === 'EUR' ? '€150' : '9.230 ден',
    contact: 'КОНТАКТ',

    // Cart drawer
    shopping_bag:   (n) => `КОШНИЧКА (${n})`,
    bag_empty:      'ВАШАТА КОШНИЧКА Е ПРАЗНА',
    away_free:      (amt) => `${amt} до бесплатна достава`,
    free_unlocked:  '✓ Бесплатна достава одблокирана',
    subtotal:       'МЕЃУЗБИР',
    delivery:       'ДОСТАВА (СПОРЕД ТАРИФАТА НА КАРГО ЕКСПРЕС',
    free:           'БЕСПЛАТНО',
    total:          'ВКУПНО',
    checkout:       'НАРАЧАЈ',
    secure_payment: 'БЕЗБЕДНО ОНЛАЈН ПЛАЌАЊЕ',

    // Filter panel
    filters:        'ФИЛТРИ',
    clear_all:      'Исчисти',
    collections:    'Колекции',
    bestsellers_filter: 'Најпродавани',
    new_arrivals:   'Новитети',
    in_stock_only:  'Само на залиха',
    price_range:    'Ценовен опсег',
    shop_by:        'Прелистај по',
    browse_by:      'Прелистај по категорија',
    active_filters: 'Активни филтри',
    in_stock_badge: 'На залиха',

    // Collection group labels (filter panel)
    col_perfume:    'Парфем',
    col_home_scent: 'Домашни ароми',
    col_body:       'Тело',
    col_hands:      'Раце',
    col_self_care:  'Нега',
    col_hair:       'Коса',
    col_travel:     'Патнички пакувања',

    // Checkout form
    delivery_details:  'ДЕТАЛИ ЗА ДОСТАВА',
    delivery_method:   'НАЧИН НА ДОСТАВА *',
    delivery_label:    'ДОСТАВА',
    delivery_sub:      'На вашата адреса',
    pickup_label:      'ПРЕЗЕМАЊЕ',
    pickup_sub:        'Преземи од продавница',
    pickup_location:   'МЕСТО ЗА ПРЕЗЕМАЊЕ',
    budapest_store:    'Продавница Скопје',
    pickup_note:       'Ќе ве контактираме кога ќе биде готово',
    pickup_date:       'ДАТУМ НА ПРЕЗЕМАЊЕ *',
    delivery_date:     'ДАТУМ НА ДОСТАВА *',
    select_date:       'Изберете датум',
    full_name:         'ЦЕЛОСНО ИМЕ *',
    phone:             'ТЕЛЕФОН *',
    email:             'ЕMAIL',
    notes_opt:         'ЛИЧНА ПОРАКА (ОПЦИОНАЛНО)',
    notes_ph:          'пр. Подарочно пакување, картичка, специјална презентација…',
    delivery_address:  'АДРЕСА ЗА ДОСТАВА *',
    city:              'ГРАД *',
    postal_code:       'ПОШТЕНСКИ БРОЈ *',
    items_count:       (n) => `МЕЃУЗБИР (${n} ПРОИЗВОДИ)`,
    preparing_payment: 'ПОДГОТВУВАЊЕ ПЛАЌАЊЕ…',
    pay_revolut:       'ПЛАТИ СО REVOLUT',
    secure_revolut:    'БЕЗБЕДНО ПЛАЌАЊЕ ПРЕКУ REVOLUT PAY',
    revolut_opening:   'REVOLUT PAY СЕ ОТВАРА…',
    complete_popup:    'Завршете го плаќањето во Revolut прозорецот.',
    back_to_order:     '← Назад кон деталите за нарачката',
    thank_you:         'БЛАГОДАРИМЕ',
    order_confirmed:   'НАРАЧКАТА Е ПОТВРДЕНА',
    payment_received:  'Плаќањето е примено. Ќе ве контактираме за потврда на доставата.',
    continue_shopping: 'ПРОДОЛЖИ СО КУПУВАЊЕ',

    // Wishlist page
    back_to_shop:    'НАЗАД ВО ПРОДАВНИЦАТА',
    my_wishlist:     'МОЈ СПИСОК НА ЖЕЛБИ',
    saved_items:     (n) => `${n} ЗАЧУВАНИ ПРОИЗВОДИ`,
    loading:         'ВЧИТУВАЊЕ...',
    wishlist_empty:  'ВАШИОТ СПИСОК НА ЖЕЛБИ Е ПРАЗЕН',
    wishlist_hint:   'Зачувајте ги омилените производи за подоцна',
    view_in_shop:    'ПРИКАЖИ ВО ПРОДАВНИЦАТА',

    // Orders page
    my_orders:       'МОИ НАРАЧКИ',
    orders_count:    (n) => `${n} НАРАЧКИ`,
    order_number:    'БРОЈ НА НАРАЧКА',
    items_label:     'ПРОИЗВОДИ',
    quantity:        (n) => `Количина: ${n}`,
    delivery_addr:   'АДРЕСА ЗА ДОСТАВА',
    notes_label:     'БЕЛЕШКИ',
    no_orders:       'НЕМАТЕ НАРАЧКИ',
    no_orders_hint:  'Почнете со купување за да ги видите нарачките',
    start_shopping:  'ПОЧНИ СО КУПУВАЊЕ',
    status_pending:   { label: 'Нарачката е примена',  desc: 'Вашата нарачка е примена и се обработува' },
    status_confirmed: { label: 'Потврдена',            desc: 'Вашата нарачка е потврдена' },
    status_preparing: { label: 'Се подготвува',        desc: 'Внимателно ја подготвуваме вашата нарачка' },
    status_shipped:   { label: 'Испратена',            desc: 'Вашата нарачка е на пат кај вас' },
    status_delivered: { label: 'Доставена',            desc: 'Вашата нарачка е доставена' },
    status_cancelled: { label: 'Откажана',             desc: 'Оваа нарачка е откажана' },

    // Bundle builder
    back_to_shop_link:     'НАЗАД ВО ПРОДАВНИЦАТА',
    create_gift:           'СОЗДАЈ ПОДАРОК',
    build_collection:      'ИЗГРАДИ ПРИЛАГОДЕНА ПОДАРОК КУТИЈА',
    search_products_ph:    'Пребарај производи...',
    your_gift_set:         'ВАШИОТ ПОДАРОК',
    gift_set_name_ph:      'Назив на подарокот (пр. За мама)',
    start_adding:          'Почнете да додавате производи',
    subtotal_items:        (n) => `Меѓузбир (${n} производи)`,
    discount_label:        'Попуст (10%)',
    total_label:           'Вкупно',
    discount_badge:        '10% ПОПУСТ ПРИМЕНЕТ',
    save_gift_set:         'ЗАЧУВАЈ ПОДАРОК',
    gift_set_saved_note:   'Зачуваните подароци можете да ги видите во вашиот профил',
    add_btn:               'ДОДАЈ',

    // Toast messages
    toast_added_bag:      'Додадено во кошничка',
    toast_added_wishlist: 'Додадено во листа на желби',
    toast_removed_wishlist:'Отстрането од листа на желби',
    toast_gift_saved:     'Подарокот е зачуван!',
  },
}

// ─── Context ─────────────────────────────────────────────────────────────────
const LanguageContext = createContext({ lang: 'EN', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('zr_lang')
      // If saved lang is HU or RU from a previous session, fall back to EN
      return (saved === 'EN' || saved === 'MK') ? saved : 'EN'
    } catch { return 'EN' }
  })
  useEffect(() => { localStorage.setItem('zr_lang', lang) }, [lang])
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ─── Hooks ───────────────────────────────────────────────────────────────────
export function useLanguage() {
  return useContext(LanguageContext)
}

// t(key) — returns string or calls function with args
export function useT() {
  const { lang } = useLanguage()
  return (key, ...args) => {
    const val = translations[lang]?.[key] ?? translations['EN'][key] ?? key
    return typeof val === 'function' ? val(...args) : val
  }
}

// Helper: get translated category label from its value string
export function useCatLabel() {
  const t = useT()
  return (value) => {
    const key = 'cat_' + value.replace(/ /g, '_')
    const result = t(key)
    // If key not found, t() returns the key itself — fall back to the value
    return result === key ? value.toUpperCase() : result
  }
}
