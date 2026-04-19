import { useQuery } from "@tanstack/react-query";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTeachers, getCoursesByTeacher } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Course, Teacher } from "@/lib/types";

export function CourseList() {
  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  if (teachersLoading) {
    return <CourseListSkeleton />;
  }

  if (!teachers || teachers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">课程列表</h1>
            <p className="text-muted-foreground mt-1">查看所有课程</p>
          </div>
          <Button link="/courses/new">
            <Plus className="w-4 h-4 mr-2" />
            添加课程
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">暂无教师，请先添加教师后再创建课程</p>
            <Button className="mt-4" link="/teachers/new">添加教师</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">课程列表</h1>
          <p className="text-muted-foreground mt-1">查看所有课程</p>
        </div>
        <Button link="/courses/new">
          <Plus className="w-4 h-4 mr-2" />
          添加课程
        </Button>
      </div>

      {teachers.map((teacher) => (
        <TeacherCourses key={teacher.id} teacher={teacher} />
      ))}
    </div>
  );
}

function TeacherCourses({ teacher }: { teacher: Teacher }) {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["courses", teacher.id],
    queryFn: () => getCoursesByTeacher(teacher.id),
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>加载课程失败</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <img
          src={teacher.picture_url}
          alt={teacher.name}
          className="w-10 h-10 rounded-full object-cover bg-muted"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&size=40&background=random`;
          }}
        />
        <div className="flex-1">
          <CardTitle className="text-lg">{teacher.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{teacher.profile}</p>
        </div>
        <Button variant="outline" size="sm" link={`/teachers/${teacher.id}`}>
          查看教师
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : courses?.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">暂无课程</p>
        ) : (
          <div className="space-y-3">
            {courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium">{course.name}</h3>
          <Badge variant="outline">{course.level}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {course.description || "暂无描述"}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>{course.format}</span>
          <span>{course.duration}</span>
          <span>{course.language}</span>
          <span className="font-medium text-foreground">
            {formatPrice(course.price)}
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="ml-4" link={`/courses/${course.teacher_id}/${course.id}`}>
        查看详情
      </Button>
    </div>
  );
}

function CourseListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
