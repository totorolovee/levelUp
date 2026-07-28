import { Route, Switch, useLocation } from 'wouter';
import { PortfolioProvider } from './lib/portfolio';
import { ReadingProvider } from './lib/reading';
import { GoalsProvider } from './lib/goals';
import { ThemeProvider } from './lib/theme';
import { LanguageProvider } from './lib/language';
import { CoachPage } from './pages/CoachPage';
import { HomePage } from './pages/HomePage';
import { GoalsPage } from './pages/GoalsPage';
import { InvestingPage } from './pages/InvestingPage';
import { JournalPage } from './pages/JournalPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReadingPage } from './pages/ReadingPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { LeaguesPage } from './pages/LeaguesPage';

// Здесь живут только маршруты. Сами экраны складывай в src/pages/.
export default function App() {
  const [location] = useLocation();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <PortfolioProvider>
          <ReadingProvider>
            <GoalsProvider>
              <div className="page-transition" key={location}>
                <Switch>
                  <Route path="/" component={HomePage} />
                  <Route path="/goals" component={GoalsPage} />
                  <Route path="/universities" component={UniversitiesPage} />
                  <Route path="/reading" component={ReadingPage} />
                  <Route path="/investing" component={InvestingPage} />
                  <Route path="/journal" component={JournalPage} />
                  <Route path="/coach" component={CoachPage} />
                  <Route path="/leagues" component={LeaguesPage} />
                  <Route path="/login" component={LoginPage} />
                  <Route path="/profile" component={ProfilePage} />
                  <Route component={NotFoundPage} />
                </Switch>
              </div>
            </GoalsProvider>
          </ReadingProvider>
        </PortfolioProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
