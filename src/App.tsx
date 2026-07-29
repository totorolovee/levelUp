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
import { ReflectionPage } from './pages/ReflectionPage';
import { TodosPage } from './pages/TodosPage';
import { BrainTrainingPage } from './pages/BrainTrainingPage';
import { AuthenticatedPage } from './components/AuthenticatedPage';

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
                  <Route path="/todos"><AuthenticatedPage><TodosPage /></AuthenticatedPage></Route>
                  <Route path="/goals"><AuthenticatedPage><GoalsPage /></AuthenticatedPage></Route>
                  <Route path="/universities"><AuthenticatedPage><UniversitiesPage /></AuthenticatedPage></Route>
                  <Route path="/reading"><AuthenticatedPage><ReadingPage /></AuthenticatedPage></Route>
                  <Route path="/investing"><AuthenticatedPage><InvestingPage /></AuthenticatedPage></Route>
                  <Route path="/journal"><AuthenticatedPage><JournalPage /></AuthenticatedPage></Route>
                  <Route path="/coach"><AuthenticatedPage><CoachPage /></AuthenticatedPage></Route>
                  <Route path="/leagues"><AuthenticatedPage><LeaguesPage /></AuthenticatedPage></Route>
                  <Route path="/reflection"><AuthenticatedPage><ReflectionPage /></AuthenticatedPage></Route>
                  <Route path="/training"><AuthenticatedPage><BrainTrainingPage /></AuthenticatedPage></Route>
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
