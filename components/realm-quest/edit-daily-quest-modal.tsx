"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Star, Target, Trash2 } from "lucide-react"
import type { CustomDailyQuest, CreateCustomQuestData } from "@/lib/types/realm-quest"

interface EditDailyQuestModalProps {
  quest: CustomDailyQuest
  onEditQuest: (questId: string, questData: CreateCustomQuestData) => void
  onDeleteQuest: (questId: string) => void
}

export function EditDailyQuestModal({ quest, onEditQuest, onDeleteQuest }: EditDailyQuestModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<CreateCustomQuestData>({
    title: "",
    description: "",
    target: 1,
    xpReward: 15,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  // Initialize form data when quest changes
  useEffect(() => {
    setFormData({
      title: quest.title,
      description: quest.description,
      target: quest.target,
      xpReward: quest.xpReward,
    })
  }, [quest])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) return

    onEditQuest(quest.id, formData)
    setIsOpen(false)
  }

  const handleInputChange = (field: keyof CreateCustomQuestData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quest? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      await onDeleteQuest(quest.id)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to delete quest:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="realm-panel border-yellow-400/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-realm-silver font-serif text-xl">
            <Edit className="w-5 h-5 inline mr-2 text-yellow-400" />
            Edit Daily Quest
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
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 border-red-400/30 text-red-400 hover:bg-red-400/20"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-red-400/30 border-t-red-400" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Quest
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-realm-silver/30 text-realm-silver hover:bg-realm-silver/10"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 realm-button text-yellow-400 hover:bg-yellow-400/20">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
