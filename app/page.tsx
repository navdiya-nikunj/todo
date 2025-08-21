"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/contexts/auth-context"
import { 
  Sword, 
  Zap, 
  Shield, 
  Trophy, 
  Star, 
  Target, 
  Users, 
  Crown,
  Flame,
  Snowflake,
  Leaf,
  Moon,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Heart,
  Link
} from "lucide-react"
import Image from "next/image"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"

export default function HomePage() {
  const router = useRouter()
  const { state } = useAuth()

  const primaryCtaLabel = state.isAuthenticated ? "Go to Dashboard" : "Enter the Realm"
  const primaryCtaHref = state.isAuthenticated ? "/dashboard" : "/login"

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-realm-neon-blue rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-realm-neon-blue/20 to-realm-neon-blue/5 border border-realm-neon-blue/30 flex items-center justify-center">
              <Sword className="w-5 h-5 text-realm-neon-blue" />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-realm-neon-blue">RealmQuest</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/docs")}
              className="border-realm-neon-blue/30 text-realm-neon-blue hover:bg-realm-neon-blue/10 hidden sm:inline-flex"
            >
              Guide
            </Button>
            <Button
              onClick={() => router.push(primaryCtaHref)}
              className="realm-button text-realm-neon-blue"
            >
              {primaryCtaLabel}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-realm-neon-blue/20 to-realm-neon-blue/10 border border-realm-neon-blue/30">
                <Zap className="w-4 h-4 text-realm-neon-blue" />
                <span className="text-realm-neon-blue font-semibold text-sm">Gamified Productivity</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-realm-silver leading-tight">
                Transform Tasks Into
                <span className="text-realm-neon-blue block">Epic Adventures</span>
              </h1>
              
              <p className="text-realm-silver/70 text-lg sm:text-xl leading-relaxed">
                Build themed realms, defeat task enemies, earn XP, unlock achievements, and level up your productivity like never before.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push(primaryCtaHref)}
                  size="lg"
                  className="realm-button text-realm-neon-blue text-lg px-8 py-4"
                >
                  <Sword className="w-5 h-5 mr-2" />
                  {primaryCtaLabel}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/docs")}
                  className="border-realm-neon-blue/30 text-realm-neon-blue hover:bg-realm-neon-blue/10 px-8 py-4"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Hunter's Guide
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-realm-silver/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Free to play</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-realm-neon-blue rounded-full animate-pulse"></div>
                  <span>No downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Instant start</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Hero Image Placeholder */}
              <div className="relative">

              <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
       
        <CardItem
          translateZ="50"
          rotateX={0}
          rotateZ={0}
          className="w-full mt-4"
        >
          <Image
            src="/hero.png"
            height="1000"
            width="1000"
            className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        
      </CardBody>
    </CardContainer>
                
                {/* Floating Elements */}
                <div className="absolute top-10 -right-4 realm-panel p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-realm-silver font-bold">+50 XP</span>
                  </div>
                </div>
                <div className="absolute bottom-10 -left-4 realm-panel p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-realm-neon-blue" />
                    <span className="text-realm-silver font-bold">Quest Complete!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-realm-silver mb-4">
              Why Hunters Choose RealmQuest
            </h2>
            <p className="text-realm-silver/70 text-lg max-w-2xl mx-auto">
              Transform your productivity with game mechanics that make completing tasks addictive and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sword,
                title: "Themed Realms",
                description: "Create fire, ice, nature, electric, or shadow realms. Each with unique bonuses and atmosphere.",
                color: "text-red-400"
              },
              {
                icon: Target,
                title: "Task Enemies",
                description: "Transform boring tasks into enemies to defeat. Earn XP and feel the satisfaction of victory.",
                color: "text-realm-neon-blue"
              },
              {
                icon: Trophy,
                title: "Achievements & Badges",
                description: "Unlock prestigious badges like Dungeon Master, Streak King, and Elite Hunter through your efforts.",
                color: "text-yellow-400"
              },
              {
                icon: Flame,
                title: "Streak System",
                description: "Build momentum with daily streaks. Keep the fire alive and watch your multipliers grow.",
                color: "text-orange-400"
              },
              {
                icon: Crown,
                title: "Level Progression",
                description: "Gain XP and level up your hunter. Unlock new avatars and abilities as you grow stronger.",
                color: "text-purple-400"
              },
              {
                icon: Users,
                title: "Hunter Avatars",
                description: "Customize your appearance with unlockable avatars from starter warriors to legendary shadow lords.",
                color: "text-green-400"
              }
            ].map((feature, index) => (
              <Card key={index} className="realm-panel p-6 hover:realm-glow transition-all duration-300">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/5 border border-${feature.color}/30 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-realm-silver mb-2">{feature.title}</h3>
                <p className="text-realm-silver/70">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Realm Themes Showcase */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-realm-silver mb-4">
              Choose Your Realm Theme
            </h2>
            <p className="text-realm-silver/70 text-lg max-w-2xl mx-auto">
              Each realm offers unique bonuses and creates an immersive atmosphere for your productivity journey.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Flame, name: "Fire Realm", color: "from-red-500/20 to-orange-500/20", border: "border-red-400/30", text: "text-red-400" },
              { icon: Snowflake, name: "Ice Realm", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-400/30", text: "text-blue-400" },
              { icon: Leaf, name: "Nature Realm", color: "from-green-500/20 to-emerald-500/20", border: "border-green-400/30", text: "text-green-400" },
              { icon: Zap, name: "Electric Realm", color: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-400/30", text: "text-yellow-400" },
              { icon: Moon, name: "Shadow Realm", color: "from-purple-500/20 to-violet-500/20", border: "border-purple-400/30", text: "text-purple-400" }
            ].map((theme, index) => (
              <Card key={index} className={`realm-panel hover:realm-glow transition-all duration-300 cursor-pointer ${theme.border}`}>
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${theme.color} ${theme.border} flex items-center justify-center mb-4`}>
                    <theme.icon className={`w-8 h-8 ${theme.text}`} />
                  </div>
                  <h3 className={`font-bold ${theme.text}`}>{theme.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="realm-panel p-8 sm:p-12 rounded-2xl">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-realm-silver mb-4">
              Ready to Begin Your Quest?
            </h2>
            <p className="text-realm-silver/70 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of hunters who have transformed their productivity. Create your first realm and start earning XP today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push(primaryCtaHref)}
                size="lg"
                className="realm-button text-realm-neon-blue text-lg px-8 py-4"
              >
                <Sword className="w-5 h-5 mr-2" />
                {primaryCtaLabel}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/docs")}
                className="border-realm-neon-blue/30 text-realm-neon-blue hover:bg-realm-neon-blue/10 px-8 py-4"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-12 border-t border-realm-neon-blue/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-realm-neon-blue/20 to-realm-neon-blue/5 border border-realm-neon-blue/30 flex items-center justify-center">
                  <Sword className="w-4 h-4 text-realm-neon-blue" />
                </div>
                <h3 className="text-lg font-serif font-bold text-realm-neon-blue">RealmQuest</h3>
              </div>
              <p className="text-realm-silver/60 text-sm">
                Gamify your productivity and transform tasks into epic adventures. Level up your life, one quest at a time.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-realm-silver mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-realm-silver/60">
                <li><a href="/docs" className="hover:text-realm-neon-blue transition-colors">Features</a></li>
                <li><a href="/docs" className="hover:text-realm-neon-blue transition-colors">How it Works</a></li>
                <li><a href="/realms" className="hover:text-realm-neon-blue transition-colors">Realms</a></li>
                <li><a href="/avatar" className="hover:text-realm-neon-blue transition-colors">Avatars</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-realm-silver mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-realm-silver/60">
                <li><a href="/docs" className="hover:text-realm-neon-blue transition-colors">Hunter's Guide</a></li>
                <li><a href="/docs" className="hover:text-realm-neon-blue transition-colors">Game Rules</a></li>
                <li><a href="/docs" className="hover:text-realm-neon-blue transition-colors">Badge System</a></li>
                <li><a href="/docs" className="hover:text-realm-neon-blue transition-colors">XP & Levels</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-realm-silver mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="https://github.com/navdiya-nikunj" className="w-8 h-8 rounded-full bg-realm-neon-blue/10 border border-realm-neon-blue/30 flex items-center justify-center hover:bg-realm-neon-blue/20 transition-colors">
                  <Github className="w-4 h-4 text-realm-neon-blue" />
                </a>
                <a href="https://x.com/navdiya_nikunj" className="w-8 h-8 rounded-full bg-realm-neon-blue/10 border border-realm-neon-blue/30 flex items-center justify-center hover:bg-realm-neon-blue/20 transition-colors">
                  <Twitter className="w-4 h-4 text-realm-neon-blue" />
                </a>
                <a href="https://onchainik.me" className="w-8 h-8 rounded-full bg-realm-neon-blue/10 border border-realm-neon-blue/30 flex items-center justify-center hover:bg-realm-neon-blue/20 transition-colors">
                  <Link className="w-4 h-4 text-realm-neon-blue" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-realm-neon-blue/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-realm-silver/60 text-sm">
              © 2024 RealmQuest. Built with <Heart className="w-4 h-4 inline text-red-400" /> for productivity hunters.
            </p>
            
          </div>
        </div>
      </footer>
    </div>
  )
}
