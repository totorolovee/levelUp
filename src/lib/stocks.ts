export type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  sector: string;
  business: string;
  strength: string;
  risk: string;
  competitors: string;
  exchange: string;
  quoteSymbol?: string;
  displayWithoutQuote?: boolean;
  quoteAvailable?: boolean;
};

export const stocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple', price: 214.4, change: 1.8, exchange: 'NASDAQ', sector: 'Технологии', business: 'Продаёт устройства и цифровые сервисы.', strength: 'Сильный бренд и экосистема продуктов.', risk: 'Высокая зависимость от продаж iPhone.', competitors: 'Samsung, Google, Microsoft' },
  { symbol: 'NVDA', exchange: 'NASDAQ', name: 'Nvidia', price: 173.2, change: 2.4, sector: 'Полупроводники', business: 'Разрабатывает чипы для AI, игр и дата-центров.', strength: 'Лидерство в ускорителях для искусственного интеллекта.', risk: 'Высокие ожидания и сильная конкуренция.', competitors: 'AMD, Intel, Google' },
  { symbol: 'MSFT', exchange: 'NASDAQ', name: 'Microsoft', price: 389.1, change: 1.9, sector: 'Технологии', business: 'Создаёт программы, облачные сервисы и AI-продукты.', strength: 'Много разных источников дохода.', risk: 'Регулирование и дорогая инфраструктура AI.', competitors: 'Google, Amazon, Apple' },
  { symbol: 'AMZN', exchange: 'NASDAQ', name: 'Amazon', price: 231.9, change: -0.6, sector: 'Торговля и облака', business: 'Интернет-магазин, логистика и облачная платформа AWS.', strength: 'Масштаб и лидерство в облачных сервисах.', risk: 'Низкая маржа торговли и давление регуляторов.', competitors: 'Walmart, Microsoft, Google' },
  { symbol: 'TSLA', exchange: 'NASDAQ', name: 'Tesla', price: 319.7, change: -1.3, sector: 'Автомобили', business: 'Производит электромобили и системы хранения энергии.', strength: 'Узнаваемый бренд и технологии производства.', risk: 'Сильная конкуренция и нестабильный спрос.', competitors: 'BYD, Toyota, Volkswagen' },
  { symbol: 'GOOGL', exchange: 'NASDAQ', name: 'Google', price: 194.5, change: 1.1, sector: 'Интернет', business: 'Зарабатывает на рекламе, облаках, YouTube и сервисах.', strength: 'Огромная аудитория и сильные AI-разработки.', risk: 'Зависимость от рекламы и антимонопольные дела.', competitors: 'Microsoft, Meta, Amazon' },
  { symbol: 'DIS', exchange: 'NYSE', name: 'Disney', price: 121.3, change: 0.4, sector: 'Развлечения', business: 'Создаёт фильмы, стриминг и управляет парками.', strength: 'Известные истории, герои и бренды.', risk: 'Дорогой контент и конкуренция стримингов.', competitors: 'Netflix, Comcast, Warner Bros.' },
  { symbol: 'KO', exchange: 'NYSE', name: 'Coca-Cola', price: 70.8, change: -0.2, sector: 'Напитки', business: 'Производит и продаёт напитки по всему миру.', strength: 'Глобальная дистрибуция и узнаваемость.', risk: 'Изменение вкусов и налоги на сладкие напитки.', competitors: 'PepsiCo, Keurig Dr Pepper' },
  { symbol: 'KSPI', exchange: 'NASDAQ', name: 'Kaspi.kz', price: 82.6, change: 1.5, sector: 'Финтех', business: 'Объединяет платежи, маркетплейс и финансовые услуги.', strength: 'Популярная суперприложение-экосистема.', risk: 'Зависимость от отдельных рынков и регулирования.', competitors: 'Halyk, Freedom, местные маркетплейсы' },
  { symbol: 'META', exchange: 'NASDAQ', name: 'Meta', price: 614.2, change: 1.3, sector: 'Социальные сети', business: 'Развивает Instagram, WhatsApp, Facebook и AI-сервисы.', strength: 'Огромная аудитория и сильный рекламный бизнес.', risk: 'Регулирование данных и зависимость от рекламы.', competitors: 'TikTok, Google, Snap' },
  { symbol: 'NFLX', exchange: 'NASDAQ', name: 'Netflix', price: 118.4, change: -0.4, sector: 'Стриминг', business: 'Создаёт и показывает фильмы, сериалы и игры по подписке.', strength: 'Глобальная аудитория и собственный контент.', risk: 'Высокая стоимость контента и конкуренция.', competitors: 'Disney, Amazon, Warner Bros.' },
  { symbol: 'AMD', exchange: 'NASDAQ', name: 'AMD', price: 176.9, change: 2.1, sector: 'Полупроводники', business: 'Разрабатывает процессоры и ускорители для компьютеров и AI.', strength: 'Сильные продукты и растущая доля рынка.', risk: 'Зависимость от производства партнёров.', competitors: 'Nvidia, Intel, Qualcomm' },
  { symbol: 'V', exchange: 'NYSE', name: 'Visa', price: 348.7, change: 0.5, sector: 'Платежи', business: 'Обрабатывает электронные платежи между банками и магазинами.', strength: 'Огромная глобальная платёжная сеть.', risk: 'Регулирование комиссий и новые способы оплаты.', competitors: 'Mastercard, PayPal, Block' },
  { symbol: 'NKE', exchange: 'NYSE', name: 'Nike', price: 78.3, change: -0.8, sector: 'Спорт', business: 'Создаёт спортивную обувь, одежду и аксессуары.', strength: 'Один из самых узнаваемых спортивных брендов.', risk: 'Смена моды и конкуренция новых брендов.', competitors: 'Adidas, Puma, Lululemon' },
  { symbol: 'MCD', exchange: 'NYSE', name: "McDonald's", price: 312.5, change: 0.3, sector: 'Рестораны', business: 'Управляет глобальной сетью ресторанов и франшиз.', strength: 'Масштаб, узнаваемость и стабильная бизнес-модель.', risk: 'Рост цен на продукты и изменение привычек клиентов.', competitors: 'Burger King, KFC, Starbucks' },
  { symbol: 'SBUX', exchange: 'NASDAQ', name: 'Starbucks', price: 96.1, change: -0.5, sector: 'Рестораны', business: 'Продаёт кофе и напитки через международную сеть кофеен.', strength: 'Сильный бренд и лояльная аудитория.', risk: 'Высокие расходы и чувствительность к ценам.', competitors: "McDonald's, Costa Coffee, местные кофейни" },
  { symbol: 'PEP', exchange: 'NASDAQ', name: 'PepsiCo', price: 145.6, change: 0.6, sector: 'Еда и напитки', business: 'Производит напитки и снеки, включая Pepsi, Lay’s и Doritos.', strength: 'Разные категории продуктов и глобальные продажи.', risk: 'Тренд на более здоровое питание.', competitors: 'Coca-Cola, Mondelez, Nestlé' },
  { symbol: 'HSBK', quoteSymbol: 'HSBK.IL', displayWithoutQuote: true, exchange: 'LSE · GDR', name: 'Halyk Bank', price: 0, change: 0, sector: 'Банки', business: 'Предоставляет банковские, платёжные и инвестиционные услуги в Казахстане.', strength: 'Крупная клиентская база и сильная позиция на рынке Казахстана.', risk: 'Зависимость от экономики, ставок и регулирования финансового сектора.', competitors: 'Kaspi.kz, Freedom Bank, ForteBank' },
];

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
