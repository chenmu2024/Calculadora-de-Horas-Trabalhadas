import AboutUsPage from './AboutUsPage';
import ContactPage from './ContactPage';
import TermsPage from './TermsPage';
import PrivacyPage from './PrivacyPage';
import BlogSection from './BlogSection';
import SEOContent from './SEOContent';
import FAQSection from './FAQSection';
import CalculationReference from './CalculationReference';
import { TOOL_ANSWERS } from '../utils/editorial';

export default function StaticPageContent({ tab, articleId }: { tab: string; articleId?: string }) {
  if (tab === 'about') return <AboutUsPage onSelectCalculator={() => {}} />;
  if (tab === 'contact') return <ContactPage />;
  if (tab === 'terms') return <TermsPage />;
  if (tab === 'privacy') return <PrivacyPage />;
  if (tab === 'blog') return <BlogSection initialArticleId={articleId} onSelectCalculator={() => {}} />;
  if (tab === 'not-found') return <p>A página não existe. <a href="/">Voltar ao início</a></p>;
  return <><CalculationReference activeTab={tab} /><SEOContent activeTab={tab} />{TOOL_ANSWERS[tab] && <FAQSection activeTab={tab} />}</>;
}
