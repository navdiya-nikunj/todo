"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sword, Shield, Zap, UserIcon, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [formData, setFormData] = useState({ email: "", password: "", name: "" })

  const handleAuth = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push("/dashboard")
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-realm-neon-blue/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-realm-neon-blue/20 to-realm-neon-blue/5 border border-realm-neon-blue/30 mb-4 animate-pulse">
            <Sword className="w-8 h-8 text-realm-neon-blue animate-bounce" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-realm-neon-blue mb-2 animate-fade-in">RealmQuest</h1>
          <p className="text-realm-silver/70 animate-fade-in-delay">
            Enter the realm, defeat your tasks, level up your life
          </p>
        </div>

        <Card className="realm-panel realm-glow transition-all duration-500 hover:scale-105 hover:realm-glow-intense">
          <div className="p-6">
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-realm-gunmetal border border-realm-neon-blue/20">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-realm-neon-blue/20 data-[state=active]:text-realm-neon-blue"
                >
                  Enter Realm
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-realm-neon-blue/20 data-[state=active]:text-realm-neon-blue"
                >
                  Create Hunter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-realm-silver flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Hunter ID (Email)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-realm-gunmetal border-realm-neon-blue/30 focus:border-realm-neon-blue text-realm-silver"
                      placeholder="Enter your hunter ID"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-realm-silver flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Access Code
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-realm-gunmetal border-realm-neon-blue/30 focus:border-realm-neon-blue text-realm-silver"
                      placeholder="Enter your access code"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full realm-button text-realm-neon-blue font-semibold">
                    <Zap className="w-4 h-4 mr-2" />
                    Enter the Realm
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-realm-silver flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Hunter Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-realm-gunmetal border-realm-neon-blue/30 focus:border-realm-neon-blue text-realm-silver"
                      placeholder="Choose your hunter name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-realm-silver flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Hunter ID (Email)
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-realm-gunmetal border-realm-neon-blue/30 focus:border-realm-neon-blue text-realm-silver"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-realm-silver flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Access Code
                    </Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-realm-gunmetal border-realm-neon-blue/30 focus:border-realm-neon-blue text-realm-silver"
                      placeholder="Create your access code"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full realm-button text-realm-neon-blue font-semibold">
                    <Shield className="w-4 h-4 mr-2" />
                    Begin Your Quest
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  )
}
