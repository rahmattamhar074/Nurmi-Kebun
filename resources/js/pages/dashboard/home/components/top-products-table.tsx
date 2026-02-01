import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StarIcon } from "@heroicons/react/24/solid";

interface TopProduct {
  product_id: number;
  product_name: string;
  units_sold: number;
  revenue: number;
  average_rating: number;
}

interface TopProductsTableProps {
  products: TopProduct[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-balance font-semibold text-lg/6">
          Top Selling Products
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Best performing products
        </p>
      </div>
      <div className="rounded-lg border p-4">
        <Table className="[&_tr]:h-14 [&_td]:border-b-0">
          <TableHeader>
            <TableRow>
              <TableColumn className="font-semibold text-muted-fg">
                Product Name
              </TableColumn>
              <TableColumn className="text-right font-semibold text-muted-fg">
                Units Sold
              </TableColumn>
              <TableColumn className="text-right font-semibold text-muted-fg">
                Revenue
              </TableColumn>
              <TableColumn className="text-center font-semibold text-muted-fg">
                Rating
              </TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:nth-child(odd)]:bg-muted/30">
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell className="font-medium">
                  {product.product_name}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {product.units_sold}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(product.revenue)}
                </TableCell>
                <TableCell className="text-center">
                  {product.average_rating > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <StarIcon className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">
                        {product.average_rating.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-fg">No reviews</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
