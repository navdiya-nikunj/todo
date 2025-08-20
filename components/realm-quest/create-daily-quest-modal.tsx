"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Star, Target } from "lucide-react"
import type { CreateCustomQuestData } from "@/lib/types/realm-quest"

interface CreateDailyQuestModalProps {
  onCreateQuest: (questData: CreateCustomQuestData) => void
}

export function CreateDailyQuestModal({ onCreateQuest }: CreateDailyQuestModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<CreateCustomQuestData>({
    title: "",
    description: "",
    target: 1,
    xpReward: 15,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) return

    onCreateQuest(formData)
    setFormData({ title: "", description: "", target: 1, xpReward: 15 })
    setIsOpen(false)
  }

  const handleInputChange = (field: keyof CreateCustomQuestData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="realm-button text-realm-neon-blue hover:bg-realm-neon-blue/20">
          <Plus className="w-4 h-4 mr-2" />
          Create Daily Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="realm-panel border-realm-neon-blue/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-realm-silver font-serif text-xl">
            <Star className="w-5 h-5 inline mr-2 text-yellow-400" />
            Forge New Daily Quest
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-realm-silver/70">
              Quest Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Complete morning workout"
              className="realm-input"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-realm-silver/70">
              Quest Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what needs to be accomplished..."
              className="realm-input resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target" className="text-realm-silver/70 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Target Count
              </Label>
              <Input
                id="target"
                type="number"
                min="1"
                max="100"
                value={formData.target}
                onChange={(e) => handleInputChange("target", Number.parseInt(e.target.value) || 1)}
                className="realm-input"
                required
              />
            </div>

            <div>
              <Label htmlFor="xpReward" className="text-realm-silver/70 flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                XP Reward
              </Label>
              <Input
                id="xpReward"
                type="number"
                min="5"
                max="100"
                step="5"
                value={formData.xpReward}
                onChange={(e) => handleInputChange("xpReward", Number.parseInt(e.target.value) || 15)}
                className="realm-input"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-realm-silver/30 text-realm-silver hover:bg-realm-silver/10"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 realm-button text-realm-neon-blue hover:bg-realm-neon-blue/20">
              Create Quest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
