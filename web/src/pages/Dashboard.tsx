import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { healthCheck, getTeachers } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground mt-1">欢迎使用教师课程管理系统</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="教师总数"
          description="系统中注册的教师数量"
          icon={<GraduationCap className="w-5 h-5" />}
          link="/teachers"
          linkText="查看教师"
        />
        <StatCard
          title="课程总数"
          description="所有教师开设的课程"
          icon={<BookOpen className="w-5 h-5" />}
          link="/courses"
          linkText="查看课程"
        />
        <StatCard
          title="系统状态"
          description="API服务运行状态"
          icon={<TrendingUp className="w-5 h-5" />}
          link="/"
          linkText="刷新状态"
          isHealthCheck
        />
      </div>

      <QuickActions />
    </div>
  );
}

function StatCard({
  title,
  description,
  icon,
  link,
  linkText,
  isHealthCheck,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  linkText: string;
  isHealthCheck?: boolean;
}) {
  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["health"],
    queryFn: healthCheck,
    refetchInterval: 30000,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isHealthCheck ? (
          healthLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{health ? "正常" : "异常"}</div>
          )
        ) : (
          <div className="text-2xl font-bold">{teachers?.length ?? 0}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
        <Link
          to={link}
          className="text-xs text-primary hover:underline mt-2 inline-block"
        >
          {linkText}
        </Link>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>快捷操作</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link
          to="/teachers/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          添加教师
        </Link>
        <Link
          to="/courses/new"
          className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          添加课程
        </Link>
      </CardContent>
    </Card>
  );
}
