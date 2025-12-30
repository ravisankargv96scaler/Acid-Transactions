import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TabNavigation } from './components/TabNavigation';
import { ConceptTab } from './components/ConceptTab';
import { AtomicityTab } from './components/AtomicityTab';
import { ConsistencyTab } from './components/ConsistencyTab';
import { IsolationTab } from './components/IsolationTab';
import { DurabilityTab } from './components/DurabilityTab';
import { QuizTab } from './components/QuizTab';
import { TabId } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.CONCEPT);

  const renderContent = () => {
    switch (activeTab) {
      case TabId.CONCEPT: return <ConceptTab />;
      case TabId.ATOMICITY: return <AtomicityTab />;
      case TabId.CONSISTENCY: return <ConsistencyTab />;
      case TabId.ISOLATION: return <IsolationTab />;
      case TabId.DURABILITY: return <DurabilityTab />;
      case TabId.QUIZ: return <QuizTab />;
      default: return <ConceptTab />;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default App;