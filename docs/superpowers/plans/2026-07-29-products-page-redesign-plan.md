# Products Page UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Products Page dashboard with dynamic KPI cards, search/filter toolbar, enhanced table rows, and premium skeletons.

**Architecture:** Implement client-side filtering, state management, and summary metric aggregation on the `products` array inside the product list component. Upgrade the components' CSS classes using Tailwind CSS v4 styling.

**Tech Stack:** React, Tailwind CSS v4, Lucide Icons, Radix UI.

## Global Constraints
- Follow clean coding practices: no placeholder comments (e.g. `// TODO: add logic`).
- Style using Tailwind v4 theme variables to match the existing merchant bento design (Inter, border-slate-200/80, shadow-sm, hover:shadow-md transition).
- Ensure typescript types compile successfully without warnings.

---

### Task 1: ProductsPage Wrapper Enhancement

**Files:**
- Modify: `src/pages/dashboard/ProductsPage.tsx`

**Interfaces:**
- Consumes: `useProductManagement` hooks, `@/features/products` components.
- Produces: Enhanced page header container and alert dialog layout.

- [ ] **Step 1: Update ProductsPage header layout**
  Modify [ProductsPage.tsx](file:///c:/programming/react-project/foodunity/src/pages/dashboard/ProductsPage.tsx) to improve typography, adjust margin, and add padding to make it match the clean merchant bento layout. Update layout and typography size hierarchy.
  
  *Code changes in [ProductsPage.tsx](file:///c:/programming/react-project/foodunity/src/pages/dashboard/ProductsPage.tsx):*
  ```tsx
  // ... imports remain the same
  export function ProductsPage() {
    // hooks remain the same
    return (
      <div className="w-full px-6 py-6 font-sans bg-slate-50/30 min-h-screen">
        <header className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white shadow-sm border border-slate-200/60 text-slate-600 rounded-full text-xs font-semibold mb-4 transition-all hover:border-slate-300">
            <Package className="w-3.5 h-3.5 text-palette-600 animate-pulse" />
            <span>Manajemen Stok</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
            Kelola Produk Surplus
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            Pantau dan distribusikan makanan surplus Anda ke publik sebagai diskon atau donasi sosial untuk mengurangi limbah makanan.
          </p>
        </header>
        // ... remainder stays the same
      </div>
    );
  }
  ```

- [ ] **Step 2: Run type check**
  Run: `npx tsc --noEmit`
  Expected: Success with no errors.

- [ ] **Step 3: Commit**
  ```bash
  git add src/pages/dashboard/ProductsPage.tsx
  git commit -m "feat(products): enhance header UI on ProductsPage"
  ```

---

### Task 2: Implement Dynamic KPI Summary Cards

**Files:**
- Modify: `src/features/products/components/ProductList.tsx`

**Interfaces:**
- Consumes: Fetched `products` list.
- Produces: Aggregated KPI metrics display at the top of the list.

- [ ] **Step 1: Calculate metrics in ProductList**
  Add calculations for statistics in [ProductList.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductList.tsx):
  ```tsx
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active' && p.stock > 0).length;
  const soldOutProducts = products.filter(p => p.status === 'sold_out' || p.stock <= 0).length;
  const donationProducts = products.filter(p => p.isDonation).length;
  ```

- [ ] **Step 2: Render KPI Summary Cards section**
  Display a 4-column responsive grid above the table. Style each card with custom icons (Package, Activity, Flame, ShieldAlert) and hover lift effects.
  
  *Layout structure:*
  ```tsx
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {/* Card 1: Total */}
    {/* Card 2: Aktif */}
    {/* Card 3: Habis */}
    {/* Card 4: Donasi */}
  </div>
  ```

- [ ] **Step 3: Run type check**
  Run: `npx tsc --noEmit`
  Expected: Success with no errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/features/products/components/ProductList.tsx
  git commit -m "feat(products): add dynamic KPI stats cards to product list"
  ```

---

### Task 3: Add Search and Filter State & Toolbar Controls

**Files:**
- Modify: `src/features/products/components/ProductList.tsx`

**Interfaces:**
- Consumes: local state hooks (`searchQuery`, `statusFilter`, `typeFilter`).
- Produces: Filtered products array passing down to row rendering.

- [ ] **Step 1: Add state declarations in ProductList**
  Add the following local state variables:
  ```tsx
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'sold_out' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'discount' | 'donation'>('all');
  ```

- [ ] **Step 2: Add filtering logic**
  Compute filtered product listings:
  ```tsx
  const filteredProducts = products.filter((product) => {
    // 1. Search Query Filter
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Status Filter
    const isExpired = product.pickupDeadline
      ? new Date(product.pickupDeadline).getTime() <= Date.now()
      : false;
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = product.status === 'active' && product.stock > 0 && !isExpired;
    } else if (statusFilter === 'sold_out') {
      matchesStatus = product.status === 'sold_out' || product.stock <= 0;
    } else if (statusFilter === 'expired') {
      matchesStatus = product.status === 'expired' || isExpired;
    }

    // 3. Type Filter
    let matchesType = true;
    if (typeFilter === 'discount') {
      matchesType = !product.isDonation;
    } else if (typeFilter === 'donation') {
      matchesType = product.isDonation;
    }

    return matchesSearch && matchesStatus && matchesType;
  });
  ```

- [ ] **Step 3: Implement search input and segmented tabs toolbar UI**
  Add search bar and filter controls below the KPI section, styled nicely with spacing and hover pill animations.
  
- [ ] **Step 4: Run type check**
  Run: `npx tsc --noEmit`
  Expected: Success with no errors.

- [ ] **Step 5: Commit**
  ```bash
  git add src/features/products/components/ProductList.tsx
  git commit -m "feat(products): implement search and status/type filter toolbar"
  ```

---

### Task 4: Upgrade Table Header and Table Row Components

**Files:**
- Modify: `src/features/products/components/ProductTableRow.tsx`
- Modify: `src/features/products/components/ProductList.tsx`

**Interfaces:**
- Consumes: Single `product` object, callbacks for `onEditClick` and `onDeleteClick`.
- Produces: Polished Table cells, badges, and layout inside table body.

- [ ] **Step 1: Refactor Table Headers**
  Stylize `<TableHeader>` in [ProductList.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductList.tsx): uppercase labels, extra-wide tracking, and border accents.
  
- [ ] **Step 2: Upgrade ProductTableRow cells**
  Overhaul [ProductTableRow.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductTableRow.tsx):
  - Enhance row hover transition `hover:bg-slate-50/60 transition-colors`.
  - Refine item details layout, descriptions, and thumbnails.
  - Style status badges with lower-saturation colors and explicit borders.
  - Redesign type tags (`DONASI` and `DISKON`) with soft tints.
  - Format price listings clean and bold.
  - Clean up actions (ghost style edit/delete buttons with subtle hover scales).

- [ ] **Step 3: Run type check**
  Run: `npx tsc --noEmit`
  Expected: Success with no errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/features/products/components/ProductTableRow.tsx src/features/products/components/ProductList.tsx
  git commit -m "feat(products): redesign table row cell typography and badges"
  ```

---

### Task 5: Enhance Skeletons & Empty State Layouts

**Files:**
- Modify: `src/features/products/components/ProductList.tsx`
- Modify: `src/features/products/components/ProductEmptyState.tsx`

**Interfaces:**
- Consumes: `isLoading` flag.
- Produces: Pulsating skeleton indicators and a visual empty panel.

- [ ] **Step 1: Implement custom skeleton row layout**
  In [ProductList.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductList.tsx), write a dynamic skeleton loading screen (pulsing row mockups using `animate-pulse` animations) that match the table's dimensions.
  
- [ ] **Step 2: Redesign ProductEmptyState**
  Refine [ProductEmptyState.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductEmptyState.tsx) to make the empty state box look highly engaging (soft background borders, modern typography spacing, and high-quality Lucide indicators).
  
- [ ] **Step 3: Run type check**
  Run: `npx tsc --noEmit`
  Expected: Success with no errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/features/products/components/ProductEmptyState.tsx src/features/products/components/ProductList.tsx
  git commit -m "feat(products): improve empty states and skeleton loading screens"
  ```
