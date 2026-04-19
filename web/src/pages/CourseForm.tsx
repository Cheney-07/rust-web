import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTeachers, getCourse, createCourse, updateCourse } from "@/lib/api";
import type { CreateCourseRequest } from "@/lib/types";

export function CourseForm() {
  const [searchParams] = useSearchParams();
  const { teacherId, courseId } = useParams();
  const isEdit = Boolean(teacherId && courseId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const defaultTeacherId = searchParams.get("teacherId");

  const [formData, setFormData] = useState<CreateCourseRequest>({
    teacher_id: defaultTeacherId ? Number(defaultTeacherId) : 0,
    name: "",
    description: "",
    format: "",
    structure: "",
    duration: "",
    price: 0,
    language: "",
    level: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", teacherId, courseId],
    queryFn: () => getCourse(Number(teacherId), Number(courseId)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (course) {
      setFormData({
        teacher_id: course.teacher_id,
        name: course.name,
        description: course.description || "",
        format: course.format || "",
        structure: course.structure || "",
        duration: course.duration || "",
        price: course.price,
        language: course.language || "",
        level: course.level || "",
      });
    }
  }, [course]);

  const mutation = useMutation({
    mutationFn: (data: CreateCourseRequest) =>
      isEdit
        ? updateCourse(Number(teacherId), Number(courseId), data)
        : createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      if (isEdit) {
        navigate(`/courses/${teacherId}/${courseId}`);
      } else {
        navigate(`/teachers/${formData.teacher_id}`);
      }
    },
    onError: (err: Error) => {
      setError(err.message || "操作失败");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEdit && formData.teacher_id === 0) {
      setError("请选择教师");
      return;
    }
    if (!formData.name.trim()) {
      setError("请输入课程名称");
      return;
    }
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : name === "teacher_id" ? Number(value) : value,
    }));
  };

  if (teachersLoading || (isEdit && courseLoading)) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" link={isEdit ? `/courses/${teacherId}/${courseId}` : "/courses"}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? "编辑课程" : "添加课程"}</h1>
          <p className="text-muted-foreground mt-1">
            {isEdit ? "修改课程信息" : "创建新的课程"}
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
          <CardTitle>课程信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="teacher_id">教师 *</Label>
                <select
                  id="teacher_id"
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  required
                >
                  <option value="">请选择教师</option>
                  {teachers?.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">课程名称 *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入课程名称"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">课程描述</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="请输入课程描述"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">课程形式</Label>
                <select
                  id="format"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">请选择</option>
                  <option value="在线视频">在线视频</option>
                  <option value="直播">直播</option>
                  <option value="线下">线下</option>
                  <option value="混合">混合</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">难度等级</Label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">请选择</option>
                  <option value="入门">入门</option>
                  <option value="初级">初级</option>
                  <option value="中级">中级</option>
                  <option value="高级">高级</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">课程时长</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="如: 16周"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">授课语言</Label>
                <Input
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="如: 中文"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="structure">课程结构</Label>
              <Input
                id="structure"
                name="structure"
                value={formData.structure}
                onChange={handleChange}
                placeholder="如: 每周两节课"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">课程价格 (分) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="如: 2999 表示 29.99 元"
                required
              />
              <p className="text-xs text-muted-foreground">
                输入整数，单位为分。如 2999 表示 29.99 元
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "保存修改" : "创建课程"}
              </Button>
              <Button type="button" variant="outline" link={isEdit ? `/courses/${teacherId}/${courseId}` : "/courses"}>
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
