import { Route, Switch, useLocation } from 'wouter';
import { PortfolioProvider } from './lib/portfolio';
import { ReadingProvider } from './lib/reading';
import { GoalsProvider } from './lib/goals';
import { HomePage } from './pages/HomePage';
import { GoalsPage } from './pages/GoalsPage';
import { InvestingPage } from './pages/InvestingPage';
import { JournalPage } from './pages/JournalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ReadingPage } from './pages/ReadingPage';

// Здесь живут только маршруты. Сами экраны складывай в src/pages/.
export default function App() {
  const [location] = useLocation();

  return (
    <PortfolioProvider>
      <ReadingProvider>
        <GoalsProvider>
          <div className="page-transition" key={location}>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/goals" component={GoalsPage} />
              <Route path="/reading" component={ReadingPage} />
              <Route path="/investing" component={InvestingPage} />
              <Route path="/journal" component={JournalPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </GoalsProvider>
      </ReadingProvider>
    </PortfolioProvider>
  );
}
