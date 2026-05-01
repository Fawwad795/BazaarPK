# BazaarPK Figma Screen Inventory

Source file:
- `https://www.figma.com/design/MSboOBKwAg4Q71BHPk42iQ/BazaarPK?node-id=47-2`
- Dev Mode: `https://www.figma.com/design/MSboOBKwAg4Q71BHPk42iQ/BazaarPK?node-id=47-2&m=dev`

Canvas:
- `47:2` - `BazaarPK Prototype`

## Route Mapping (Dark + Light variants)

| Figma Frame | Node ID | App Route | Implementation Status |
|---|---|---|---|
| BazaarPK Login Screen | `1:280` | `/login` | Implemented in `LoginPage.tsx` |
| Registration | `21:2` | `/register` | Implemented in `RegisterPage.tsx` |
| Seller Onboarding Wizard | `22:2` | `/seller/onboarding` | Implemented in `SellerOnboardingPage.tsx` |
| Buyer Home - Product Listing | `24:2` | `/products` | Implemented in `ProductListingPage.tsx` |
| Buyer Product Details | `25:2` | `/products/:productId` | Implemented in `ProductDetailPage.tsx` |
| Buyer Shopping Cart | `26:2` | `/cart` | Implemented in `CartPage.tsx` |
| Buyer Checkout | `27:2` | `/checkout` | Implemented in `CheckoutPage.tsx` |
| Buyer Order Tracking | `28:26` | `/tracking` | Implemented in `TrackingPage.tsx` |
| Buyer Account | `29:2` | `/orders` + `/wishlist` | Implemented as split views |
| BazaarPK Seller Dashboard | `1:2` | `/dashboard` | Implemented in `SellerDashboardPage.tsx` |
| Seller Products List | `30:2` | `/products` (seller filtered) | Covered via listing route |
| Seller Add Product | `31:2` | `/seller/onboarding` (phase-1) | Planned for dedicated page |
| Seller Orders List | `32:2` | `/dashboard/orders` | Implemented in `SellerOrdersPage.tsx` |
| Seller Order Details | `32:157` | `/dashboard/orders` expanded card | Implemented in order details panel |
| Seller Analytics | `33:2` | `/dashboard` analytics section | Implemented in dashboard charts |
| Seller Payments | `33:150` | `/dashboard` payments summary | Planned in next iteration |
| Admin Dashboard | `34:2` | `/admin` | Implemented in `AdminPanelPage.tsx` |
| Admin Seller Verification Queue | `35:2` | `/admin` users tab | Implemented in tabbed admin view |
| Admin Dispute Management | `35:121` | `/admin` disputes tab | Implemented in tabbed admin view |
| Admin Platform Analytics | `36:2` | `/admin` overview cards | Implemented in tabbed admin view |

## Figma Themes

The following light-mode variants are present and mapped to the same routes with theme toggle support:
- Login Light `58:2`
- Registration Light `58:80`
- Seller Onboarding Light `58:110`
- Buyer Listing Light `58:172`
- Buyer Detail Light `58:315`
- Buyer Cart Light `58:393`
- Buyer Checkout Light `58:460`
- Buyer Confirmation Light `58:544`
- Buyer Tracking Light `58:568`
- Buyer Account Light `58:670`
- Seller Dashboard Light `58:767`
- Seller Products Light `58:999`
- Seller Add Product Light `58:1151`
- Seller Orders Light `58:1253`
- Seller Order Detail Light `58:1408`
- Seller Analytics Light `58:1503`
- Seller Payments Light `58:1651`
- Admin Dashboard Light `58:1759`
- Admin Verification Queue Light `58:1902`
- Admin Disputes Light `58:2021`
- Admin Analytics Light `58:2144`
