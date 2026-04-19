import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { TeacherList } from "@/pages/TeacherList";
import { TeacherDetail } from "@/pages/TeacherDetail";
import { TeacherForm } from "@/pages/TeacherForm";
import { CourseList } from "@/pages/CourseList";
import { CourseDetail } from "@/pages/CourseDetail";
import { CourseForm } from "@/pages/CourseForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "teachers",
        element: <TeacherList />,
      },
      {
        path: "teachers/new",
        element: <TeacherForm />,
      },
      {
        path: "teachers/:id",
        element: <TeacherDetail />,
      },
      {
        path: "teachers/:id/edit",
        element: <TeacherForm />,
      },
      {
        path: "courses",
        element: <CourseList />,
      },
      {
        path: "courses/new",
        element: <CourseForm />,
      },
      {
        path: "courses/:teacherId/:courseId",
        element: <CourseDetail />,
      },
    ],
  },
]);

export function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
