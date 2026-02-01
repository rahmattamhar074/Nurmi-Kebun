"use client";

import { useState } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { AdminTable } from "./components/admin-table";
import { CreateAdminDialog } from "./components/dialog/create";
import type { Admin } from "@/types/admin";
import { PlusIcon } from "@heroicons/react/20/solid";

interface AdminAccountsPageProps {
  admins: {
    data: Admin[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  filters: {
    search: string | null;
    sort: string;
    direction: string;
  };
}

export default function AdminAccountsPage({
  admins,
  filters,
}: AdminAccountsPageProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const pagination = {
    currentPage: admins.current_page,
    totalPages: admins.last_page,
    perPage: admins.per_page,
    total: admins.total,
    from: admins.from,
    to: admins.to,
  };

  return (
    <DashboardLayout>
      <Head title="Admin Accounts" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Admin Accounts
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Manage administrator accounts for your system
            </p>
          </div>
          <Button onPress={() => setCreateDialogOpen(true)}>
            <PlusIcon className="size-4" />
            Add Account
          </Button>
        </div>

        <div className="bg-white dark:bg-neutral-900">
          <AdminTable admins={admins.data} pagination={pagination} />
        </div>

        <CreateAdminDialog
          isOpen={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
}
