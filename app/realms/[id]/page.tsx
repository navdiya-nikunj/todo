"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Sword, Shield, Zap, Trash2, Edit3, CheckCircle, Clock, Star, Trophy, Target } from "lucide-react"

import { NavigationHeader } from "@/components/realm-quest/navigation-header"
import { ThemeIcon } from "@/components/realm-quest/theme-icons"
import { ProgressBar } from "@/components/realm-quest/progress-bar"
import { mockRealms, mockTasks, mockUser } from "@/lib/data/mock-data"
import { getThemeColor, getDifficultyColor, getXPReward, calculateProgressPercentage } from "@/lib/utils/realm-quest"
import { updateDailyQuestProgress } from "@/lib/utils/realm-quest"
import type { Task, TaskDifficulty, TaskStatus, Realm, DailyQuest } from "@/lib/types/realm-quest"

export default function RealmDetailPage() {
  const router = useRouter()
  const params = useParams()
  const realmId = params.id as string

  const [realm, setRealm] = useState<Realm | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [user, setUser] = useState(mockUser)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [comboCount, setComboCount] = useState(0)
  const [showReward, setShowReward] = useState<{ xp: number; combo?: number } | null>(null)
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([])

  // Form state for task creation/editing
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    difficulty: "medium" as TaskDifficulty,
  })

  useEffect(() => {
    // Find the realm by ID
    const foundRealm = mockRealms.find((r) => r.id === realmId)
    if (foundRealm) {
      setRealm(foundRealm)
      // Filter tasks for this realm
      const realmTasks = mockTasks.filter((t) => t.realmId === realmId)
      setTasks(realmTasks)
    }
  }, [realmId])

  const handleInputChange = (field: string, value: string) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateTask = () => {
    if (!taskForm.title.trim()) return

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: taskForm.title,
      description: taskForm.description,
      difficulty: taskForm.difficulty,
      status: "pending",
      realmId: realmId,
    }

    setTasks((prev) => [...prev, newTask])
    setTaskForm({ title: "", description: "", difficulty: "medium" })
    setIsCreateDialogOpen(false)

    // Update realm total tasks
    if (realm) {
      setRealm((prev) => (prev ? { ...prev, totalTasks: prev.totalTasks + 1 } : null))
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
    })
  }

  const handleUpdateTask = () => {
    if (!editingTask || !taskForm.title.trim()) return

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? { ...task, title: taskForm.title, description: taskForm.description, difficulty: taskForm.difficulty }
          : task,
      ),
    )

    setEditingTask(null)
    setTaskForm({ title: "", description: "", difficulty: "medium" })
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))

    // Update realm total tasks
    if (realm) {
      setRealm((prev) => (prev ? { ...prev, totalTasks: Math.max(0, prev.totalTasks - 1) } : null))
    }
  }

  const handleCompleteTask = (task: Task) => {
    // Mark task as completed
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "completed" as TaskStatus } : t)))

    // Calculate XP reward
    const xpReward = getXPReward(task.difficulty)
    const newCombo = comboCount + 1
    const comboMultiplier = Math.min(1 + (newCombo - 1) * 0.1, 2) // Max 2x multiplier
    const totalXP = Math.floor(xpReward * comboMultiplier)

    // Update user XP
    setUser((prev) => ({ ...prev, xp: prev.xp + totalXP }))
    setComboCount(newCombo)

    // Update realm progress
    if (realm) {
      setRealm((prev) => (prev ? { ...prev, tasksCompleted: prev.tasksCompleted + 1 } : null))
    }

    setDailyQuests((prev) => {
      let updated = updateDailyQuestProgress(prev, "complete_tasks", 1)
      updated = updateDailyQuestProgress(updated, "defeat_enemies", 1)
      updated = updateDailyQuestProgress(updated, "earn_xp", totalXP)
      return updated
    })

    // Show reward animation
    setShowReward({ xp: totalXP, combo: newCombo > 1 ? newCombo : undefined })
    setTimeout(() => setShowReward(null), 3000)
  }

  if (!realm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-realm-silver mb-2">Realm Not Found</h2>
          <Button onClick={() => router.push("/realms")} className="realm-button">
            Return to Realms
          </Button>
        </div>
      </div>
    )
  }

  const pendingTasks = tasks.filter((t) => t.status === "pending")
  const completedTasks = tasks.filter((t) => t.status === "completed")
  const progressPercentage = calculateProgressPercentage(realm.tasksCompleted, realm.totalTasks)

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-realm-deep-black via-realm-gunmetal to-realm-deep-black opacity-90" />
        <div className={`absolute inset-0 ${getThemeColor(realm.theme)} opacity-20`} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-realm-neon-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-realm-crimson-red/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Reward Animation Overlay */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="realm-panel p-8 text-center animate-bounce">
            <div className="text-4xl font-serif font-bold text-realm-neon-blue mb-2">+{showReward.xp} XP</div>
            {showReward.combo && (
              <div className="text-xl text-realm-crimson-red font-bold">{showReward.combo}x COMBO!</div>
            )}
            <div className="flex justify-center mt-2">
              <Star className="w-6 h-6 text-yellow-400 animate-spin" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <NavigationHeader
          title={realm.name}
          subtitle={`${realm.description} • ${realm.tasksCompleted}/${realm.totalTasks} enemies defeated`}
          backLabel="Exit Realm"
          onBack={() => router.push("/realms")}
          rightContent={
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-realm-silver/70">Hunter Level</div>
                <div className="text-lg font-bold text-realm-neon-blue">{user.level}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-realm-silver/70">XP</div>
                <div className="text-lg font-bold text-realm-neon-blue">{user.xp}</div>
              </div>
              {comboCount > 0 && (
                <div className="text-right">
                  <div className="text-sm text-realm-silver/70">Combo</div>
                  <div className="text-lg font-bold text-realm-crimson-red">{comboCount}x</div>
                </div>
              )}
            </div>
          }
        />

        {/* Realm Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="realm-panel">
            <div className="p-4 text-center">
              <ThemeIcon theme={realm.theme} className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm text-realm-silver/70">Realm Type</div>
              <div className="font-bold text-realm-silver capitalize">{realm.theme}</div>
            </div>
          </Card>

          <Card className="realm-panel">
            <div className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-realm-neon-blue" />
              <div className="text-sm text-realm-silver/70">Active Enemies</div>
              <div className="font-bold text-realm-neon-blue">{pendingTasks.length}</div>
            </div>
          </Card>

          <Card className="realm-panel">
            <div className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-sm text-realm-silver/70">Defeated</div>
              <div className="font-bold text-green-400">{completedTasks.length}</div>
            </div>
          </Card>

          <Card className="realm-panel">
            <div className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-sm text-realm-silver/70">Success Rate</div>
              <div className="font-bold text-yellow-400">{Math.round(progressPercentage)}%</div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            current={realm.tasksCompleted}
            total={realm.totalTasks}
            label="Realm Completion"
            showPercentage={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="realm-button text-realm-neon-blue">
                <Plus className="w-4 h-4 mr-2" />
                Summon New Enemy
              </Button>
            </DialogTrigger>
            <DialogContent className="realm-panel border-realm-neon-blue/30">
              <DialogHeader>
                <DialogTitle className="text-realm-silver font-serif">Summon New Enemy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-realm-silver/70 mb-2 block">Enemy Name</label>
                  <Input
                    value={taskForm.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter enemy name..."
                    className="realm-input"
                  />
                </div>
                <div>
                  <label className="text-sm text-realm-silver/70 mb-2 block">Enemy Description</label>
                  <Textarea
                    value={taskForm.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the enemy and quest..."
                    className="realm-input"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-realm-silver/70 mb-2 block">Difficulty Level</label>
                  <Select value={taskForm.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                    <SelectTrigger className="realm-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="realm-panel border-realm-neon-blue/30">
                      <SelectItem value="easy">Easy (+{getXPReward("easy")} XP)</SelectItem>
                      <SelectItem value="medium">Medium (+{getXPReward("medium")} XP)</SelectItem>
                      <SelectItem value="hard">Hard (+{getXPReward("hard")} XP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateTask} className="realm-button text-realm-neon-blue flex-1">
                    <Sword className="w-4 h-4 mr-2" />
                    Summon Enemy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-realm-silver/30 text-realm-silver hover:bg-realm-silver/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {comboCount > 0 && (
            <Button
              variant="outline"
              onClick={() => setComboCount(0)}
              className="border-realm-crimson-red/30 text-realm-crimson-red hover:bg-realm-crimson-red/10"
            >
              Reset Combo
            </Button>
          )}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Enemies */}
          <div>
            <h3 className="text-xl font-serif font-bold text-realm-silver mb-4 flex items-center gap-2">
              <Sword className="w-5 h-5 text-realm-crimson-red" />
              Active Enemies ({pendingTasks.length})
            </h3>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`realm-panel hover:realm-glow transition-all duration-300 ${getThemeColor(realm.theme)}`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-realm-silver mb-1">{task.title}</h4>
                        <p className="text-sm text-realm-silver/70 mb-2">{task.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                            {task.difficulty.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
                          >
                            +{getXPReward(task.difficulty)} XP
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTask(task)}
                          className="border-realm-neon-blue/30 text-realm-neon-blue hover:bg-realm-neon-blue/10"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTask(task.id)}
                          className="border-realm-crimson-red/30 text-realm-crimson-red hover:bg-realm-crimson-red/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCompleteTask(task)}
                      className="w-full realm-button text-green-400 hover:bg-green-400/20"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Defeat Enemy
                    </Button>
                  </div>
                </Card>
              ))}
              {pendingTasks.length === 0 && (
                <Card className="realm-panel">
                  <div className="p-8 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-realm-silver/50" />
                    <h4 className="font-bold text-realm-silver mb-2">No Active Enemies</h4>
                    <p className="text-realm-silver/70 mb-4">
                      This realm is peaceful. Summon new enemies to continue your quest.
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="realm-button text-realm-neon-blue">
                      <Plus className="w-4 h-4 mr-2" />
                      Summon Enemy
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Defeated Enemies */}
          <div>
            <h3 className="text-xl font-serif font-bold text-realm-silver mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-400" />
              Defeated Enemies ({completedTasks.length})
            </h3>
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <Card key={task.id} className="realm-panel opacity-75">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-realm-silver mb-1 line-through">{task.title}</h4>
                        <p className="text-sm text-realm-silver/50 mb-2">{task.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                            {task.difficulty.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs text-green-400 bg-green-400/10 border-green-400/30"
                          >
                            +{getXPReward(task.difficulty)} XP EARNED
                          </Badge>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </Card>
              ))}
              {completedTasks.length === 0 && (
                <Card className="realm-panel">
                  <div className="p-8 text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-realm-silver/50" />
                    <h4 className="font-bold text-realm-silver mb-2">No Victories Yet</h4>
                    <p className="text-realm-silver/70">Complete tasks to see your defeated enemies here.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="realm-panel border-realm-neon-blue/30">
          <DialogHeader>
            <DialogTitle className="text-realm-silver font-serif">Edit Enemy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-realm-silver/70 mb-2 block">Enemy Name</label>
              <Input
                value={taskForm.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter enemy name..."
                className="realm-input"
              />
            </div>
            <div>
              <label className="text-sm text-realm-silver/70 mb-2 block">Enemy Description</label>
              <Textarea
                value={taskForm.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the enemy and quest..."
                className="realm-input"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm text-realm-silver/70 mb-2 block">Difficulty Level</label>
              <Select value={taskForm.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                <SelectTrigger className="realm-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="realm-panel border-realm-neon-blue/30">
                  <SelectItem value="easy">Easy (+{getXPReward("easy")} XP)</SelectItem>
                  <SelectItem value="medium">Medium (+{getXPReward("medium")} XP)</SelectItem>
                  <SelectItem value="hard">Hard (+{getXPReward("hard")} XP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateTask} className="realm-button text-realm-neon-blue flex-1">
                <Edit3 className="w-4 h-4 mr-2" />
                Update Enemy
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingTask(null)}
                className="border-realm-silver/30 text-realm-silver hover:bg-realm-silver/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
