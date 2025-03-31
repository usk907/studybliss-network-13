
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock performance data
const performanceData = [
  { name: 'Week 1', score: 85, average: 75 },
  { name: 'Week 2', score: 78, average: 76 },
  { name: 'Week 3', score: 90, average: 77 },
  { name: 'Week 4', score: 86, average: 78 },
  { name: 'Week 5', score: 92, average: 78 },
  { name: 'Week 6', score: 88, average: 79 },
  { name: 'Week 7', score: 95, average: 80 },
  { name: 'Week 8', score: 91, average: 81 },
];

const subjectPerformance = [
  { name: 'Python', score: 89 },
  { name: 'Data Science', score: 78 },
  { name: 'Web Dev', score: 92 },
  { name: 'AI Ethics', score: 85 },
  { name: 'Databases', score: 76 },
];

const quizPerformance = [
  { name: 'Quiz 1', score: 85 },
  { name: 'Quiz 2', score: 92 },
  { name: 'Quiz 3', score: 78 },
  { name: 'Quiz 4', score: 88 },
  { name: 'Quiz 5', score: 95 },
];

const Performance = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Performance Tracker</h1>
        
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-elearn-primary">85%</div>
              <p className="text-sm text-gray-500 mt-1">Across all courses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-elearn-secondary">92%</div>
              <p className="text-sm text-gray-500 mt-1">Web Development</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-elearn-accent">94%</div>
              <p className="text-sm text-gray-500 mt-1">Classes attended</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Score Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Score Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#94a3b8" 
                    strokeDasharray="5 5" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Subject and Quiz Performance */}
        <Tabs defaultValue="subjects">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subjectPerformance}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="score" 
                        fill="#8b5cf6" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={quizPerformance}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="score" 
                        fill="#6366f1" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Performance;
