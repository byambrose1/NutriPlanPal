import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, Calendar } from "lucide-react";

export default function NutritionReports() {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [period, setPeriod] = useState<string>("week");

  // Fetch household
  const { data: household } = useQuery<any>({
    queryKey: ["/api/households/me"],
  });

  // Fetch household members
  const { data: members = [] } = useQuery<any[]>({
    queryKey: ["/api/households", household?.id, "members"],
    enabled: !!household?.id,
  });

  // Set default member
  const currentMember = selectedMemberId 
    ? members.find((m: any) => m.id === selectedMemberId)
    : members[0];

  // Fetch nutrition report
  const { data: report, isLoading: reportLoading } = useQuery<any>({
    queryKey: ["/api/members", currentMember?.id, "nutrition-report", period],
    enabled: !!currentMember?.id,
    queryFn: async () => {
      const res = await fetch(`/api/members/${currentMember.id}/nutrition-report?period=${period}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch nutrition report");
      return res.json();
    },
  });

  const COLORS = {
    protein: "#22c55e",
    carbs: "#3b82f6", 
    fat: "#f59e0b",
    fiber: "#8b5cf6",
    sugar: "#ec4899",
    sodium: "#ef4444"
  };

  // Prepare macros data for pie chart
  const macrosData = report ? [
    { name: "Protein", value: report.averages.protein, color: COLORS.protein },
    { name: "Carbs", value: report.averages.carbs, color: COLORS.carbs },
    { name: "Fat", value: report.averages.fat, color: COLORS.fat }
  ] : [];

  // Prepare daily breakdown for line chart
  const dailyData = report?.dailyBreakdown?.map((day: any, index: number) => ({
    day: `Day ${index + 1}`,
    calories: day.calories,
    protein: day.protein,
    carbs: day.carbs,
    fat: day.fat
  })) || [];

  // Micronutrients data
  const microData = report ? [
    { name: "Fiber", value: report.averages.fiber, color: COLORS.fiber },
    { name: "Sugar", value: report.averages.sugar, color: COLORS.sugar },
    { name: "Sodium", value: Math.round(report.averages.sodium / 100), color: COLORS.sodium } // Scale for visibility
  ] : [];

  return (
    <div className="min-h-screen bg-background mb-16 md:mb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2" data-testid="nutrition-title">
              <Activity className="w-8 h-8 text-orange-500" />
              Nutrition Reports
            </h1>
            <p className="text-muted-foreground">
              Track your macro and micronutrient intake over time
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Select value={currentMember?.id || ""} onValueChange={setSelectedMemberId}>
              <SelectTrigger className="w-48" data-testid="select-member">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member: any) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32" data-testid="select-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {reportLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading nutrition data...</p>
          </div>
        ) : !report || report.daysTracked === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                Generate meal plans to start tracking nutrition data
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Avg Calories</div>
                  <div className="text-2xl font-bold" data-testid="avg-calories">{report.averages.calories}</div>
                  <div className="text-xs text-muted-foreground">per day</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Avg Protein</div>
                  <div className="text-2xl font-bold text-green-600" data-testid="avg-protein">{report.averages.protein}g</div>
                  <div className="text-xs text-muted-foreground">per day</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Avg Carbs</div>
                  <div className="text-2xl font-bold text-blue-600" data-testid="avg-carbs">{report.averages.carbs}g</div>
                  <div className="text-xs text-muted-foreground">per day</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Days Tracked</div>
                  <div className="text-2xl font-bold text-orange-600" data-testid="days-tracked">{report.daysTracked}</div>
                  <div className="text-xs text-muted-foreground">{period === 'week' ? 'this week' : 'this month'}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
                <TabsTrigger value="micronutrients">Micronutrients</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Macronutrient Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Macronutrient Distribution</CardTitle>
                      <CardDescription>Average daily intake breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={macrosData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}g`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {macrosData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Calorie Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Calorie Trends</CardTitle>
                      <CardDescription>Daily calorie intake</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="daily" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Macronutrient Breakdown</CardTitle>
                    <CardDescription>Compare protein, carbs, and fat intake per day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="protein" fill={COLORS.protein} name="Protein (g)" />
                        <Bar dataKey="carbs" fill={COLORS.carbs} name="Carbs (g)" />
                        <Bar dataKey="fat" fill={COLORS.fat} name="Fat (g)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="micronutrients" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Micronutrient Averages</CardTitle>
                      <CardDescription>Daily fiber, sugar, and sodium intake</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={microData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8b5cf6">
                            {microData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Nutrition Insights</CardTitle>
                      <CardDescription>Analysis of your intake</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <div className="font-medium">Protein: {report.averages.protein}g/day</div>
                          <div className="text-sm text-muted-foreground">
                            {report.averages.protein >= 50 ? "Good protein intake" : "Consider increasing protein"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <div>
                          <div className="font-medium">Fiber: {report.averages.fiber}g/day</div>
                          <div className="text-sm text-muted-foreground">
                            {report.averages.fiber >= 25 ? "Excellent fiber intake" : "Aim for 25-30g daily"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div>
                          <div className="font-medium">Sodium: {report.averages.sodium}mg/day</div>
                          <div className="text-sm text-muted-foreground">
                            {report.averages.sodium <= 2300 ? "Within recommended limits" : "Try to reduce sodium"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
