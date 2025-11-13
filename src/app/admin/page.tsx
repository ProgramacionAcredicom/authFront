import { Title } from "@/components/title/Title";
import { TypographyH2 } from "@/components/ui/typography";
import { useQueryStatistics } from "@/hooks/auth/useQueryStatistics";
import { StatisticsCards } from "@/components/dashboard/statistics-cards";
import { NewUsersList } from "@/components/dashboard/new-users-list";
import { UsersByAgencyChart } from "@/components/dashboard/users-by-agency";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { queryStatistics } = useQueryStatistics();
  const { data, isLoading, isError, error, refetch } = queryStatistics;

  return (
    <section className="animate-in fade-in-0 duration-500">
      <Title />
      <article className="mt-8 md:mt-10">
        <div className="mb-6 flex items-center justify-between">
          <TypographyH2 text="Estadísticas" />
          {!isLoading && !isError && data && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
              aria-label="Actualizar estadísticas"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
          )}
        </div>
        
        {isLoading && (
          <div className="mt-6 space-y-6 animate-in fade-in-0 duration-300">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-xl border bg-card p-6 shadow-sm"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {isError && (
          <div className="mt-6 animate-in fade-in-0 duration-300">
            <Alert variant="destructive" className="max-w-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error al cargar estadísticas</AlertTitle>
              <AlertDescription className="mt-2">
                {error instanceof Error
                  ? error.message
                  : "No se pudieron cargar las estadísticas. Por favor, intenta nuevamente."}
              </AlertDescription>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            </Alert>
          </div>
        )}

        {data && !isLoading && !isError && (
          <div className="mt-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-100">
              <StatisticsCards data={data} />
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
              <div className="animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-300">
                <NewUsersList users={data.new_users_this_month} />
              </div>
              <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-300">
                <UsersByAgencyChart
                  agencies={data.users_by_agency}
                  totalUsers={data.total_users}
                />
              </div>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
