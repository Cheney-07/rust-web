import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTeacher, createTeacher, updateTeacher } from "@/lib/api";
import type { CreateTeacherRequest } from "@/lib/types";

export function TeacherForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateTeacherRequest>({
    name: "",
    picture_url: "",
    profile: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: ["teacher", id],
    queryFn: () => getTeacher(Number(id)),
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateTeacherRequest) =>
      isEdit ? updateTeacher(Number(id), data) : createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      navigate("/teachers");
    },
    onError: (err: Error) => {
      setError(err.message || "操作失败");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isEdit && teacherLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isEdit && teacher) {
    setFormData({
      name: teacher.name,
      picture_url: teacher.picture_url,
      profile: teacher.profile,
    });
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" link="/teachers">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? "编辑教师" : "添加教师"}</h1>
          <p className="text-muted-foreground mt-1">
            {isEdit ? "修改教师信息" : "创建新的教师账户"}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>教师信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入教师姓名"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="picture_url">照片URL *</Label>
              <Input
                id="picture_url"
                name="picture_url"
                type="url"
                value={formData.picture_url}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile">简介 *</Label>
              <Textarea
                id="profile"
                name="profile"
                value={formData.profile}
                onChange={handleChange}
                placeholder="请输入教师简介"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "保存修改" : "创建教师"}
              </Button>
              <Button type="button" variant="outline" link="/teachers">
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
