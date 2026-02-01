import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PencilIcon,
  TrashIcon,
  StarIcon as StarOutlineIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import type { UserAddress } from "..";

interface AddressCardProps {
  address: UserAddress;
  handleEdit: (address: UserAddress) => void;
  handleSetDefault: (addressId: number) => void;
  setSelectedAddress: (address: UserAddress | null) => void;
  setIsDeleteOpen: (open: boolean) => void;
}

const AddressCard = (props: AddressCardProps) => {
  const {
    address,
    handleEdit,
    handleSetDefault,
    setSelectedAddress,
    setIsDeleteOpen,
  } = props;
  return (
    <Card
      key={address.id}
      className={`relative ${address.is_default ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{address.name}</CardTitle>
            {address.is_default && (
              <Badge intent="success" className="flex items-center gap-1">
                <StarSolidIcon className="w-3 h-3" />
                Default
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              intent="plain"
              size="xs"
              className="p-2"
              onPress={() => handleEdit(address)}
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
            {!address.is_default && (
              <Button
                intent="plain"
                size="xs"
                className="p-2"
                onPress={() => handleSetDefault(address.id)}
              >
                <StarOutlineIcon className="w-4 h-4" />
              </Button>
            )}
            <Button
              intent="plain"
              size="xs"
              className="p-2 text-red-600 hover:text-red-700"
              onPress={() => {
                setSelectedAddress(address);
                setIsDeleteOpen(true);
              }}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm font-medium">{address.recipient_name}</p>
          <p className="text-sm text-neutral-600">{address.phone}</p>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {address.formatted_address}
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>
              {address.city_name}, {address.province_name}
            </span>
            <span>•</span>
            <span>{address.postal_code}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
