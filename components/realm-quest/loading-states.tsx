import { RealmCardSkeleton, TaskCardSkeleton, UserProfileSkeleton, StatsCardSkeleton } from "./skeleton"

export function RealmGridLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <RealmCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TaskListLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* User Profile Loading */}
      <UserProfileSkeleton />

      {/* Stats Grid Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Recent Realms Loading */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-realm-gunmetal/30 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <RealmCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function AvatarSelectionLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-realm-gunmetal/30 border border-realm-silver/20 rounded-lg p-4 space-y-3">
          <div className="aspect-square bg-realm-gunmetal/50 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-realm-gunmetal/50 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-realm-gunmetal/50 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
