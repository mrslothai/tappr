# QR Connect - Responsive QA Report
**Date:** 2026-02-17  
**Tester:** Sloth  
**Live URL:** https://qr-connect-lake.vercel.app

---

## CRITICAL ISSUES (Must Fix)

### 1. Dashboard Header - Horizontal Scroll on Mobile
**File:** `app/dashboard/page.tsx`  
**Line:** ~271  
**Severity:** CRITICAL  
**Issue:** Header button container has `overflow-x-auto` which causes horizontal scroll on mobile when buttons don't fit.

```tsx
// Current (BROKEN):
<div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto">
```

**Fix Required:**
- Remove `overflow-x-auto`
- Make buttons responsive with proper wrapping OR hide text labels on mobile
- Test at 375px, 360px viewports
- Buttons should NEVER cause horizontal scroll

**Suggested Solution:**
```tsx
<div className="flex items-center gap-2 flex-wrap justify-end">
  {!isPro && (
    <Link href="/pricing">
      <Button size="sm" className="bg-gradient-to-r from-primary-600 to-purple-600">
        Upgrade
      </Button>
    </Link>
  )}
  <Link href="/dashboard/analytics">
    <Button variant="ghost" size="sm">
      <BarChart3 className="w-4 h-4" />
      <span className="hidden md:inline ml-2">Analytics</span>
    </Button>
  </Link>
  {/* ... same pattern for other buttons */}
</div>
```

---

### 2. QR Code Too Large on Mobile
**File:** `app/dashboard/page.tsx`  
**Line:** ~485  
**Severity:** HIGH  
**Issue:** Fixed 256px QR code is too large for mobile screens (375px width - padding = ~330px usable)

**Current:**
```tsx
<BrandedQR
  id="qr-code-container"
  value={profileUrl}
  size={256}
/>
```

**Fix Required:**
```tsx
<div className="w-full max-w-[256px] mx-auto">
  <BrandedQR
    id="qr-code-container"
    value={profileUrl}
    size={256}
    className="w-full h-auto"
  />
</div>
```

OR make it responsive:
```tsx
<BrandedQR
  id="qr-code-container"
  value={profileUrl}
  size={window.innerWidth < 640 ? 200 : 256}
/>
```

---

### 3. Link URL Overflow in Dashboard
**File:** `app/dashboard/page.tsx`  
**Line:** ~362  
**Severity:** MEDIUM  
**Issue:** Long URLs in link list can overflow container

**Current:**
```tsx
<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
```

**Fix:** Already has `truncate` but parent needs `min-w-0`:
```tsx
<div className="flex-1 min-w-0">
  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
    {link.platform}
  </p>
  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
    {link.url}
  </p>
</div>
```

---

## MEDIUM ISSUES (Should Fix)

### 4. Profile Preview Links Overflow
**File:** `app/dashboard/page.tsx`  
**Line:** ~574  
**Severity:** MEDIUM  
**Issue:** Preview link buttons in live preview might overflow on small screens

**Current:**
```tsx
<div className="space-y-3">
  {links.map((link) => (
    <div
      key={link.id}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white ${...}`}
    >
```

**Fix:** Add word-break:
```tsx
<div
  key={link.id}
  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white break-words ${...}`}
>
```

---

### 5. Container Padding Consistency
**File:** `app/page.tsx` + `app/dashboard/page.tsx`  
**Severity:** LOW  
**Issue:** Some sections use `px-4`, others use varying padding. Should be consistent.

**Recommendation:**
- Mobile: `px-4` (16px)
- Tablet+: `px-6 md:px-8`
- Desktop: Container max-width already applied

---

### 6. Homepage Stats Bar on Mobile
**File:** `app/page.tsx`  
**Line:** ~233  
**Severity:** LOW  
**Issue:** Stats bar grid on mobile (2 columns) might look cramped with 4 items

**Current:**
```tsx
<div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-6 md:gap-16 text-center">
```

**Suggestion:** Consider stacking vertically on very small screens:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row justify-center items-center gap-6 md:gap-16 text-center">
```

---

## LOW PRIORITY (Nice to Have)

### 7. Button Touch Targets
**Severity:** LOW  
**Issue:** Some icon-only buttons might be too small for touch (minimum 44x44px recommended)

**Files to check:**
- Dashboard trash icon buttons
- Download/Copy QR buttons

**Fix:** Ensure minimum size:
```tsx
className="min-w-[44px] min-h-[44px] flex items-center justify-center"
```

---

### 8. Text Readability
**Severity:** LOW  
**Issue:** Some text colors (gray-400, gray-500) might have low contrast on dark backgrounds

**Recommendation:** Run WCAG contrast checker on:
- Gray text on dark backgrounds
- Ensure AA compliance (4.5:1 for body text)

---

## TESTING CHECKLIST

### Mobile Viewports
- [ ] iPhone SE (375x667)
- [ ] iPhone 12/13/14 (390x844)
- [ ] Pixel 5 (393x851)
- [ ] Galaxy S20 (360x800)

### Desktop Viewports
- [ ] 1920x1080 (standard desktop)
- [ ] 1366x768 (laptop)
- [ ] 2560x1440 (large desktop)

### Key Flows
- [ ] Homepage → All sections scroll without horizontal overflow
- [ ] Dashboard → Header buttons work on mobile
- [ ] Dashboard → QR code displays properly on all screens
- [ ] Dashboard → Link editing doesn't break layout
- [ ] Dashboard → Preview pane scrolls/displays correctly
- [ ] Login/Signup → Forms are usable on mobile

---

## FIX PRIORITY

1. **CRITICAL:** Dashboard header horizontal scroll (#1)
2. **HIGH:** QR code mobile sizing (#2)
3. **MEDIUM:** Link URL overflow (#3)
4. **LOW:** Everything else

---

## DEPLOYMENT CHECKLIST

Before marking as production-ready:
- [ ] No horizontal scroll on any page at 360px width
- [ ] All buttons are tappable (44x44px minimum)
- [ ] Text doesn't overflow containers
- [ ] Images/QR codes scale properly
- [ ] Forms are usable on mobile
- [ ] Dark mode works on all components
- [ ] Test on real device (not just DevTools)

---

**Bottom Line:** Fix issues #1 and #2 immediately. These are blockers. The rest can be addressed in follow-up but should be done before calling it "production-ready."

This should look like a design team worked on it. Right now it looks like a dev MVP.
