import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, ChevronLeft, ChevronRight, Shield, ShieldOff, Crown, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['/api/admin/users', { page, search, subscriptionTier: subscriptionFilter === 'all' ? undefined : subscriptionFilter }]
  });

  const { data: userDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['/api/admin/users', selectedUser?.id],
    enabled: !!selectedUser?.id
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      return apiRequest(`/api/admin/users/${userId}/admin`, {
        method: 'PATCH',
        body: JSON.stringify({ isAdmin })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "Admin status updated successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, tier, status }: { userId: string; tier: string; status: string }) => {
      return apiRequest(`/api/admin/users/${userId}/subscription`, {
        method: 'PATCH',
        body: JSON.stringify({ subscriptionTier: tier, subscriptionStatus: status })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "Subscription updated successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const getSubscriptionBadge = (tier: string) => {
    if (tier === 'premium') return <Badge>Premium</Badge>;
    if (tier === 'basic') return <Badge variant="secondary">Basic</Badge>;
    return <Badge variant="outline">Free</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge variant="default">Active</Badge>;
    if (status === 'canceled') return <Badge variant="destructive">Canceled</Badge>;
    if (status === 'past_due') return <Badge variant="destructive">Past Due</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-user-management">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Manage user accounts and subscriptions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
                data-testid="input-search-users"
              />
            </div>
            <Select 
              value={subscriptionFilter} 
              onValueChange={(value) => {
                setSubscriptionFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-48" data-testid="select-subscription-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getSubscriptionBadge(user.subscriptionTier)}</TableCell>
                      <TableCell>{getStatusBadge(user.subscriptionStatus)}</TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <Badge variant="destructive" className="gap-1">
                            <Crown className="w-3 h-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                          data-testid={`button-view-user-${user.id}`}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-testid="button-previous-page"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    data-testid="button-next-page"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user account
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="space-y-3">
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="h-40 bg-muted rounded animate-pulse" />
            </div>
          ) : userDetails && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {userDetails.user.firstName} {userDetails.user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{userDetails.user.email}</p>
                  </div>
                  {userDetails.user.isAdmin && (
                    <Badge variant="destructive">
                      <Crown className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>

              {/* Subscription Info */}
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium">Subscription</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tier: </span>
                    {getSubscriptionBadge(userDetails.user.subscriptionTier)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status: </span>
                    {getStatusBadge(userDetails.user.subscriptionStatus)}
                  </div>
                </div>
              </div>

              {/* Household Info */}
              {userDetails.household && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="font-medium">Household</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Budget: </span>
                      <span className="font-medium">
                        {userDetails.household.currency === 'GBP' ? '£' : '$'}
                        {userDetails.household.weeklyBudget}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Members: </span>
                      <span className="font-medium">{userDetails.members?.length || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <h4 className="font-medium">Admin Actions</h4>
                <div className="flex gap-2">
                  <Button
                    variant={userDetails.user.isAdmin ? "destructive" : "default"}
                    onClick={() => toggleAdminMutation.mutate({
                      userId: userDetails.user.id,
                      isAdmin: !userDetails.user.isAdmin
                    })}
                    disabled={toggleAdminMutation.isPending}
                    data-testid="button-toggle-admin"
                  >
                    {userDetails.user.isAdmin ? (
                      <>
                        <ShieldOff className="w-4 h-4 mr-2" />
                        Remove Admin
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Make Admin
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
}
