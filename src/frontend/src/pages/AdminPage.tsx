import type { Product } from "@/backend";
import { ExternalBlob } from "@/backend";
import Footer from "@/components/Footer";
import NavOverlay from "@/components/NavOverlay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin, useProducts, useStats } from "@/hooks/useQueries";
import BrandStripSection from "@/sections/BrandStripSection";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, LogIn, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  variants: string;
  featured: boolean;
}

const emptyForm: ProductFormData = {
  name: "",
  price: "",
  description: "",
  category: "womenswear",
  imageUrl: "",
  videoUrl: "",
  variants: "XS, S, M, L, XL",
  featured: false,
};

export default function AdminPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: stats } = useStats();
  const { actor } = useActor();
  const { login, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      imageUrl: product.image.getDirectURL(),
      videoUrl: product.videoUrl,
      variants: product.variants.join(", "),
      featured: product.featured,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const productData: Product = {
        id: editProduct?.id ?? `p${Date.now()}`,
        name: form.name,
        price: Number.parseFloat(form.price),
        description: form.description,
        category: form.category,
        image: ExternalBlob.fromURL(form.imageUrl),
        videoUrl: form.videoUrl,
        variants: form.variants
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        featured: form.featured,
        createdAt: editProduct?.createdAt ?? BigInt(Date.now()),
      };

      if (editProduct) {
        await actor.updateProduct(productData);
        toast.success("Product updated");
      } else {
        await actor.createProduct(productData);
        toast.success("Product created");
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!actor) return;
    setDeletingId(productId);
    try {
      await actor.deleteProduct(productId);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[oklch(var(--foreground))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-sm text-[oklch(var(--muted-foreground))]">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <main className="min-h-screen bg-white">
        <NavOverlay />
        <div className="flex items-center justify-center min-h-screen px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm"
            data-ocid="admin.panel"
          >
            <div className="w-16 h-16 rounded-2xl bg-[oklch(var(--cream-dark))] flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-7 h-7 text-[oklch(var(--foreground))]" />
            </div>
            <h1 className="font-serif text-3xl text-[oklch(var(--foreground))] mb-3">
              Admin Access
            </h1>
            <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] mb-8">
              Please log in to access the content management panel.
            </p>
            <Button
              onClick={login}
              disabled={loginStatus === "logging-in"}
              className="rounded-full bg-[oklch(var(--foreground))] text-white px-8 py-3 font-sans text-xs uppercase tracking-widest hover:opacity-80 transition-all"
              data-ocid="admin.primary_button"
            >
              {loginStatus === "logging-in" ? "Connecting..." : "Log In"}
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-white">
        <NavOverlay />
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-sm" data-ocid="admin.error_state">
            <h1 className="font-serif text-3xl text-[oklch(var(--foreground))] mb-3">
              Access Denied
            </h1>
            <p className="font-sans text-sm text-[oklch(var(--muted-foreground))]">
              You do not have admin privileges for this store.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <NavOverlay />

      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl text-[oklch(var(--foreground))]">
              Content Manager
            </h1>
            <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] mt-1">
              Manage your STORIES product catalogue
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="rounded-full bg-[oklch(var(--foreground))] text-white px-6 py-2.5 font-sans text-xs uppercase tracking-widest hover:opacity-80 transition-all"
            data-ocid="admin.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              {
                label: "Total Products",
                value: String(stats.totalProducts),
                icon: BarChart3,
              },
              {
                label: "Featured",
                value: String(stats.featuredProducts),
                icon: BarChart3,
              },
              {
                label: "Total Orders",
                value: String(stats.totalOrders),
                icon: BarChart3,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[oklch(var(--cream))] rounded-2xl p-6 border border-[oklch(var(--border))]"
                data-ocid="admin.card"
              >
                <p className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-2">
                  {stat.label}
                </p>
                <p className="font-serif text-4xl text-[oklch(var(--foreground))]">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        <div
          className="bg-white rounded-2xl border border-[oklch(var(--border))] overflow-hidden"
          data-ocid="admin.table"
        >
          <div className="p-6 border-b border-[oklch(var(--border))]">
            <h2 className="font-sans font-medium text-[oklch(var(--foreground))]">
              Products
            </h2>
          </div>
          {loadingProducts ? (
            <div className="p-12 text-center" data-ocid="admin.loading_state">
              <div className="w-8 h-8 border-2 border-[oklch(var(--foreground))] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : products?.length === 0 ? (
            <div className="p-12 text-center" data-ocid="admin.empty_state">
              <p className="font-sans text-sm text-[oklch(var(--muted-foreground))]">
                No products yet. Add your first product.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans text-xs uppercase tracking-widest">
                    Product
                  </TableHead>
                  <TableHead className="font-sans text-xs uppercase tracking-widest">
                    Category
                  </TableHead>
                  <TableHead className="font-sans text-xs uppercase tracking-widest">
                    Price
                  </TableHead>
                  <TableHead className="font-sans text-xs uppercase tracking-widest">
                    Featured
                  </TableHead>
                  <TableHead className="font-sans text-xs uppercase tracking-widest text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product, i) => (
                  <TableRow key={product.id} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image.getDirectURL()}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg"
                        />
                        <span className="font-sans text-sm font-medium truncate max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-sans text-xs">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-sans text-sm">
                        ${product.price.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.featured
                            ? "bg-[oklch(var(--pastel-sage))] text-[oklch(var(--foreground))] font-sans text-xs"
                            : "font-sans text-xs"
                        }
                        variant={product.featured ? "default" : "outline"}
                      >
                        {product.featured ? "Featured" : "Standard"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(product)}
                          className="w-8 h-8 rounded-full hover:bg-[oklch(var(--cream-dark))]"
                          data-ocid={`admin.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <BrandStripSection />
      <Footer />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-lg bg-white border-[oklch(var(--border))]"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editProduct ? "Edit Product" : "New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1.5 block">
                  Product Name
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Obsidian Cashmere Coat"
                  className="rounded-xl font-sans"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1.5 block">
                  Price ($)
                </Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="1290"
                  className="rounded-xl font-sans"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1.5 block">
                  Category
                </Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="womenswear"
                  className="rounded-xl font-sans"
                  data-ocid="admin.input"
                />
              </div>
              <div className="col-span-2">
                <Label className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1.5 block">
                  Description
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="A masterpiece of minimal tailoring..."
                  className="rounded-xl font-sans resize-none"
                  rows={3}
                  data-ocid="admin.textarea"
                />
              </div>
              <div className="col-span-2">
                <Label className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1.5 block">
                  Image URL
                </Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="rounded-xl font-sans"
                  data-ocid="admin.input"
                />
              </div>
              <div className="col-span-2">
                <Label className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1.5 block">
                  Video URL
                </Label>
                <Input
                  value={form.videoUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, videoUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  className="rounded-xl font-sans"
                  data-ocid="admin.input"
                />
              </div>
              <div className="col-span-2">
                <Label className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1.5 block">
                  Variants (comma-separated)
                </Label>
                <Input
                  value={form.variants}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, variants: e.target.value }))
                  }
                  placeholder="XS, S, M, L, XL"
                  className="rounded-xl font-sans"
                  data-ocid="admin.input"
                />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, featured: checked }))
                  }
                  data-ocid="admin.switch"
                />
                <Label className="font-sans text-sm cursor-pointer">
                  Featured product
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full font-sans text-xs uppercase tracking-widest"
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name || !form.price}
              className="rounded-full bg-[oklch(var(--foreground))] text-white font-sans text-xs uppercase tracking-widest hover:opacity-80 transition-all"
              data-ocid="admin.save_button"
            >
              {saving ? "Saving..." : editProduct ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
