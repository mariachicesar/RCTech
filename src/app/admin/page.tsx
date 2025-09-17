"use client";

// Compose the existing (admin) layout and page into a real /admin route.
// This avoids changing folder structure while ensuring /admin resolves.
import AdminLayout from "../(admin)/layout";
import AdminPage from "../(admin)/page";

export default function Admin() {
  return (
    <AdminLayout>
      <AdminPage />
    </AdminLayout>
  );
}
