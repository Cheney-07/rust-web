import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCourse, getTeacher, deleteCourse } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export function CourseDetail() {
  const { teacherId, courseId } = useParams();
  const tid = Number(teacherId);
  const cid = Number(courseId);

  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ["course", tid, cid],
    queryFn: () => getCourse(tid, cid),
    enabled: Boolean(tid) && Boolean(cid),
  });

  const { data: teacher } = useQuery({
    queryKey: ["teacher", tid],
    queryFn: () => getTeacher(tid),
    enabled: Boolean(tid) && Boolean(course),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(tid, cid),
    onSuccess: () => {
      window.location.href = `/teachers/${tid}`;
    },
  });

  const handleDelete = () => {
    if (window.confirm("确定要删除这门课程吗？")) {
      deleteMutation.mutate();
    }
  };

  if (courseError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>加载课程信息失败，请检查API服务是否运行</AlertDescription>
      </Alert>
    );
  }

  if (courseLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardContent className="py-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" link={`/teachers/${tid}`}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">课程详情</h1>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          删除课程
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{course.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{course.level}</Badge>
                <Badge variant="outline">{course.format}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(course.price)}
              </div>
              <p className="text-xs text-muted-foreground">课程价格</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {teacher && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <img
                src={teacher.picture_url}
                alt={teacher.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&size=64&background=random`;
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{teacher.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {teacher.profile}
                </p>
              </div>
              <Button variant="outline" size="sm" link={`/teachers/${tid}`}>
                查看教师
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="课程形式" value={course.format || "-"} />
            <InfoItem label="课程时长" value={course.duration || "-"} />
            <InfoItem label="授课语言" value={course.language || "-"} />
            <InfoItem label="难度等级" value={course.level || "-"} />
          </div>

          <div>
            <h3 className="font-medium mb-2">课程描述</h3>
            <p className="text-muted-foreground">
              {course.description || "暂无描述"}
            </p>
          </div>

          {course.structure && (
            <div>
              <h3 className="font-medium mb-2">课程结构</h3>
              <p className="text-muted-foreground">{course.structure}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-accent/50 rounded-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}
