"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { PaymentMethod } from "@/types/payment-method";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { EditPaymentMethodDialog } from "./dialog/edit";
import { toast } from "sonner";

interface PaymentMethodTableProps {
  paymentMethods: PaymentMethod[];
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export function PaymentMethodTable({
  paymentMethods,
  pagination,
  loading = false,
  onPageChange,
}: PaymentMethodTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const handleToggleStatus = (paymentMethod: PaymentMethod) => {
    router.patch(
      `/dashboard/settings/payment-methods/${paymentMethod.id}/toggle-status`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          const status = !paymentMethod.is_active ? "activated" : "deactivated";
          toast.success(`Payment method ${status} successfully!`);
        },
        onError: () => {
          toast.error(
            "Failed to update payment method status. Please try again."
          );
        },
      }
    );
  };

  const openEditDialog = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setEditDialogOpen(true);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bank":
        return "Bank Transfer";
      case "e_wallet":
        return "E-Wallet";
    }
  };

  console.log(paymentMethods);

  const columns: Column<PaymentMethod>[] = [
    {
      key: "name",
      label: "Payment Method",
      sortable: false,
      resizable: true,
      isRowHeader: true,
      render: (value, paymentMethod) => (
        <div className="flex items-center gap-3 py-4 pl-4">
          {paymentMethod.icon && (
            <img
              src={paymentMethod.icon}
              alt={`${paymentMethod.name} icon`}
              className="w-12 h-12 object-contain rounded"
            />
          )}
          <div className="font-medium text-neutral-900 dark:text-white">
            {value}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: false,
      width: 120,
      render: (value) => (
        <Badge intent={value === "bank" ? "primary" : "success"}>
          {getTypeLabel(value)}
        </Badge>
      ),
    },
    {
      key: "account_number",
      label: "Account Details",
      sortable: false,
      resizable: true,
      render: (value, paymentMethod) => (
        <div className="text-sm">
          <div className="font-medium text-neutral-900 dark:text-white">
            {value}
          </div>
          <div className="text-neutral-500 dark:text-neutral-400">
            {paymentMethod.account_holder_name}
          </div>
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      sortable: false,
      width: 100,
      render: (value, paymentMethod) => (
        <Switch
          isSelected={value}
          onChange={() => handleToggleStatus(paymentMethod)}
          aria-label={`Toggle ${paymentMethod.name} status`}
        />
      ),
    },
    {
      key: "actions",
      label: <div className="text-right font-medium">Actions</div>,
      width: 80,
      className: "text-right",
      render: (_value, paymentMethod) => (
        <div className="flex justify-end">
          <Menu>
            <MenuTrigger className="size-6">
              <EllipsisVerticalIcon />
            </MenuTrigger>
            <MenuContent aria-label="Actions" placement="left top">
              <MenuItem onAction={() => openEditDialog(paymentMethod)}>
                Edit
              </MenuItem>
            </MenuContent>
          </Menu>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      router.get(window.location.pathname, { page }, { preserveState: true });
    }
  };

  return (
    <>
      <Datatable
        data={paymentMethods}
        columns={columns}
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
        emptyMessage="No payment methods configured. Add your first payment method to start accepting payments."
        striped
      />

      <EditPaymentMethodDialog
        paymentMethod={selectedPaymentMethod}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
