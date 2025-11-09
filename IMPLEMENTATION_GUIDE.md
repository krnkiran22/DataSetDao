# DatasetDAO Module 1 Implementation Guide

## ✅ COMPLETED SO FAR

### 1. Core Infrastructure

- ✅ `/lib/cn.ts` - Utility for className merging
- ✅ `/lib/motionVariants.ts` - Framer Motion animation variants
- ✅ `/lib/mockData/datasets.ts` - Mock dataset data with 8 sample datasets

### 2. Marketplace Page (Fully Functional)

- ✅ `/app/marketplace/page.tsx` - Main marketplace layout
- ✅ `/components/features/marketplace/FilterSidebar.tsx` - Complete filter sidebar with:
  - Search input with debouncing
  - Quality score range slider
  - Price range slider
  - Category checkboxes with icons
  - Data size radio buttons
  - Verification checkboxes
  - Active filters display with clear functionality
- ✅ `/components/features/marketplace/DatasetCard.tsx` - Beautiful dataset card with:
  - Dynamic thumbnail generation based on category
  - Certification badges
  - Quality score circular progress
  - Mini metrics display
  - Hover effects and animations
- ✅ `/components/features/marketplace/DatasetGrid.tsx` - Grid with:
  - Filtering logic
  - Sorting (6 options)
  - Pagination (smart page numbers)
  - Empty state
  - Responsive layout

## 📋 REMAINING TASKS

### Priority 1: Dataset Detail Page

**Route:** `/app/dataset/[id]/page.tsx`

**Required Components:**

1. `/components/features/dataset/DatasetHeader.tsx`

   - Breadcrumb navigation
   - Title section
   - Seller card with reputation
   - Tags row
   - Engagement metrics (views, downloads, favorites)

2. `/components/features/dataset/QualityDashboard.tsx`

   - Large circular overall score (180px, animated)
   - 4 metric cards in 2×2 grid (diversity, accuracy, bias, format)
   - Each with small circular chart (80px)
   - Expandable detailed breakdowns
   - Blockchain certification badge

3. `/components/features/dataset/SampleDataPreview.tsx`

   - Tab component (Preview | Schema | Statistics)
   - Table view for tabular data
   - Image grid for image datasets
   - Schema JSON display
   - Statistics charts

4. `/components/features/dataset/TrainingResults.tsx`

   - Aggregate metrics card
   - Results timeline list
   - Performance line chart (use Recharts or Chart.js)
   - Submit results button

5. `/components/features/dataset/LicenseTerms.tsx`

   - License badge
   - Usage rights checklist (green checkmarks)
   - Restrictions list (red X marks)
   - Fingerprinting notice box
   - Expandable full license text

6. `/components/features/dataset/RelatedDatasets.tsx`

   - Horizontal scroll carousel
   - Navigation arrows
   - Smaller dataset cards
   - "View All" link

7. `/components/features/dataset/PurchaseCard.tsx` (STICKY SIDEBAR)

   - Large price display
   - Quality badge
   - Purchase button (opens modal)
   - Add to Cart button
   - Favorite button
   - "What's Included" list
   - Dataset specs rows
   - Seller mini-card
   - Trust badges row
   - Continuous float animation

8. `/components/features/dataset/PurchaseModal.tsx`
   - Framer Motion AnimatePresence
   - Order summary
   - License agreement checkbox
   - Wallet connection section
   - Payment method selection
   - Confirm/Cancel buttons
   - Success state with animated checkmark

**Implementation Steps:**

```typescript
// 1. Create the dynamic route page
// app/dataset/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { mockDatasets } from "@/lib/mockData/datasets";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
// Import all dataset components...

export default function DatasetDetailPage() {
  const params = useParams();
  const dataset = mockDatasets.find((d) => d.id === params.id);

  if (!dataset) {
    return <div>Dataset not found</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-12">
          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column (2/3 width) */}
            <div className="lg:col-span-2 space-y-16">
              <DatasetHeader dataset={dataset} />
              <QualityDashboard dataset={dataset} />
              <SampleDataPreview dataset={dataset} />
              <TrainingResults dataset={dataset} />
              <LicenseTerms dataset={dataset} />
              <RelatedDatasets currentId={dataset.id} />
            </div>

            {/* Right column (1/3 width) - Sticky */}
            <div className="lg:col-span-1">
              <PurchaseCard dataset={dataset} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

### Priority 2: Upload Page (Multi-Step Wizard)

**Route:** `/app/upload/page.tsx`

**Required Components:**

1. `/components/features/upload/StepIndicator.tsx`

   - 5 step circles with connecting lines
   - Completed/Current/Upcoming states
   - Smooth progress animation

2. `/components/features/upload/steps/UploadFileStep.tsx`

   - Dropzone (drag & drop or click)
   - File validation
   - File preview card
   - Progress bar
   - Upload tips card

3. `/components/features/upload/steps/MetadataStep.tsx`

   - Two-column form layout
   - All required fields (name, description, category, sample size, format, license, pricing)
   - Real-time validation
   - Auto-save draft functionality
   - Character counters

4. `/components/features/upload/steps/EncryptionStep.tsx`

   - Large progress bar with percentage
   - 3 status items (Encrypting, Uploading, Storing)
   - Animated particles along progress bar
   - Technical details card
   - Success/Error states

5. `/components/features/upload/steps/VerificationStep.tsx`

   - Animated brain/CPU loader
   - 2×2 grid of analysis modules
   - Real-time logs (expandable)
   - Score reveal animation
   - Confetti on completion

6. `/components/features/upload/steps/ReviewStep.tsx`
   - Two-column layout (summary + options)
   - Quality certificate display
   - Listing options (visibility, marketplace placement, auto-update)
   - Preview button
   - List/Save Draft buttons
   - Success modal

**Implementation Pattern:**

```typescript
// app/upload/page.tsx
"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/features/upload/StepIndicator";
import { UploadFileStep } from "@/components/features/upload/steps/UploadFileStep";
// Import other steps...

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadData, setUploadData] = useState({
    file: null,
    metadata: {},
    // etc.
  });

  const steps = [
    { number: 1, name: "Upload", component: UploadFileStep },
    { number: 2, name: "Metadata", component: MetadataStep },
    { number: 3, name: "Encrypting", component: EncryptionStep },
    { number: 4, name: "Verification", component: VerificationStep },
    { number: 5, name: "Listing", component: ReviewStep },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-base pt-24 pb-32">
        <div className="max-w-5xl mx-auto px-6">
          <StepIndicator currentStep={currentStep} steps={steps} />

          <div className="mt-12">
            <CurrentStepComponent
              data={uploadData}
              setData={setUploadData}
              onNext={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
              onBack={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            />
          </div>

          {/* Navigation Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-background-overlay/95 backdrop-blur-md border-t border-accent-pink/20 py-4">
            <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
              <span className="text-sm text-foreground-secondary">
                Step {currentStep} of 5
              </span>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                >
                  {currentStep === 5 ? "List Dataset" : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

### Priority 3: Reusable UI Components

**1. Modal Component** (`/components/ui/Modal.tsx`)

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

// Use AnimatePresence for smooth enter/exit
// Backdrop click to close
// ESC key to close
// Size variants: sm(400px), md(600px), lg(800px), xl(1000px)
```

**2. Tabs Component** (`/components/ui/Tabs.tsx`)

```typescript
interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  defaultTab?: string;
}

// Horizontal tab buttons
// Animated underline (slides to active tab)
// Content area with AnimatePresence transitions
```

**3. Dropdown Component** (`/components/ui/Dropdown.tsx`)

```typescript
interface DropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Custom styled with pink theme
// Keyboard navigation
// Search functionality for long lists
```

**4. Checkbox Component** (`/components/ui/Checkbox.tsx`)

```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

// Pink accent when checked
// White checkmark icon
// Smooth animation
```

**5. Radio Component** (`/components/ui/Radio.tsx`)

```typescript
interface RadioProps {
  name: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

// Pink filled dot when selected
// Group component for multiple radios
```

**6. Toast Component** (`/components/ui/Toast.tsx`)

```typescript
interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

// Position: top-right
// Auto-dismiss with progress bar
// Icon based on type
// Slide in animation
// Stack multiple toasts
```

**7. Skeleton Component** (`/components/ui/Skeleton.tsx`)

```typescript
// Shimmer animation (gradient moving left to right)
// Variants: card, text, circle, rectangle
// Match component dimensions
```

**8. Badge Component** (`/components/ui/Badge.tsx`)

```typescript
interface BadgeProps {
  variant: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

// Pill shape (rounded-full)
// Small text
// Optional icon (left side)
```

### Priority 4: Placeholder Pages

Create simple placeholder layouts for:

1. `/app/dashboard/page.tsx`
2. `/app/profile/page.tsx`
3. `/app/bounties/page.tsx`
4. `/app/analytics/page.tsx`

**Template for Placeholders:**

```typescript
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PlaceholderPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* Large Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-magenta flex items-center justify-center">
              {/* SVG Icon Here */}
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Page Title
            </h1>

            {/* Description */}
            <p className="text-xl text-foreground-secondary mb-8">
              Brief description of what this page will contain
            </p>

            {/* Coming Soon Badge */}
            <div className="inline-block px-6 py-3 bg-accent-pink/10 border border-accent-pink/30 rounded-full mb-12">
              <span className="text-accent-pink font-semibold">
                🚀 Coming Soon
              </span>
            </div>

            {/* Mock Preview */}
            <div className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-8 mb-8">
              {/* Mock content like stat cards, charts, etc. */}
            </div>

            {/* CTA Button */}
            <Link href="/marketplace">
              <button className="px-8 py-4 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200">
                Browse Marketplace
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

## 🎨 DESIGN SYSTEM REFERENCE

### Colors (Use Tailwind Classes)

```typescript
// Backgrounds
bg - background - base; // #0A0A0F
bg - background - elevated; // #13131A
bg - background - surface; // #1A1A24
bg - background - overlay; // #0A0A0F (with opacity)

// Text
text - foreground - primary; // #FFFFFF
text - foreground - secondary; // #B4B4B4
text - foreground - tertiary; // #808080
text - foreground - disabled; // #4D4D4D

// Accents
bg - accent - pink; // #E6007A
bg - accent - magenta; // #FF006B
bg - accent - mesh; // #FF0080
bg - accent - orange; // #FF6B35
bg - accent - green; // #22C55E
bg - accent - red; // #EF4444
bg - accent - teal; // #14B8A6

// Borders
border - border - subtle; // #1F1F2E
border - border - DEFAULT; // #2E2E3F
border - border - strong; // #3D3D50

// Effects
shadow - glow - pink;
shadow - glow - magenta;
shadow - sm - glow - pink;
```

### Typography

```typescript
// Font Families
font-display            // For headings
font-body               // For body text
font-mono               // For code

// Sizes
text-5xl font-bold      // Page titles
text-3xl font-semibold  // Section headings
text-xl                 // Subheadings
text-base               // Body text
text-sm                 // Small text
text-xs                 // Captions
```

### Spacing (8pt Grid)

```typescript
gap - 2; // 8px
gap - 4; // 16px
gap - 6; // 24px
gap - 8; // 32px
gap - 12; // 48px
gap - 16; // 64px

p - 4; // 16px padding
p - 6; // 24px padding
p - 8; // 32px padding
p - 10; // 40px padding

mt - 8; // 32px margin-top
mt - 12; // 48px margin-top
mt - 16; // 64px margin-top
```

### Components

```typescript
// Glass Card
className =
  "bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-6";

// Button Primary
className =
  "px-8 py-4 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200";

// Button Secondary
className =
  "px-8 py-4 bg-transparent border-2 border-accent-pink/40 text-white rounded-full font-semibold hover:bg-accent-pink/10 hover:border-accent-pink transition-all duration-200";

// Input
className =
  "w-full px-4 py-3 bg-background-elevated border border-border-DEFAULT rounded-lg text-foreground-primary placeholder:text-foreground-tertiary focus:border-accent-pink focus:outline-none focus:ring-2 focus:ring-accent-pink/20 transition-all";
```

### Animations

```typescript
// Fade in on scroll
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.3 }}
transition={{ duration: 0.6 }}

// Hover lift
whileHover={{ y: -4 }}
transition={{ duration: 0.2 }}

// Stagger children
variants={{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}}
```

## 📦 DEPENDENCIES NEEDED

```bash
# Already installed:
npm install framer-motion lucide-react three @react-three/fiber @react-three/drei clsx tailwind-merge

# May need for charts:
npm install recharts
# or
npm install chart.js react-chartjs-2

# For file upload:
npm install react-dropzone
```

## 🚀 NEXT STEPS

1. **Start with Dataset Detail Page** - This is the most important user flow after marketplace
2. **Build PurchaseCard and Modal** - Critical for transactions
3. **Create Upload Wizard** - Complex but essential
4. **Add Reusable UI Components** - As needed to support above
5. **Create Placeholder Pages** - Quick wins to show complete site
6. **Testing & Polish** - Ensure everything works smoothly

## 💡 TIPS

- **Reuse existing components**: Button, GlassCard, Input, StatCard
- **Copy patterns from landing page**: Same animation style, same spacing
- **Use mock data creatively**: Extend mockDatasets with more fields as needed
- **Test responsive**: Every component should work on mobile
- **Keep it consistent**: Same pink theme, same glassmorphism everywhere

## ✅ SUCCESS CRITERIA

- ✅ All 7 routes are navigable from Navbar
- ✅ Marketplace filters work correctly
- ✅ Dataset detail page shows all information
- ✅ Purchase flow is complete (even if not connected to backend)
- ✅ Upload wizard has all 5 steps
- ✅ Everything uses the pink/magenta theme
- ✅ All animations are smooth (60fps)
- ✅ Mobile responsive throughout
- ✅ No TypeScript errors
- ✅ Production-grade quality matching landing page

---

**Good luck building! You have all the patterns and examples you need. Just follow the structure and maintain the quality standard.** 🚀
