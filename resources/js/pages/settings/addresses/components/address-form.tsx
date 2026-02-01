import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type {
  Address,
  AddressFormData,
  Province,
  City,
  Subdistrict,
} from "@/types/address";

interface AddressFormProps {
  address?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddressForm({
  address,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const { data, setData, post, put, processing, errors, reset } =
    useForm<AddressFormData>({
      name: address?.name || "",
      recipient_name: address?.recipient_name || "",
      phone: address?.phone || "",
      province_id: address?.province_id || "",
      province_name: address?.province_name || "",
      city_id: address?.city_id || "",
      city_name: address?.city_name || "",
      subdistrict_id: address?.subdistrict_id || "",
      subdistrict_name: address?.subdistrict_name || "",
      postal_code: address?.postal_code || "",
      full_address: address?.full_address || "",
      is_default: address?.is_default || false,
    });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);

  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingSubdistricts, setIsLoadingSubdistricts] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const response = await axios.get("/api/provinces");
        setProvinces(response.data);
      } catch (error) {
        console.error("Failed to fetch provinces", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (data.province_id) {
      const fetchCities = async () => {
        setIsLoadingCities(true);
        try {
          const response = await axios.get(
            `/api/cities?province_id=${data.province_id}`
          );
          setCities(response.data);
        } catch (error) {
          console.error("Failed to fetch cities", error);
        } finally {
          setIsLoadingCities(false);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }
  }, [data.province_id]);

  useEffect(() => {
    if (data.city_id) {
      const fetchSubdistricts = async () => {
        setIsLoadingSubdistricts(true);
        try {
          const response = await axios.get(
            `/api/subdistricts?city_id=${data.city_id}`
          );
          setSubdistricts(response.data);
        } catch (error) {
          console.error("Failed to fetch subdistricts", error);
        } finally {
          setIsLoadingSubdistricts(false);
        }
      };

      fetchSubdistricts();
    } else {
      setSubdistricts([]);
    }
  }, [data.city_id]);

  const handleProvinceChange = (key: React.Key | null) => {
    if (!key) return;
    const selectedProvince = provinces.find((p) => p.id === Number(key));
    if (selectedProvince) {
      setData((prev) => ({
        ...prev,
        province_id: selectedProvince.id,
        province_name: selectedProvince.name,
        city_id: "",
        city_name: "",
        subdistrict_id: "",
        subdistrict_name: "",
        postal_code: "",
      }));
    }
  };

  const handleCityChange = (key: React.Key | null) => {
    if (!key) return;
    const selectedCity = cities.find((c) => c.id === Number(key));
    if (selectedCity) {
      setData((prev) => ({
        ...prev,
        city_id: selectedCity.id,
        city_name: `${selectedCity.type} ${selectedCity.name}`,
        subdistrict_id: "",
        subdistrict_name: "",
        postal_code: selectedCity.postal_code || "",
      }));
    }
  };

  const handleSubdistrictChange = (key: React.Key | null) => {
    if (!key) return;
    const selectedSubdistrict = subdistricts.find((s) => s.id === Number(key));
    if (selectedSubdistrict) {
      setData((prev) => ({
        ...prev,
        subdistrict_id: selectedSubdistrict.id,
        subdistrict_name: selectedSubdistrict.name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
      onError: (errors: any) => {
        console.error("Form submission errors:", errors);
        const firstError = Object.values(errors)[0];
        if (firstError && typeof firstError === "string") {
          toast.error(firstError);
        }
      },
    };

    if (address?.id) {
      put(`/settings/addresses/${address.id}`, options);
    } else {
      post("/settings/addresses", options);
    }
  };

  const isFormValid =
    data.name &&
    data.recipient_name &&
    data.phone &&
    data.province_id &&
    data.city_id &&
    data.subdistrict_id &&
    data.postal_code &&
    data.full_address;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Address Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            placeholder="Address name (e.g., Home, Office)"
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient_name">Recipient Name</Label>
          <Input
            id="recipient_name"
            value={data.recipient_name}
            onChange={(e) => setData("recipient_name", e.target.value)}
            placeholder="Recipient full name"
          />
          {errors.recipient_name && (
            <FieldError>{errors.recipient_name}</FieldError>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            placeholder="Phone number"
          />
          {errors.phone && <FieldError>{errors.phone}</FieldError>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Province</Label>
            <Select
              selectedKey={data.province_id ? String(data.province_id) : null}
              onSelectionChange={handleProvinceChange}
              isDisabled={isLoadingProvinces}
            >
              <SelectTrigger>
                <SelectValue>
                  {data.province_name || "Select Province"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent items={provinces}>
                {(province) => (
                  <SelectItem
                    id={String(province.id)}
                    textValue={province.name}
                  >
                    {province.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.province_id && (
              <FieldError>{errors.province_id}</FieldError>
            )}
          </div>

          <div className="space-y-2">
            <Label>City</Label>
            <Select
              selectedKey={data.city_id ? String(data.city_id) : null}
              onSelectionChange={handleCityChange}
              isDisabled={!data.province_id || isLoadingCities}
            >
              <SelectTrigger>
                <SelectValue>{data.city_name || "Select City"}</SelectValue>
              </SelectTrigger>
              <SelectContent items={cities}>
                {(city) => (
                  <SelectItem
                    id={String(city.id)}
                    textValue={`${city.type} ${city.name}`}
                  >
                    {city.type} {city.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.city_id && <FieldError>{errors.city_id}</FieldError>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Subdistrict</Label>
            <Select
              selectedKey={
                data.subdistrict_id ? String(data.subdistrict_id) : null
              }
              onSelectionChange={handleSubdistrictChange}
              isDisabled={!data.city_id || isLoadingSubdistricts}
            >
              <SelectTrigger>
                <SelectValue>
                  {data.subdistrict_name || "Select Subdistrict"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent items={subdistricts}>
                {(subdistrict) => (
                  <SelectItem
                    id={String(subdistrict.id)}
                    textValue={subdistrict.name}
                  >
                    {subdistrict.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.subdistrict_id && (
              <FieldError>{errors.subdistrict_id}</FieldError>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              value={data.postal_code}
              onChange={(e) => setData("postal_code", e.target.value)}
              placeholder="Postal code"
            />
            {errors.postal_code && (
              <FieldError>{errors.postal_code}</FieldError>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="full_address">Full Address</Label>
          <Textarea
            id="full_address"
            value={data.full_address}
            onChange={(e) => setData("full_address", e.target.value)}
            placeholder="Full address details (Street name, house number, etc.)"
            rows={3}
          />
          {errors.full_address && (
            <FieldError>{errors.full_address}</FieldError>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          intent="plain"
          onPress={onCancel}
          isDisabled={processing}
        >
          Cancel
        </Button>
        <Button type="submit" isDisabled={processing || !isFormValid}>
          {processing
            ? "Saving..."
            : address?.id
            ? "Update Address"
            : "Save Address"}
        </Button>
      </div>
    </form>
  );
}
