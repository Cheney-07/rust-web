import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTeacher, getCoursesByTeacher, deleteTeacher, deleteCourse } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const teacherId = Number(id);
  const queryClient = useQueryClient();

  const { data: teacher, isLoading: teacherLoading, error: teacherError } = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: () => getTeacher(teacherId),
    enabled: Boolean(teacherId),
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", teacherId],
    queryFn: () => getCoursesByTeacher(teacherId),
    enabled: Boolean(teacherId),
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      window.location.href = "/teachers";
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: number) => deleteCourse(teacherId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", teacherId] });
    },
  });

  const handleDeleteTeacher = () => {
    if (window.confirm("确定要删除这位教师吗？这将同时删除该教师的所有课程。")) {
      deleteTeacherMutation.mutate(teacherId);
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm("确定要删除这门课程吗？")) {
      deleteCourseMutation.mutate(courseId);
    }
  };

  if (teacherError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>加载教师信息失败，请检查API服务是否运行</AlertDescription>
      </Alert>
    );
  }

  if (teacherLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!teacher) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" link="/teachers">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">教师详情</h1>
        </div>
        <Button variant="outline" link={`/teachers/${teacherId}/edit`}>
          <Pencil className="w-4 h-4 mr-2" />
          编辑
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteTeacher}
          disabled={deleteTeacherMutation.isPending}
        >
          {deleteTeacherMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          删除教师
        </Button>
      </div>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-6">
            <img
              src={teacher.picture_url}
              alt={teacher.name}
              className="w-32 h-32 rounded-full object-cover bg-muted"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&size=128&background=random`;
              }}
            />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{teacher.name}</h2>
                <Badge>ID: {teacher.id}</Badge>
              </div>
              <p className="text-muted-foreground">{teacher.profile}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            课程列表 ({courses?.length || 0})
          </CardTitle>
          <Button link={`/courses/new?teacherId=${teacherId}`}>
            <Plus className="w-4 h-4 mr-2" />
            添加课程
          </Button>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : courses?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">暂无课程</p>
              <Button className="mt-4" link={`/courses/new?teacherId=${teacherId}`}>
                <Plus className="w-4 h-4 mr-2" />
                添加课程
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {courses?.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{course.name}</h3>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
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
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" link={`/courses/${teacherId}/${course.id}`}>
                      查看
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteCourse(course.id)}
                      disabled={deleteCourseMutation.isPending}
                    >
                      {deleteCourseMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
