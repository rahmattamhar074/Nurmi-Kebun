"use client";

import type { Product } from "@/types/product";
import ProductItem from "./product-item";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import { useState } from "react";
import ProductDetail from "./product-detail";
import { EmptyState } from "@/components/ui/empty-state";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  return (
    <>
      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filter criteria"
        />
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
          {selectedProduct && (
            <DynamicDialog
              isOpen={open}
              onOpenChange={setOpen}
              size="3xl"
              title={selectedProduct.name}
              description={
                selectedProduct.description || "Explore Product Detail"
              }
            >
              <div className="max-h-[calc(100vh-4rem)] lg:max-h-[calc(100vh-8rem)] overflow-y-auto">
                <ProductDetail product={selectedProduct} />
              </div>
            </DynamicDialog>
          )}
        </div>
      )}
    </>
  );
}

export default ProductGrid;
