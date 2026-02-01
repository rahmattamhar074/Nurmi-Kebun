import { Flash } from "@/components/flash";
import { Footer } from "@/components/footer";
import { Container } from "@/components/ui/container";
import AppNavbar from "@/layouts/components/app-navbar";
import useCartStore from "@/stores/cart";
import { usePage } from "@inertiajs/react";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { EmailVerificationBanner } from "@/components/banners/email-verification-banner";
import { AddAddressBanner } from "@/components/banners/add-address-banner";
import { SameCityDeliveryBanner } from "@/components/banners/same-city-delivery-banner";

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth } = usePage<any>().props;

  useEffect(() => {
    if (auth?.user?.role === "customer") {
      useCartStore.getState().fetchCart();
    }
  }, [auth?.user?.id]);
  const nonVerifiedUser = auth.user && !auth?.user?.email_verified_at;
  const needAddAddress =
    auth?.user?.email_verified_at &&
    !auth?.user?.has_addresses &&
    auth?.user?.role === "customer";

  return (
    <>
      <Flash />
      <AppNavbar />
      {nonVerifiedUser && <EmailVerificationBanner />}
      {needAddAddress && <AddAddressBanner />}
      <SameCityDeliveryBanner />
      <Container className="py-12 sm:py-24 px-5 xl:px-0 min-h-[calc(100dvh)] flex flex-col">
        <div className="flex-1">{children}</div>
        <div className="lg:w-1/4 w-1/2 rounded-full bg-primary/10 mx-auto h-2 mt-16"></div>
      </Container>
      <Footer />
    </>
  );
}
