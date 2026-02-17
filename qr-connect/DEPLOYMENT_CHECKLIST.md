# 🚀 Tappr Phase 1 - Deployment Checklist

## ✅ Pre-Deployment

### 1. Database Migration
- [ ] Log into Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Copy contents of `supabase/schema.sql`
- [ ] Run the migration
- [ ] Verify tables created:
  - [ ] `plans` (2 rows: free, pro)
  - [ ] `profile_scans`
  - [ ] `subscriptions`
  - [ ] `lead_captures`
- [ ] Verify `profiles` table has `plan_id` column
- [ ] Check RLS policies are active

### 2. Environment Variables
Ensure these are set in Vercel/production:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://fmacbdrwkitpluetlbzy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Build Verification
```bash
npm run build
# Should complete with 0 errors ✅
```

---

## 🔧 Post-Deployment Testing

### Free User Flow
- [ ] Sign up new account
- [ ] Verify `plan_id = 'free'` in database
- [ ] Add 5 links → Should work
- [ ] Try to add 6th link → Upgrade modal should appear
- [ ] Visit `/dashboard/analytics` → Charts should be blurred
- [ ] Visit public profile → "Made with Tappr" should show
- [ ] Share profile → Scan should be tracked

### Pro User Flow (Manual Testing)
- [ ] Manually set `plan_id = 'pro'` in database for test user
- [ ] Dashboard → "Upgrade" button should disappear
- [ ] Add unlimited links → Should work
- [ ] Analytics → Full charts visible
- [ ] Public profile → No "Made with Tappr" branding
- [ ] Scan tracking still works

### Analytics Testing
- [ ] Visit a public profile multiple times
- [ ] Check `/dashboard/analytics`
- [ ] Verify scan count increases
- [ ] Check recent scans list shows entries
- [ ] Verify chart displays data

### Pricing Page
- [ ] Visit `/pricing`
- [ ] Toggle monthly/yearly
- [ ] Verify pricing changes (₹149/mo → ₹1,199/yr)
- [ ] Click "Get Started" → Should redirect to `/signup`
- [ ] Click "Upgrade to Pro" → Should show pricing page

---

## 💳 Razorpay Integration (Phase 2)

When ready to enable payments:

1. **Create Razorpay Account**
   - Sign up at https://razorpay.com
   - Complete KYC verification
   - Get API keys

2. **Create Subscription Plans**
   - Monthly: ₹149/month
   - Yearly: ₹1,199/year
   - Note the plan IDs

3. **Add Environment Variables**
   ```bash
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

4. **Implement Checkout**
   - See comments in `app/api/create-checkout/route.ts`
   - Install: `npm install razorpay`
   - Implement subscription creation
   - Add frontend Razorpay checkout

5. **Add Webhook Handler**
   - Create `app/api/razorpay-webhook/route.ts`
   - Verify payment signatures
   - Update `subscriptions` table
   - Update user `plan_id` on success

6. **Test Payment Flow**
   - Use Razorpay test mode
   - Complete test payment
   - Verify subscription created
   - Verify user upgraded to Pro
   - Test webhook delivery

---

## 🎨 Optional Enhancements

### Lead Capture (Database Ready)
- [ ] Create lead capture form component
- [ ] Add to Pro user profiles
- [ ] Display captured leads in dashboard
- [ ] Email notifications on new leads

### Multiple Cards (Schema Ready)
- [ ] Create card management UI
- [ ] Allow Pro users to create multiple cards
- [ ] Unique URLs per card
- [ ] Card switching in dashboard

### Custom Themes (Enforcement Ready)
- [ ] Build theme editor
- [ ] Color picker for brand colors
- [ ] Font selection
- [ ] Preview in real-time

---

## 📊 Monitoring

### Analytics to Track
- [ ] Signup conversion rate
- [ ] Free → Pro upgrade rate
- [ ] Average links per user
- [ ] Profile scan rates
- [ ] Pricing page visits
- [ ] Upgrade modal dismissals

### Error Monitoring
- [ ] Check Vercel logs for API errors
- [ ] Monitor Supabase logs for database issues
- [ ] Track failed scan tracking attempts
- [ ] Monitor checkout failures (when implemented)

---

## 🐛 Known Issues / Future Fixes

1. **No pagination**: Analytics shows all scans (add pagination when >100)
2. **No export**: Can't export analytics data (add CSV export)
3. **No cancellation flow**: No UI to downgrade Pro → Free
4. **No admin panel**: Can't manually manage subscriptions
5. **No email notifications**: No confirmation emails on upgrade

---

## 📝 Documentation for Team

### For Developers
- See `MONETIZATION_README.md` for full technical docs
- Supabase schema in `supabase/schema.sql`
- Plan checking pattern: `const isPro = profile?.plan_id === 'pro'`

### For Support
- Free plan: 5 links max, basic features
- Pro plan: ₹149/month or ₹1,199/year
- Upgrade process: Pricing page → Razorpay checkout
- Downgrades: Manual via support (no self-service yet)

### For Marketing
- Pricing page: `/pricing`
- Free tier messaging: "Free forever • Upgrade when ready"
- Pro value props: Unlimited links, analytics, no branding
- Discount: 33% off on yearly plans

---

## ✅ Final Checklist

- [x] Database schema created
- [x] Scan tracking implemented
- [x] Analytics dashboard built
- [x] Pricing page designed
- [x] Plan enforcement working
- [x] Upgrade modals implemented
- [x] Landing page updated
- [x] Build succeeds (0 errors)
- [x] TypeScript validated
- [x] Responsive design verified
- [x] Dark mode supported
- [ ] Database migrated to production
- [ ] Post-deployment testing complete
- [ ] Analytics verified working
- [ ] Razorpay integrated (Phase 2)

---

## 🎉 Launch Day

1. **Deploy to Vercel**
   ```bash
   git add .
   git commit -m "feat: add Free + Pro monetization"
   git push origin main
   ```

2. **Run Database Migration**
   - Execute `supabase/schema.sql` in production

3. **Verify Deployment**
   - Visit production URL
   - Test signup flow
   - Check analytics tracking
   - Verify pricing page loads

4. **Announce**
   - Tweet about pricing
   - Update website
   - Email existing users
   - Product Hunt launch?

---

**Status**: ✅ Ready for deployment (pending database migration)

Built by Coder Agent • Team Sloth
