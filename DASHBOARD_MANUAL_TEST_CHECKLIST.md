# Dashboard Manual Testing Checklist

**⚠️ AUTHENTICATION REQUIRED - Must be logged in to test**

## Setup
1. Login to https://tappr.in/dashboard
2. Open Chrome DevTools (Cmd+Shift+M)
3. Enable device toolbar
4. Test each device below

---

## Device 1: iPhone SE (375x667)

### Form Fields
- [ ] Display Name input — fits in viewport? ✓ / ❌
- [ ] Bio textarea — multi-line displays fully? ✓ / ❌
- [ ] Long bio text — no horizontal overflow? ✓ / ❌
- [ ] Labels — not cut off? ✓ / ❌
- [ ] Inputs — proper padding/margins? ✓ / ❌

### Buttons
- [ ] Save Profile button — fully visible? ✓ / ❌
- [ ] Save Profile button — min 44px height? ✓ / ❌
- [ ] Download QR button — fully visible and clickable? ✓ / ❌
- [ ] Copy Link button — fully clickable? ✓ / ❌
- [ ] Share button — visible and readable? ✓ / ❌
- [ ] Upgrade button — not overlapping? ✓ / ❌

### Cards & Containers
- [ ] "Edit Profile" card — fits without horizontal scroll? ✓ / ❌
- [ ] "Social Links" card — fits on screen? ✓ / ❌
- [ ] "Your QR Code" card — fits on screen? ✓ / ❌
- [ ] QR code image — responsive size (not huge)? ✓ / ❌
- [ ] Card padding — no overflow? ✓ / ❌

### Lists & Links
- [ ] Link list items — don't overflow? ✓ / ❌
- [ ] Platform icons + text + delete button — all visible? ✓ / ❌
- [ ] Long URLs in links — truncate with ellipsis? ✓ / ❌

### Preview Section
- [ ] Live preview card — fits on mobile? ✓ / ❌
- [ ] Avatar image — proper size? ✓ / ❌
- [ ] Social link buttons — stack vertically (not horizontally)? ✓ / ❌
- [ ] Link buttons — no text overflow? ✓ / ❌

**Screenshot:** Take screenshot if ANY failures above  
**Issues Found:** ___________________________________________

---

## Device 2: iPhone 14 (390x844)

### Quick Test (Full checklist same as iPhone SE)
- [ ] All form fields fit? ✓ / ❌
- [ ] All buttons visible and tappable? ✓ / ❌
- [ ] All cards fit in viewport? ✓ / ❌
- [ ] Social links stack properly? ✓ / ❌
- [ ] No horizontal scrolling? ✓ / ❌

**Screenshot:** If different from iPhone SE  
**Issues Found:** ___________________________________________

---

## Device 3: Pixel 5 (393x851)

- [ ] All form fields fit? ✓ / ❌
- [ ] All buttons visible and tappable? ✓ / ❌
- [ ] All cards fit in viewport? ✓ / ❌
- [ ] Social links stack properly? ✓ / ❌
- [ ] No horizontal scrolling? ✓ / ❌

**Screenshot:** If issues found  
**Issues Found:** ___________________________________________

---

## Device 4: Galaxy S20 (360x800) **NARROWEST**

- [ ] All form fields fit? ✓ / ❌
- [ ] All buttons visible and tappable? ✓ / ❌
- [ ] All cards fit in viewport? ✓ / ❌
- [ ] Social links stack properly? ✓ / ❌
- [ ] No horizontal scrolling? ✓ / ❌
- [ ] Save Profile button not cut off? ✓ / ❌

**Screenshot:** REQUIRED (narrowest viewport)  
**Issues Found:** ___________________________________________

---

## Device 5: iPad (768x1024)

- [ ] Desktop-like layout renders? ✓ / ❌
- [ ] All elements visible? ✓ / ❌
- [ ] No overflow? ✓ / ❌

**Screenshot:** Only if issues  
**Issues Found:** ___________________________________________

---

## Device 6: Desktop (1920x1080)

- [ ] Full desktop layout? ✓ / ❌
- [ ] All elements visible? ✓ / ❌
- [ ] No overflow? ✓ / ❌

**Screenshot:** Only if issues  
**Issues Found:** ___________________________________________

---

## Critical Red Flags

**STOP and document if you see:**
- ❌ Any text cut off mid-word
- ❌ Any button partially off-screen
- ❌ Horizontal scrolling required
- ❌ Elements overlapping
- ❌ Form fields too small to use
- ❌ Buttons too small to tap (< 44x44px)

---

## Summary

**Total Devices Tested:** _____ / 6  
**Devices with Issues:** _____  
**Total Issues Found:** _____  
**Critical Issues:** _____  
**Overall Status:** ✅ PASS / ❌ FAIL

**Next Steps:**
- [ ] Document all issues in detail
- [ ] Share screenshots with developer
- [ ] Assign fixes
- [ ] Re-test after fixes
