import React from 'react';

export interface ModuleDefinition {
  id: string;
  route: string;
  title: string;
  icon: React.ComponentType<any>;
  category: 'core' | 'operations' | 'finance' | 'intelligence' | 'governance' | 'kb' | 'ai-command-center';
  archetype: 'executive' | 'pipeline' | 'grid' | 'network' | 'timeline' | 'knowledge' | 'ai';
  permissions: string[];
  component: React.ComponentType<any>;
}
