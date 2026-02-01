import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FileTrigger } from "@/components/ui/file-trigger";
import { toast } from "sonner";

interface PaymentProofFormProps {
  orderNumber: string;
  orderTotal: number;
  contactPhone: string | null;
}

export function PaymentProofForm({
  orderNumber,
  orderTotal,
  contactPhone,
}: PaymentProofFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    payment_receipt: null as File | null,
    sender_account_name: "",
    sender_account_number: "",
    payment_amount: orderTotal,
    payment_date: new Date().toISOString().split("T")[0],
    contact_phone: contactPhone || "",
  });

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setData("payment_receipt", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.payment_receipt) {
      toast.error("Please upload payment receipt");
      return;
    }

    post(`/transactions/${orderNumber}/upload-payment`, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Payment proof uploaded successfully!");
      },
      onError: () => {
        toast.error("Failed to upload payment proof");
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Proof</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              htmlFor="payment_receipt"
            >
              Payment Receipt <span className="text-red-500">*</span>
            </Label>
            <FileTrigger
              acceptedFileTypes={[
                "image/jpeg",
                "image/png",
                "image/jpg",
                "application/pdf",
              ]}
              onSelect={handleFileSelect}
              className="w-fit"
            >
              {data.payment_receipt ? data.payment_receipt.name : "Select File"}
            </FileTrigger>
            {errors.payment_receipt && (
              <FieldError>{errors.payment_receipt}</FieldError>
            )}
            {previewUrl && !previewUrl.includes("pdf") && (
              <img
                src={previewUrl}
                alt="Receipt preview"
                className="w-full max-w-md mt-2 rounded-lg border"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              htmlFor="sender_account_name"
            >
              Your Account Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sender_account_name"
              value={data.sender_account_name}
              onChange={(e) => setData("sender_account_name", e.target.value)}
              placeholder="Name on your bank account or e-wallet"
              required
            />
            {errors.sender_account_name && (
              <FieldError>{errors.sender_account_name}</FieldError>
            )}
          </div>

          <div className="space-y-2">
            <Label
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              htmlFor="sender_account_number"
            >
              Your Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sender_account_number"
              value={data.sender_account_number}
              onChange={(e) => setData("sender_account_number", e.target.value)}
              placeholder="Your bank account or e-wallet number"
              required
            />
            {errors.sender_account_number && (
              <FieldError>{errors.sender_account_number}</FieldError>
            )}
          </div>

          <div className="space-y-2">
            <Label
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              htmlFor="payment_amount"
            >
              Payment Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="payment_amount"
              type="number"
              value={data.payment_amount}
              onChange={(e) =>
                setData("payment_amount", parseFloat(e.target.value))
              }
              required
              readOnly
            />
            {errors.payment_amount && (
              <FieldError>{errors.payment_amount}</FieldError>
            )}
          </div>

          <div className="space-y-2">
            <Label
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              htmlFor="payment_date"
            >
              Payment Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="payment_date"
              type="date"
              value={data.payment_date}
              onChange={(e) => setData("payment_date", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
            />
            {errors.payment_date && (
              <FieldError>{errors.payment_date}</FieldError>
            )}
          </div>

          <div className="space-y-2">
            <Label
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              htmlFor="contact_phone"
            >
              Contact Phone
            </Label>
            <Input
              id="contact_phone"
              value={data.contact_phone}
              onChange={(e) => setData("contact_phone", e.target.value)}
              placeholder="Phone number for payment verification"
            />
            {errors.contact_phone && (
              <FieldError>{errors.contact_phone}</FieldError>
            )}
          </div>

          <Button type="submit" isDisabled={processing} className="w-full">
            {processing ? "Uploading..." : "Submit Payment Proof"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
