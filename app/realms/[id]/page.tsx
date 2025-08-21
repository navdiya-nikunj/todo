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
import { Plus, Sword, Shield, Zap, Trash2, Edit3, CheckCircle, Clock, Star, Trophy, Target, AlertTriangle } from "lucide-react"

import { NavigationHeader } from "@/components/realm-quest/navigation-header"
import { ThemeIcon } from "@/components/realm-quest/theme-icons"
import { ProgressBar } from "@/components/realm-quest/progress-bar"
import { LoadingSpinner } from "@/components/realm-quest/loading-spinner"
import { useAuth } from "@/lib/contexts/auth-context"
import { realmService, taskService, dailyQuestService } from "@/lib/api/services"
import { getThemeColor, getDifficultyColor, getXPReward, calculateProgressPercentage } from "@/lib/utils/realm-quest"
import type { Task, TaskDifficulty, TaskStatus, Realm } from "@/lib/types/realm-quest"

export default function RealmDetailPage() {
  const router = useRouter()
  const params = useParams()
  const realmId = params.id as string
  const { state: authState } = useAuth()

  const [realm, setRealm] = useState<Realm | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [completing, setCompleting] = useState<string | null>(null)
  const [comboCount, setComboCount] = useState(0)
  const [showReward, setShowReward] = useState<{ xp: number; combo?: number; levelUp?: any; badges?: any[] } | null>(null)

  // Form state for task creation/editing
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    difficulty: "medium" as TaskDifficulty,
  })

  // Load realm and tasks data
  useEffect(() => {
    const loadRealmData = async () => {
      if (!authState.isAuthenticated) {
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Load realm and tasks in parallel
        const [realmResponse, tasksResponse] = await Promise.all([
          realmService.getRealmById(realmId),
          taskService.getTasks(realmId, { limit: 100 })
        ])

        setRealm(realmResponse.data)
        setTasks(tasksResponse.data)
      } catch (err: any) {
        setError(err.message || "Failed to load realm data")
        console.error("Realm detail error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadRealmData()
  }, [realmId, authState.isAuthenticated, router])

  const handleInputChange = (field: string, value: string) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) return

    try {
      setCreating(true)
      const response = await taskService.createTask(realmId, {
      title: taskForm.title,
      description: taskForm.description,
      difficulty: taskForm.difficulty,
      realmId: realmId,
      })

      // Add new task to the list
      setTasks((prev) => [...prev, response.data])
    setTaskForm({ title: "", description: "", difficulty: "medium" })
    setIsCreateDialogOpen(false)

      // Update realm total tasks count
    if (realm) {
      setRealm((prev) => (prev ? { ...prev, totalTasks: prev.totalTasks + 1 } : null))
      }
    } catch (err: any) {
      setError(err.message || "Failed to create task")
      console.error("Create task error:", err)
    } finally {
      setCreating(false)
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

  const handleUpdateTask = async () => {
    if (!editingTask || !taskForm.title.trim()) return

    try {
      setUpdating(editingTask.id)
      const response = await taskService.updateTask(realmId, editingTask.id, {
        title: taskForm.title,
        description: taskForm.description,
        difficulty: taskForm.difficulty,
      })

      // Update task in the list
    setTasks((prev) =>
      prev.map((task) =>
          task.id === editingTask.id ? response.data : task
      ),
    )

    setEditingTask(null)
    setTaskForm({ title: "", description: "", difficulty: "medium" })
    } catch (err: any) {
      setError(err.message || "Failed to update task")
      console.error("Update task error:", err)
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(realmId, taskId)
      
      // Remove task from the list
    setTasks((prev) => prev.filter((task) => task.id !== taskId))

    // Update realm total tasks
    if (realm) {
      setRealm((prev) => (prev ? { ...prev, totalTasks: Math.max(0, prev.totalTasks - 1) } : null))
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete task")
      console.error("Delete task error:", err)
    }
  }

  const handleCompleteTask = async (task: Task) => {
    try {
      setCompleting(task.id)
      const response = await taskService.completeTask(realmId, task.id)

      // Update task in the list
      setTasks((prev) => prev.map((t) => (t.id === task.id ? response.data.task : t)))

    // Update realm progress
    if (realm) {
      setRealm((prev) => (prev ? { ...prev, tasksCompleted: prev.tasksCompleted + 1 } : null))
    }

      // Calculate combo
      const newCombo = comboCount + 1
      setComboCount(newCombo)

      // Try to update daily quest progress (don't fail task completion if this fails)
      try {
        // Update quest progress for task-related quests
        await Promise.all([
          dailyQuestService.updateQuestProgress("complete_tasks", 1).catch(() => {}),
          dailyQuestService.updateQuestProgress("defeat_enemies", 1).catch(() => {}),
          dailyQuestService.updateQuestProgress("earn_xp", response.data.xpGained).catch(() => {}),
        ])
      } catch (err) {
        // Silently fail daily quest updates - don't interfere with main task completion
        console.warn("Failed to update daily quest progress:", err)
      }

    // Show reward animation
      setShowReward({
        xp: response.data.xpGained,
        combo: newCombo > 1 ? newCombo : undefined,
        levelUp: response.data.levelUp,
        badges: response.data.newBadges || []
      })
      setTimeout(() => setShowReward(null), 4000)
    } catch (err: any) {
      setError(err.message || "Failed to complete task")
      console.error("Complete task error:", err)
    } finally {
      setCompleting(null)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show error state
  if (error && !realm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-realm-silver mb-2">Failed to Load Realm</h2>
          <p className="text-realm-silver/70 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} className="realm-button text-realm-neon-blue">
              Try Again
            </Button>
            <Button onClick={() => router.push("/realms")} variant="outline" className="border-realm-silver/30 text-realm-silver">
              Return to Realms
            </Button>
          </div>
        </div>
      </div>
    )
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
          <div className="realm-panel p-8 text-center animate-bounce max-w-md">
            <div className="text-4xl font-serif font-bold text-realm-neon-blue mb-2">+{showReward.xp} XP</div>
            {showReward.combo && (
              <div className="text-xl text-realm-crimson-red font-bold">{showReward.combo}x COMBO!</div>
            )}
            {showReward.levelUp && (
              <div className="text-2xl text-yellow-400 font-bold mt-2">
                LEVEL UP! {showReward.levelUp.from} → {showReward.levelUp.to}
              </div>
            )}
            {showReward.badges && showReward.badges.length > 0 && (
              <div className="mt-2">
                <div className="text-lg text-purple-400 font-bold">NEW BADGES!</div>
                {showReward.badges.map((badge, index) => (
                  <div key={index} className="text-sm text-purple-300">{badge.name}</div>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-2">
              <Star className="w-6 h-6 text-yellow-400 animate-spin" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        <NavigationHeader
          title={realm.name}
          subtitle={`${realm.description} • ${realm.tasksCompleted}/${realm.totalTasks} enemies defeated`}
          backLabel="Exit Realm"
          onBack={() => router.push("/realms")}
          rightContent={
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-realm-silver/70">Hunter Level</div>
                <div className="text-lg font-bold text-realm-neon-blue">{authState.data?.level}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-realm-silver/70">XP</div>
                <div className="text-lg font-bold text-realm-neon-blue">{authState.data?.xp}</div>
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
            max={realm.totalTasks}
            label="Realm Completion"
            showNumbers={true}
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
                  <Button 
                    onClick={handleCreateTask} 
                    className="realm-button text-realm-neon-blue flex-1"
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-realm-neon-blue/30 border-t-realm-neon-blue" />
                        Summoning...
                      </>
                    ) : (
                      <>
                    <Sword className="w-4 h-4 mr-2" />
                    Summon Enemy
                      </>
                    )}
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
                      disabled={completing === task.id}
                    >
                      {completing === task.id ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-green-400/30 border-t-green-400" />
                          Defeating...
                        </>
                      ) : (
                        <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Defeat Enemy
                        </>
                      )}
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
              <Button 
                onClick={handleUpdateTask} 
                className="realm-button text-realm-neon-blue flex-1"
                disabled={updating === editingTask?.id}
              >
                {updating === editingTask?.id ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-realm-neon-blue/30 border-t-realm-neon-blue" />
                    Updating...
                  </>
                ) : (
                  <>
                <Edit3 className="w-4 h-4 mr-2" />
                Update Enemy
                  </>
                )}
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
