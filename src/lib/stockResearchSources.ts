import type { Stock } from './stocks';

const investorRelations: Record<string, string> = {
  AAPL: 'https://investor.apple.com/',
  NVDA: 'https://investor.nvidia.com/',
  MSFT: 'https://www.microsoft.com/en-us/Investor',
  AMZN: 'https://ir.aboutamazon.com/',
  TSLA: 'https://ir.tesla.com/',
  GOOGL: 'https://abc.xyz/investor/',
  DIS: 'https://thewaltdisneycompany.com/investor-relations/',
  KO: 'https://investors.coca-colacompany.com/',
  KSPI: 'https://ir.kaspi.kz/',
  META: 'https://investor.atmeta.com/',
  NFLX: 'https://ir.netflix.net/',
  AMD: 'https://ir.amd.com/',
  V: 'https://investor.visa.com/',
  NKE: 'https://investors.nike.com/',
  MCD: 'https://corporate.mcdonalds.com/corpmcd/investors.html',
  SBUX: 'https://investor.starbucks.com/',
  PEP: 'https://www.pepsico.com/investors',
  HSBK: 'https://halykbank.com/investors',
};

const macrotrendsSlugs: Record<string, string> = {
  AAPL: 'apple',
  NVDA: 'nvidia',
  MSFT: 'microsoft',
  AMZN: 'amazon',
  TSLA: 'tesla',
  GOOGL: 'alphabet',
  DIS: 'disney',
  KO: 'coca-cola',
  KSPI: 'joint-stock-company-kaspikz',
  META: 'meta-platforms',
  NFLX: 'netflix',
  AMD: 'amd',
  V: 'visa',
  NKE: 'nike',
  MCD: 'mcdonalds',
  SBUX: 'starbucks',
  PEP: 'pepsico',
};

function secUrl(symbol: string, form: string) {
  const params = new URLSearchParams({
    CIK: symbol,
    type: form,
    owner: 'exclude',
    count: '40',
  });
  return `https://www.sec.gov/edgar/browse/?${params.toString()}`;
}

export function getResearchSources(stock: Stock, isRussian = false) {
  const quote = stock.quoteSymbol ?? stock.symbol;
  const annualForm = stock.symbol === 'KSPI' ? '20-F' : '10-K';
  const quarterlyForm = stock.symbol === 'KSPI' ? '6-K' : '10-Q';
  const morningstarExchange = stock.exchange === 'NYSE' ? 'xnys' : 'xnas';
  const macroSlug = macrotrendsSlugs[stock.symbol];

  return {
    official: [
      { label: `${isRussian ? 'Годовой отчёт' : 'Annual Report'} (${annualForm})`, url: secUrl(stock.symbol, annualForm), source: 'SEC EDGAR' },
      { label: `${isRussian ? 'Квартальный отчёт' : 'Quarterly Report'} (${quarterlyForm})`, url: secUrl(stock.symbol, quarterlyForm), source: 'SEC EDGAR' },
      { label: isRussian ? 'Презентация для инвесторов' : 'Investor Presentation', url: investorRelations[stock.symbol], source: isRussian ? 'Отдел для инвесторов' : 'Investor Relations' },
      { label: isRussian ? 'Презентация результатов' : 'Earnings Presentation', url: investorRelations[stock.symbol], source: isRussian ? 'Отдел для инвесторов' : 'Investor Relations' },
      {
        label: isRussian ? 'Расшифровка звонка по результатам' : 'Earnings Call Transcript',
        url: `https://seekingalpha.com/symbol/${stock.symbol}/earnings/transcripts`,
        source: 'Seeking Alpha',
      },
    ].filter((item) => Boolean(item.url)),
    seekingAlpha: `https://seekingalpha.com/symbol/${stock.symbol}/analysis`,
    morningstar: `https://www.morningstar.com/stocks/${morningstarExchange}/${stock.symbol.toLowerCase()}/quote`,
    macrotrends: macroSlug
      ? `https://www.macrotrends.net/stocks/charts/${stock.symbol}/${macroSlug}/financial-statements`
      : null,
    yahoo: `https://finance.yahoo.com/quote/${quote}/`,
  };
}
