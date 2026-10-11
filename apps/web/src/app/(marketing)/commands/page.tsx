'use client';

import { Shield, Music, Sparkles, Users, Zap, MessageSquare, Trophy, Gift, Terminal, Bot, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const commandCategories = [
  {
    id: 'moderation',
    name: 'Moderation',
    icon: Shield,
    commands: [
      { name: '/ban', description: 'Ban a user from the server', usage: '/ban @user [reason]' },
      { name: '/kick', description: 'Kick a user from the server', usage: '/kick @user [reason]' },
      { name: '/mute', description: 'Mute a user temporarily', usage: '/mute @user [duration]' },
      { name: '/warn', description: 'Warn a user', usage: '/warn @user [reason]' },
      { name: '/warnings', description: 'View warnings for a user', usage: '/warnings @user' },
      { name: '/clear', description: 'Clear messages in bulk', usage: '/clear [amount]' },
    ]
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    commands: [
      { name: '/play', description: 'Play a song from YouTube or Spotify', usage: '/play [song]' },
      { name: '/pause', description: 'Pause the current song', usage: '/pause' },
      { name: '/resume', description: 'Resume playback', usage: '/resume' },
      { name: '/skip', description: 'Skip to the next song', usage: '/skip' },
      { name: '/stop', description: 'Stop playback and clear queue', usage: '/stop' },
      { name: '/queue', description: 'View the current queue', usage: '/queue' },
      { name: '/volume', description: 'Adjust the volume', usage: '/volume [0-100]' },
    ]
  },
  {
    id: 'leveling',
    name: 'Leveling',
    icon: Trophy,
    commands: [
      { name: '/rank', description: 'View your level and XP', usage: '/rank [@user]' },
      { name: '/leaderboard', description: 'View top users by XP', usage: '/leaderboard' },
      { name: '/achievements', description: 'View achievement badges', usage: '/achievements' },
    ]
  },
  {
    id: 'fun',
    name: 'Fun',
    icon: Gift,
    commands: [
      { name: '/giveaway', description: 'Create a giveaway', usage: '/giveaway [prize]' },
      { name: '/poll', description: 'Create a poll', usage: '/poll [question]' },
    ]
  },
  {
    id: 'ai',
    name: 'AI',
    icon: Sparkles,
    commands: [
      { name: '/ask', description: 'Ask the AI a question', usage: '/ask [question]' },
      { name: '/setup', description: 'AI-powered setup', usage: '/setup' },
    ]
  },
  {
    id: 'utility',
    name: 'Utility',
    icon: MessageSquare,
    commands: [
      { name: '/serverinfo', description: 'View server information', usage: '/serverinfo' },
      { name: '/userinfo', description: 'View user information', usage: '/userinfo [@user]' },
      { name: '/ticket', description: 'Manage support tickets', usage: '/ticket' },
      { name: '/verification', description: 'Setup verification', usage: '/verification' },
    ]
  },
];

export default function CommandsPage() {
  const [selectedCategory, setSelectedCategory] = useState('moderation');

  const currentCategory = commandCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Header - Kompakt */}
      <section className="py-32 px-6 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6 animate-fade-in">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">All Commands</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              24 powerful commands
            </span>
            <br />
            at your fingertips
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
            Everything you need to manage your Discord server.
          </p>
        </div>
      </section>

      {/* Command Browser */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Category Pills - Kompakt */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {commandCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Commands Grid - Kompakt */}
          <div className="grid md:grid-cols-2 gap-4">
            {currentCategory?.commands.map((command, index) => (
              <div 
                key={index}
                className="p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group card-glow"
              >
                <div className="flex items-start justify-between mb-3">
                  <code className="text-base font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {command.name}
                  </code>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {command.description}
                </p>
                
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-gray-400 font-medium">Usage:</span>
                  <code className="text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    {command.usage}
                  </code>
                </div>
              </div>
            ))}
          </div>

          {/* Command Count */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-blue-600">{currentCategory?.commands.length}</span> commands in {currentCategory?.name}
            </p>
          </div>

        </div>
      </section>

      {/* Features Highlight - Kompakt */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Why our commands
              <span className="text-gray-400"> are better</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-glow group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Zap className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">
                Instant responses, no lag.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-glow group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold mb-2">Easy to Use</h3>
              <p className="text-sm text-gray-600">
                Slash commands with auto-complete.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-glow group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold mb-2">Always Growing</h3>
              <p className="text-sm text-gray-600">
                New commands added regularly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA - Kompakt */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
            Ready to try them?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 animate-fade-in-delay">
            Add Layer and start using powerful commands today.
          </p>

          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/25 animate-bounce-in"
          >
            <Bot className="w-5 h-5" />
            Add to Discord
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-sm text-gray-500 mt-6 animate-fade-in-delay-2">
            Free forever • 5-minute setup
          </p>
        </div>
      </section>

    </div>
  );
}
