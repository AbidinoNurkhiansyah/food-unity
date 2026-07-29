# Specs: Products Page UI/UX Redesign

- **Date:** 2026-07-29
- **Topic:** Products Page UI/UX Redesign (Anti-AI-Slop and Premium SaaS visual styling)
- **Status:** Approved

## Objective
Overhaul the Products Management page ([ProductsPage.tsx](file:///c:/programming/react-project/foodunity/src/pages/dashboard/ProductsPage.tsx)) and its subcomponents ([ProductList.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductList.tsx), [ProductTableRow.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductTableRow.tsx), and [ProductEmptyState.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductEmptyState.tsx)) to deliver a highly professional, cohesive dashboard. Replace standard "AI-slop" default layouts with modern minimal card indicators, functional inline search/filtering tools, clean typography, detailed status badges, and polished micro-interactions.

---

## Design Details

### 1. Dynamic KPI Summary Cards
Positioned at the top of the products view (4 columns layout on desktop, responsive 2 columns on mobile):
- **Total Produk**: Total number of surplus products.
- **Listing Aktif**: Count of active items with stock > 0.
- **Habis (Sold Out)**: Count of products where stock <= 0 or status is `sold_out`.
- **Donasi**: Count of products marked as `isDonation = true`.

*Aesthetic Style:* Rounded corners (`rounded-xl`), border outlines (`border border-slate-200/80`), shadow depth (`shadow-sm hover:shadow-md transition-all`), custom icons matching the respective metrics.

### 2. Search & Filtering Toolbar
A unified control toolbar placed directly above the product table:
- **Search Bar**: Text search filtering on title and description, including a search icon, a dynamic results count, and a clear `X` button.
- **Status Tabs**: Fast switching pills/tabs for status:
  - *Semua* (All)
  - *Aktif* (Active status and stock > 0)
  - *Habis* (Sold out / stock = 0)
  - *Kadaluarsa* (Expired deadline / status)
- **Type Filter Pills**: Toggle chips to isolate *Diskon* (Discounted products) and *Donasi* (Donation products).

### 3. Professional Table & Row Enhancements
Upgrades to the product data table layout:
- **Row Styling**: Fine-tuned borders, spacious cell padding, and high-quality hover feedback (`transition-all duration-300 hover:bg-slate-50/60 cursor-pointer`).
- **Product Thumbnail**: Sleek border layout (`rounded-lg border border-slate-100 bg-slate-50`) with fallback package icons.
- **Badges**:
  - `Active` / `DONASI` / `DISKON` / `Expired` / `Sold Out` badges using low-saturation backgrounds with matching text and subtle borders (e.g. `bg-emerald-50 text-emerald-700 border-emerald-100` for active).
- **Actions Panel**: Integrated Ghost edit (blue) and delete (red) buttons with clean hover overlays.

### 4. Skeletons & Empty States
- **Skeleton Loader**: Render 5 rows of shimmering lines (`animate-pulse`) mirroring the actual table cells when `isLoading` is true.
- **Empty State**: Beautiful SVG layout with rounded empty bounds, description, and an attractive action button.

---

## Architectural / Code Impact
1. **[ProductsPage.tsx](file:///c:/programming/react-project/foodunity/src/pages/dashboard/ProductsPage.tsx)**: Refined header styling and layout.
2. **[ProductList.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductList.tsx)**:
   - Calculate metrics from fetched data.
   - Implement state management for `searchQuery`, `statusFilter`, and `typeFilter`.
   - Implement filtering logic before passing rows to rendering.
   - Embed search, filter, and KPI UI layouts.
3. **[ProductTableRow.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductTableRow.tsx)**: Enhance cells, badges, and layouts.
4. **[ProductEmptyState.tsx](file:///c:/programming/react-project/foodunity/src/features/products/components/ProductEmptyState.tsx)**: Polish details and classes.

---

## Spec Verification Checklist
- [x] No placeholders or placeholders are fully defined.
- [x] Clear mapping of files and features.
- [x] Performance considerations: Calculations occur in memory on the client side (fast and efficient for merchant inventories).
