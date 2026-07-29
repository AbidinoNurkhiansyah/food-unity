# Design Spec: Consumer Reusable Sticky Header

Date: 2026-07-29
Status: Proposed

## Objective
Remove `ExploreHeader` from transaction-focused consumer pages (`CartPage` and `MyOrdersPage`) and implement a unified, reusable, sticky page header containing a back button and the page title. This ensures consistency and prevents the user from needing to scroll back to the top of the page to navigate back.

## Current State
- `CartPage.tsx`: Uses a custom sticky header directly inside the page component. Does not render `ExploreHeader`.
- `MyOrdersPage.tsx`: Renders `ExploreHeader` (with logo, search link, notification link, cart, and profile/logout options) and has a separate, non-sticky page title container inside `<main>`.

## Proposed Design

### 1. Reusable Component: `ConsumerPageHeader`
We will create a new component `ConsumerPageHeader` at [ConsumerPageHeader.tsx](file:///C:/programming/react-project/foodunity/src/components/layout/ConsumerPageHeader.tsx).

```typescript
interface ConsumerPageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  backTo?: string; // Route path to navigate back, e.g. "/explore"
  onBack?: () => void; // Custom click handler
}
```

**Visual Styling:**
- Background color: White (`bg-white`)
- Sticky positioning: `sticky top-0 z-30`
- Border & shadow: bottom border (`border-b border-gray-100`) and slight shadow (`shadow-sm`)
- Height: `h-16` (64px) matching standard top bars.
- Padding: `px-4 sm:px-6 lg:px-[130px]` to maintain layout alignment with main content grids.

### 2. Integration Plan
1. **Create** the [ConsumerPageHeader.tsx](file:///C:/programming/react-project/foodunity/src/components/layout/ConsumerPageHeader.tsx) file.
2. **Refactor** [CartPage.tsx](file:///C:/programming/react-project/foodunity/src/pages/consumer/CartPage.tsx) to import and render the `ConsumerPageHeader` component instead of its custom inline header.
3. **Refactor** [MyOrdersPage.tsx](file:///C:/programming/react-project/foodunity/src/pages/consumer/MyOrdersPage.tsx) to:
   - Remove the `<ExploreHeader />` component.
   - Remove the existing non-sticky title section inside `<main>`.
   - Render the `ConsumerPageHeader` at the top of the page container.

## Trade-offs and Considerations
- **Pros**: Clearer user flow, cleaner UI, uniform header layout across transaction pages, eliminates duplicate inline styling, improves code reuse.
- **Cons**: Users will have to go back to `/explore` to access global navbar actions (like profile, cart badge, or logout) when they are in `MyOrdersPage` or `CartPage`. This is standard practice in checkout/transaction flows.
