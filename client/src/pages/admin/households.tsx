import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Users, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";

export default function AdminHouseholds() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['/api/admin/households', { page }]
  });

  const households = data?.households || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-household-management">
          Household Management
        </h1>
        <p className="text-muted-foreground">
          View all households and their members
        </p>
        </div>

        <Card>
        <CardHeader>
          <CardTitle>
            Households ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : households.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No households found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {households.map((household: any) => (
                    <TableRow key={household.id} data-testid={`row-household-${household.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Home className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {household.name || 'Unnamed Household'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {household.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{household.ownerName}</div>
                          <div className="text-xs text-muted-foreground">{household.ownerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {household.currency === 'GBP' ? '£' : '$'}
                            {household.weeklyBudget}
                          </span>
                          <span className="text-xs text-muted-foreground">/week</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <Users className="w-3 h-3 mr-1" />
                          {household.memberCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{household.currency}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(household.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} households
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
      </div>
    </AdminLayout>
  );
}
