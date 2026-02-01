import DynamicDialog from "@/components/modules/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/20/solid";
import React from "react";
import AddressForm from "./address-form";

interface AddAddressTriggerProps {
  isDisabled?: boolean;
}

const AddAddressTrigger = ({ isDisabled }: AddAddressTriggerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogKey, setDialogKey] = React.useState(0);

  const handleFormSuccess = React.useCallback(() => {
    setIsOpen(false);
    setDialogKey((prev) => prev + 1);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button
        className="flex items-center gap-2"
        onPress={handleOpen}
        isDisabled={isDisabled}
      >
        {isDisabled ? (
          "Maximum 3 addresses allowed"
        ) : (
          <>
            <PlusIcon className="w-4 h-4" />
            Add Address
          </>
        )}
      </Button>
      {isOpen && (
        <DynamicDialog
          key={dialogKey}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Add New Address"
          description="Add your first shipping address to get started with deliveries"
        >
          <AddressForm
            onSuccess={handleFormSuccess}
            onCancel={() => setIsOpen(false)}
          />
        </DynamicDialog>
      )}
    </>
  );
};

export default AddAddressTrigger;
