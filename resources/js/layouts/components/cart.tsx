"use client";

import React from "react";
import { buttonStyles } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IconShoppingBag } from "@intentui/icons";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import CartItem from "./cart-item";
import { useCart, useCartCount } from "@/stores/cart";
import { router } from "@inertiajs/react";

export function CartPopover() {
  const cartCount = useCartCount();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleNavigate = () => {
      setIsOpen(false);
    };

    const removeListener = router.on("navigate", handleNavigate);

    return () => {
      removeListener();
    };
  }, []);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <div className="relative">
        <Button intent="plain" size="sq-sm" aria-label="Your Bag">
          <IconShoppingBag />
        </Button>
        {cartCount > 0 && (
          <Badge
            intent="success"
            className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 text-xs px-1 py-0 flex items-center justify-center"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </Badge>
        )}
      </div>
      <PopoverContent className="max-w-lg w-full">
        <PopoverHeader>
          <PopoverTitle>My Cart</PopoverTitle>
          <PopoverDescription>
            Review your items before proceeding to checkout.
          </PopoverDescription>
        </PopoverHeader>
        <PopoverBody className="w-full max-h-[400px] overflow-y-auto">
          <CartContent />
        </PopoverBody>
        <PopoverFooter className="w-full">
          <CartFooter />
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

export function CartDrawer() {
  const cartCount = useCartCount();

  return (
    <Drawer>
      <DrawerTrigger
        className={buttonStyles({ intent: "plain", size: "sq-sm" })}
      >
        <div className="relative">
          <IconShoppingBag />
          {cartCount > 0 && (
            <Badge
              intent="danger"
              className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 text-xs px-1 py-0 flex items-center justify-center"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </Badge>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>My Cart</DrawerTitle>
          <DrawerDescription>
            Review your items before proceeding to checkout.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <CartContent />
        </DrawerBody>
        <DrawerFooter>
          <CartFooter />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const CartContent = () => {
  const { items, isLoading, validateCartStock } = useCart();

  React.useEffect(() => {
    if (items.length > 0) {
      const hasInvalidItems = items.some(
        (item) => item.quantity > item.product.stock || item.product.stock === 0
      );
      if (hasInvalidItems) {
        const timer = setTimeout(() => validateCartStock(), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [items, validateCartStock]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          Loading cart...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="text-neutral-400 dark:text-neutral-600 mb-3">
          <IconShoppingBag className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
          Your cart is empty
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Add some products to get started
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto w-full">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const CartFooter = () => {
  const { items, summary, clearCart, validateCartStock } = useCart();

  const hasStockIssues = items.some(
    (item) => item.quantity > item.product.stock || item.product.stock === 0
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 min-w-[250px]">
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Subtotal
          </span>
          <span className="font-medium">{formatPrice(summary.subtotal)}</span>
        </div>

        <div className="flex justify-between text-base font-semibold border-t border-neutral-200 dark:border-neutral-700 pt-2">
          <span>Total</span>
          <span>{formatPrice(summary.total)}</span>
        </div>
      </div>

      {hasStockIssues && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
          <p className="text-yellow-800 dark:text-yellow-300 text-xs font-medium mb-2">
            ⚠️ Some items exceed available stock
          </p>
          <Button
            intent="secondary"
            size="sm"
            onClick={validateCartStock}
            className="w-full text-xs"
          >
            Fix Cart Issues
          </Button>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          intent="outline"
          size="sm"
          onClick={clearCart}
          className="flex-1"
        >
          Clear Cart
        </Button>
        <Button
          intent="primary"
          size="sm"
          className="flex-1"
          isDisabled={hasStockIssues}
          onPress={() => {
            router.visit(route("checkout.index"));
          }}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};
