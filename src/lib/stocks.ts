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
};

export const stocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple', price: 214.4, change: 1.8, sector: 'Технологии', business: 'Продаёт устройства и цифровые сервисы.', strength: 'Сильный бренд и экосистема продуктов.', risk: 'Высокая зависимость от продаж iPhone.', competitors: 'Samsung, Google, Microsoft' },
  { symbol: 'NVDA', name: 'Nvidia', price: 173.2, change: 2.4, sector: 'Полупроводники', business: 'Разрабатывает чипы для AI, игр и дата-центров.', strength: 'Лидерство в ускорителях для искусственного интеллекта.', risk: 'Высокие ожидания и сильная конкуренция.', competitors: 'AMD, Intel, Google' },
  { symbol: 'MSFT', name: 'Microsoft', price: 512.6, change: 0.7, sector: 'Технологии', business: 'Создаёт программы, облачные сервисы и AI-продукты.', strength: 'Много разных источников дохода.', risk: 'Регулирование и дорогая инфраструктура AI.', competitors: 'Google, Amazon, Apple' },
  { symbol: 'AMZN', name: 'Amazon', price: 231.9, change: -0.6, sector: 'Торговля и облака', business: 'Интернет-магазин, логистика и облачная платформа AWS.', strength: 'Масштаб и лидерство в облачных сервисах.', risk: 'Низкая маржа торговли и давление регуляторов.', competitors: 'Walmart, Microsoft, Google' },
  { symbol: 'TSLA', name: 'Tesla', price: 319.7, change: -1.3, sector: 'Автомобили', business: 'Производит электромобили и системы хранения энергии.', strength: 'Узнаваемый бренд и технологии производства.', risk: 'Сильная конкуренция и нестабильный спрос.', competitors: 'BYD, Toyota, Volkswagen' },
  { symbol: 'GOOGL', name: 'Google', price: 194.5, change: 1.1, sector: 'Интернет', business: 'Зарабатывает на рекламе, облаках, YouTube и сервисах.', strength: 'Огромная аудитория и сильные AI-разработки.', risk: 'Зависимость от рекламы и антимонопольные дела.', competitors: 'Microsoft, Meta, Amazon' },
  { symbol: 'DIS', name: 'Disney', price: 121.3, change: 0.4, sector: 'Развлечения', business: 'Создаёт фильмы, стриминг и управляет парками.', strength: 'Известные истории, герои и бренды.', risk: 'Дорогой контент и конкуренция стримингов.', competitors: 'Netflix, Comcast, Warner Bros.' },
  { symbol: 'KO', name: 'Coca-Cola', price: 70.8, change: -0.2, sector: 'Напитки', business: 'Производит и продаёт напитки по всему миру.', strength: 'Глобальная дистрибуция и узнаваемость.', risk: 'Изменение вкусов и налоги на сладкие напитки.', competitors: 'PepsiCo, Keurig Dr Pepper' },
  { symbol: 'KSPI', name: 'Kaspi.kz', price: 82.6, change: 1.5, sector: 'Финтех', business: 'Объединяет платежи, маркетплейс и финансовые услуги.', strength: 'Популярная суперприложение-экосистема.', risk: 'Зависимость от отдельных рынков и регулирования.', competitors: 'Halyk, Freedom, местные маркетплейсы' },
];

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
