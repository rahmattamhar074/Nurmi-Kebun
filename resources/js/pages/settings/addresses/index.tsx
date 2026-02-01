import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPinIcon } from "@heroicons/react/24/outline";
import SettingsLayout from "@/pages/settings/settings-layout";
import { toast } from "sonner";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import AddressForm from "./components/address-form";
import type { SharedData } from "@/types/shared";
import AddressCard from "./components/address-card";
import AddAddressTrigger from "./components/add-address-trigger";

export interface UserAddress {
  id: number;
  name: string;
  recipient_name: string;
  phone: string;
  province_id: number;
  province_name: string;
  city_id: number;
  city_name: string;
  subdistrict_name?: string;
  postal_code: string;
  full_address: string;
  is_default: boolean;
  is_active: boolean;
  formatted_address: string;
  created_at: string;
}

interface Props extends SharedData {
  addresses: UserAddress[];
}

export default function AdressSettings() {
  const { addresses } = usePage<Props>().props;
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleSetDefault = (addressId: number) => {
    router.patch(
      `/settings/addresses/${addressId}/set-default`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Default address updated successfully!");
        },
        onError: () => {
          toast.error("Failed to update default address.");
        },
      }
    );
  };

  const handleEdit = (address: UserAddress) => {
    setSelectedAddress(address);
    setIsEditOpen(true);
  };

  const handleDelete = () => {
    if (!selectedAddress) return;

    setIsDeleteOpen(false);
    setSelectedAddress(null);

    router.delete(`/settings/addresses/${selectedAddress.id}`, {
      preserveScroll: true,
    });
  };

  const handleFormSuccess = () => {
    setIsEditOpen(false);
    setSelectedAddress(null);
  };

  return (
    <>
      <Head title="Manage Addresses" />

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Shipping Addresses</h1>
            <p className="text-sm text-neutral-600">
              Manage your delivery addresses for orders
            </p>
          </div>
          <AddAddressTrigger isDisabled={addresses.length >= 3} />
        </div>

        {addresses.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <MapPinIcon className="w-6 h-6 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium  mb-2">No addresses yet</h3>
              <p className="text-neutral-500 mb-6 max-w-md">
                Add your first shipping address to get started with deliveries
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                handleEdit={handleEdit}
                handleSetDefault={handleSetDefault}
                setSelectedAddress={setSelectedAddress}
                setIsDeleteOpen={setIsDeleteOpen}
              />
            ))}
          </div>
        )}
      </div>

      {selectedAddress && (
        <DynamicDialog
          isOpen={isEditOpen}
          onOpenChange={(isOpen) => {
            setIsEditOpen(isOpen);
            if (!isOpen) setSelectedAddress(null);
          }}
          title="Edit Address"
          description="Edit your shipping address"
        >
          <AddressForm
            address={selectedAddress}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsEditOpen(false);
              setSelectedAddress(null);
            }}
          />
        </DynamicDialog>
      )}

      {selectedAddress && (
        <DynamicDialog
          isOpen={isDeleteOpen}
          onOpenChange={(isOpen) => {
            setIsDeleteOpen(isOpen);
            if (!isOpen) setSelectedAddress(null);
          }}
          title="Delete Address"
          description="Are you sure you want to delete this address? This action cannot be undone."
        >
          <div className="flex justify-end gap-3">
            <Button
              intent="plain"
              onPress={() => {
                setIsDeleteOpen(false);
                setSelectedAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button intent="danger" onPress={handleDelete}>
              Delete
            </Button>
          </div>
        </DynamicDialog>
      )}
    </>
  );
}

AdressSettings.layout = (page: any) => <SettingsLayout children={page} />;
