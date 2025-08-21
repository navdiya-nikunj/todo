"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sword, Shield, Zap, Trophy, Star, Target, Users, Crown } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen ">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10">

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 mb-6">
              <Sword className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Complete Hunter's Manual</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Welcome to RealmQuest
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Transform your productivity into an epic adventure. Complete tasks, earn XP, level up, and become the
              ultimate hunter.
            </p>
          </div>

          {/* Quick Start */}
          <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-400/30 mb-8">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">Quick Start Guide</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-400/5 border border-green-400/20">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-green-400 mb-2">Create Realms</h3>
                  <p className="text-gray-300 text-sm">Set up your first realm and choose a theme</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-400/5 border border-green-400/20">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-green-400 mb-2">Summon Enemies</h3>
                  <p className="text-gray-300 text-sm">Add tasks as enemies to defeat</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-400/5 border border-green-400/20">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-green-400 mb-2">Earn XP & Level Up</h3>
                  <p className="text-gray-300 text-sm">Complete tasks to gain experience</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Core Systems */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* XP System */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-400/30">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-blue-400">XP System</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-400/5 border border-blue-400/20">
                    <span className="text-gray-300">Easy Tasks</span>
                    <Badge className="bg-green-400/20 text-green-400 border-green-400/30">10 XP</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-400/5 border border-blue-400/20">
                    <span className="text-gray-300">Medium Tasks</span>
                    <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">25 XP</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-400/5 border border-blue-400/20">
                    <span className="text-gray-300">Hard Tasks</span>
                    <Badge className="bg-red-400/20 text-red-400 border-red-400/30">50 XP</Badge>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-blue-400/10 border border-blue-400/30">
                    <p className="text-blue-400 text-sm font-semibold">💡 Pro Tip</p>
                    <p className="text-gray-300 text-sm">
                      Complete tasks within 10 seconds of each other for combo multipliers!
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Level System */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-400/30">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-purple-400">Level System</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-purple-400/5 border border-purple-400/20">
                    <p className="text-gray-300 text-sm mb-2">Level Calculation:</p>
                    <p className="text-purple-400 font-mono">Level = floor(XP ÷ 100) + 1</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 rounded bg-purple-400/10">
                      <p className="text-purple-400 font-semibold">Level 1</p>
                      <p className="text-gray-400 text-xs">0-99 XP</p>
                    </div>
                    <div className="text-center p-2 rounded bg-purple-400/10">
                      <p className="text-purple-400 font-semibold">Level 2</p>
                      <p className="text-gray-400 text-xs">100-199 XP</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-purple-400/10 border border-purple-400/30">
                    <p className="text-purple-400 text-sm font-semibold">🎯 Benefits</p>
                    <p className="text-gray-300 text-sm">Higher levels unlock exclusive avatars and content!</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Realms */}
          <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-400/30 mb-8">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-orange-400">Realm System</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Realms are your personal dungeons where you organize and conquer tasks. Each realm has a unique theme
                and atmosphere.
              </p>

              <div className="grid md:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-red-400/5 border border-red-400/20">
                  <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-400 text-xl">🔥</span>
                  </div>
                  <h3 className="font-semibold text-red-400 mb-1">Fire Realm</h3>
                  <p className="text-gray-400 text-xs">Blazing dungeons</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-400/5 border border-blue-400/20">
                  <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 text-xl">❄️</span>
                  </div>
                  <h3 className="font-semibold text-blue-400 mb-1">Ice Realm</h3>
                  <p className="text-gray-400 text-xs">Frozen wastelands</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-400/5 border border-green-400/20">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 text-xl">🌿</span>
                  </div>
                  <h3 className="font-semibold text-green-400 mb-1">Nature Realm</h3>
                  <p className="text-gray-400 text-xs">Verdant forests</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-400 text-xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-yellow-400 mb-1">Electric Realm</h3>
                  <p className="text-gray-400 text-xs">Stormy domains</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-400/5 border border-purple-400/20">
                  <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-400 text-xl">🌙</span>
                  </div>
                  <h3 className="font-semibold text-purple-400 mb-1">Shadow Realm</h3>
                  <p className="text-gray-400 text-xs">Dark dimensions</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-green-400/10 border border-green-400/30">
                  <Badge className="bg-green-400/20 text-green-400 border-green-400/30 mb-2">Easy</Badge>
                  <p className="text-gray-300 text-sm">Perfect for beginners</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mb-2">Medium</Badge>
                  <p className="text-gray-300 text-sm">Balanced challenge</p>
                </div>
                <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/30">
                  <Badge className="bg-red-400/20 text-red-400 border-red-400/30 mb-2">Hard</Badge>
                  <p className="text-gray-300 text-sm">For experienced hunters</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-400/10 border border-purple-400/30">
                  <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 mb-2">Legendary</Badge>
                  <p className="text-gray-300 text-sm">Ultimate challenge</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Badge System */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-400/30 mb-8">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-yellow-400">Achievement Badges</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Earn prestigious badges by completing specific challenges and unlock exclusive rewards.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-400">First Clear</h3>
                      <p className="text-gray-400 text-sm">Complete your first task</p>
                    </div>
                  </div>
                  <Badge className="bg-green-400/20 text-green-400 border-green-400/30">+20 Bonus XP</Badge>
                </div>

                <div className="p-4 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <Crown className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-400">Streak King</h3>
                      <p className="text-gray-400 text-sm">Complete 50+ tasks</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30">XP Multiplier x2</Badge>
                </div>

                <div className="p-4 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-400">Dungeon Master</h3>
                      <p className="text-gray-400 text-sm">Complete 100+ tasks</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30">Exclusive Avatar</Badge>
                </div>

                <div className="p-4 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-400">Night Watch</h3>
                      <p className="text-gray-400 text-sm">Complete tasks after 9 PM IST</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Neon Badge Skin</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Avatar System */}
          <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-400/30 mb-8">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-cyan-400">Avatar System</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Customize your hunter's appearance with avatars that reflect your achievements and progress.
              </p>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-gray-400/5 border border-gray-400/20">
                  <div className="w-12 h-12 bg-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-gray-400 text-sm font-bold">S</span>
                  </div>
                  <h3 className="font-semibold text-gray-400 mb-1">Starter</h3>
                  <p className="text-gray-500 text-xs">Available immediately</p>
                  <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30 mt-2">Common</Badge>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-400/5 border border-blue-400/20">
                  <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 text-sm font-bold">L</span>
                  </div>
                  <h3 className="font-semibold text-blue-400 mb-1">Level</h3>
                  <p className="text-gray-400 text-xs">Unlock by leveling up</p>
                  <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30 mt-2">Rare</Badge>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-400/5 border border-purple-400/20">
                  <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-400 text-sm font-bold">B</span>
                  </div>
                  <h3 className="font-semibold text-purple-400 mb-1">Badge</h3>
                  <p className="text-gray-400 text-xs">Earn through achievements</p>
                  <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 mt-2">Epic</Badge>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-400 text-sm font-bold">P</span>
                  </div>
                  <h3 className="font-semibold text-yellow-400 mb-1">Premium</h3>
                  <p className="text-gray-400 text-xs">Special exclusive avatars</p>
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mt-2">Legendary</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Game Rules */}
          <Card className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-400/30">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-red-400">Game Rules & Tips</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-4">Core Rules</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>XP is awarded only once per task completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Completed tasks cannot be edited</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Level unlocks are permanent once achieved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Badges can only be earned once</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Progress is tracked continuously</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-4">Pro Tips</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">💡</span>
                      <span>Focus on hard tasks for maximum XP gain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">💡</span>
                      <span>Complete tasks in quick succession for combos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">💡</span>
                      <span>Organize tasks by realm themes for better focus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">💡</span>
                      <span>Work towards badge requirements for exclusive rewards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">💡</span>
                      <span>Check your stats regularly to track progress</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-400 mb-2">Ready to begin your hunter journey?</p>
            <div className="flex justify-center gap-4">
              <a
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Adventure
              </a>
              <a
                href="/realms"
                className="px-6 py-3 border border-blue-400/30 text-blue-400 rounded-lg font-semibold hover:bg-blue-400/10 transition-all duration-300"
              >
                Explore Realms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
