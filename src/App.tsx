/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavTab, MoodType } from './types';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { MoodTrackerPage } from './components/MoodTrackerPage';
import { JournalPage } from './components/JournalPage';
import { SelfCarePage } from './components/SelfCarePage';
import { CrisisModal } from './components/CrisisModal';
import { BreathingModal } from './components/BreathingModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [chatMoodContext, setChatMoodContext] = useState<MoodType | null>(null);
  const [journalDraft, setJournalDraft] = useState<{
    content: string;
    mood: MoodType;
  } | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState<boolean>(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);

  // Transitions
  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickChatWithMood = (mood: MoodType) => {
    setChatMoodContext(mood);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveToJournalDraft = (content: string, mood?: MoodType) => {
    setJournalDraft({
      content,
      mood: mood || 'Calm',
    });
    setActiveTab('journal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C2825] selection:bg-[#F28D77]/20 selection:text-[#E07A5F]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        onQuickBreath={() => setIsBreathingModalOpen(true)}
      />

      {/* Main Sanctuary Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onSelectTab={handleSelectTab}
            onQuickChatWithMood={handleQuickChatWithMood}
            onStartBreathing={() => setIsBreathingModalOpen(true)}
          />
        )}

        {activeTab === 'chat' && (
          <ChatPage
            initialMood={chatMoodContext}
            onSaveToJournalDraft={handleSaveToJournalDraft}
            onOpenBreathingModal={() => setIsBreathingModalOpen(true)}
          />
        )}

        {activeTab === 'mood' && (
          <MoodTrackerPage onTalkAboutMood={handleQuickChatWithMood} />
        )}

        {activeTab === 'journal' && (
          <JournalPage
            draftContent={journalDraft?.content}
            draftMood={journalDraft?.mood}
            onClearDraft={() => setJournalDraft(null)}
          />
        )}

        {activeTab === 'selfcare' && <SelfCarePage />}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
      />

      {/* Quick Calming Breath Modal */}
      <BreathingModal
        isOpen={isBreathingModalOpen}
        onClose={() => setIsBreathingModalOpen(false)}
      />

      {/* 24/7 Crisis Lifeline Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </div>
  );
}
