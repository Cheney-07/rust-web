import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { getTeachers, deleteTeacher } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TeacherList() {
  const queryClient = useQueryClient();

  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("确定要删除这位教师吗？")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          加载教师列表失败，请检查API服务是否运行
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">教师列表</h1>
          <p className="text-muted-foreground mt-1">
            管理所有教师信息
          </p>
        </div>
        <Button link="/teachers/new">
          <Plus className="w-4 h-4 mr-2" />
          添加教师
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : teachers?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">暂无教师，请添加第一位教师</p>
            <Button className="mt-4" link="/teachers/new">
              <Plus className="w-4 h-4 mr-2" />
              添加教师
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers?.map((teacher) => (
            <Card key={teacher.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.picture_url}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-full object-cover bg-muted"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`;
                    }}
                  />
                  <div>
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      ID: {teacher.id}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {teacher.profile || "暂无简介"}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" link={`/teachers/${teacher.id}`}>
                    查看详情
                  </Button>
                  <Button variant="outline" size="icon" link={`/teachers/${teacher.id}/edit`}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(teacher.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
