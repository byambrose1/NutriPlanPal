import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, DollarSign, TrendingUp, Package, Calendar, UserCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats']
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      growth: `+${stats?.userGrowth || 0}%`
    },
    {
      title: "Households",
      value: stats?.totalHouseholds || 0,
      icon: Home,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Monthly Revenue",
      value: `$${stats?.monthlyRevenue || 0}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      growth: `+${stats?.revenueGrowth || 0}%`
    },
    {
      title: "Meal Plans",
      value: stats?.totalMealPlans || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const subscriptionCards = [
    {
      title: "Free Users",
      value: stats?.subscriptionTiers?.free || 0,
      variant: "secondary" as const
    },
    {
      title: "Basic Subscribers",
      value: stats?.subscriptionTiers?.basic || 0,
      variant: "default" as const
    },
    {
      title: "Premium Subscribers",
      value: stats?.subscriptionTiers?.premium || 0,
      variant: "default" as const
    }
  ];

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-admin-dashboard">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Platform overview and key metrics
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/ /g, '-')}`}>
                        {stat.value}
                      </h3>
                      {stat.growth && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.growth}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Subscription Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionCards.map((sub) => (
              <div key={sub.title} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {sub.title}
                  </span>
                  <Badge variant={sub.variant}>{sub.variant === "default" ? "Paid" : "Free"}</Badge>
                </div>
                <p className="text-2xl font-bold" data-testid={`stat-${sub.title.toLowerCase().replace(/ /g, '-')}`}>
                  {sub.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Active Subscriptions: </span>
                <span className="font-semibold">{stats?.subscriptionStatuses?.active || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Canceled: </span>
                <span className="font-semibold">{stats?.subscriptionStatuses?.canceled || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Past Due: </span>
                <span className="font-semibold text-orange-600">
                  {stats?.subscriptionStatuses?.past_due || 0}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Trialing: </span>
                <span className="font-semibold">{stats?.subscriptionStatuses?.trialing || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Content Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Recipes</span>
              <span className="text-xl font-bold" data-testid="stat-total-recipes">
                {stats?.totalRecipes || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Household Members</span>
              <span className="text-xl font-bold" data-testid="stat-total-members">
                {stats?.totalMembers || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg Members/Household</span>
              <span className="text-xl font-bold">
                {stats?.totalHouseholds > 0 
                  ? (stats.totalMembers / stats.totalHouseholds).toFixed(1)
                  : 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="/admin/users" 
              className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              data-testid="link-manage-users"
            >
              <div className="font-medium">Manage Users</div>
              <div className="text-sm text-muted-foreground">
                View and edit user accounts
              </div>
            </a>
            <a 
              href="/admin/households" 
              className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              data-testid="link-manage-households"
            >
              <div className="font-medium">Manage Households</div>
              <div className="text-sm text-muted-foreground">
                View household details and members
              </div>
            </a>
            <a 
              href="/admin/analytics" 
              className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              data-testid="link-view-analytics"
            >
              <div className="font-medium">View Analytics</div>
              <div className="text-sm text-muted-foreground">
                Detailed charts and reports
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
      </div>
    </AdminLayout>
  );
}
