import React from 'react';
import { ScrollStoryThree } from '../components/ScrollStoryThree.js';

export const ThreejsScreen: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto min-w-0 bg-background text-on-surface">
      <ScrollStoryThree />
    </main>
  );
};
