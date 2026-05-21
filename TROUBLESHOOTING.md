# Troubleshooting Guide

Common issues and solutions for the MSU TCTO Certificate System.

## Setup Issues

### Issue: "NEXT_PUBLIC_PROJECT_ID is not defined"

**Symptoms:**
- Error when opening `/admin` page
- "projectId is not defined" in console

**Causes:**
- `.env.local` file missing
- `NEXT_PUBLIC_PROJECT_ID` not set
- Need to restart dev server after adding .env file

**Solutions:**
1. Create `.env.local` in project root:
   ```
   NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id_here
   ```
2. Get Project ID from https://cloud.walletconnect.com
3. Stop dev server (`Ctrl+C`)
4. Run `pnpm dev` again

---

### Issue: "Contract address is 0x0000...0000"

**Symptoms:**
- Verification page doesn't return results
- "Invalid contract address" errors

**Causes:**
- `NEXT_PUBLIC_CONTRACT_ADDRESS` not set
- Typo in contract address
- Contract not deployed to specified address

**Solutions:**
1. Check `.env.local` has contract address:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```
2. Verify address is correct (should start with `0x` and be 42 characters)
3. Verify contract is deployed to that address on the network
4. Check on explorer: https://polygonscan.com or https://etherscan.io

---

### Issue: "Cannot find module" errors

**Symptoms:**
- Build fails with "Cannot find module '@/lib/wagmi'"
- Pages don't compile

**Causes:**
- Dependencies not installed
- TypeScript path aliases misconfigured
- Node modules corrupted

**Solutions:**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm dev
```

---

## Wallet Connection Issues

### Issue: "Connect Wallet button does nothing"

**Symptoms:**
- Click "Connect Wallet" but nothing happens
- No wallet popup appears

**Causes:**
- No web3 wallet extension installed
- RainbowKit not initialized properly
- Browser blocking popups

**Solutions:**
1. Install MetaMask: https://metamask.io
2. Or install other wallet (Coinbase, WalletConnect)
3. Check browser console for errors (F12)
4. Disable popup blocker for localhost
5. Check RainbowKit styles loaded (should see colorful button)
6. Restart dev server

---

### Issue: "Wallet connected but wrong network"

**Symptoms:**
- Wallet shows connected
- But getting "network mismatch" error

**Causes:**
- Wallet on different chain than contract
- Contract deployed to Polygon, wallet on Ethereum

**Solutions:**
1. Open MetaMask
2. Click network dropdown (top left)
3. Select network where contract is deployed:
   - **Polygon Mumbai** for testnet
   - **Ethereum Sepolia** for testnet
   - **Polygon** for mainnet (if using that)
4. Refresh page

---

### Issue: "Not authorized to access admin"

**Symptoms:**
- Wallet connected
- Get "Unauthorized" message on `/admin`

**Causes:**
- Wallet address not in `authorizedIssuers` in contract
- Checking wrong contract address

**Solutions:**
1. Verify contract address in `.env.local`
2. Get your wallet address from MetaMask (copy from top)
3. Check contract's `authorizedIssuers` mapping:
   ```solidity
   authorizedIssuers[yourAddress] = true;
   ```
4. If you deployed the contract, you should be authorized
5. Try redeploying contract or calling `addAuthorizedIssuer()`

---

## Blockchain Interaction Issues

### Issue: Transaction fails with "Contract execution reverted"

**Symptoms:**
- Form submits but transaction reverts
- See error: "Contract execution reverted: Certificate not found" or similar

**Causes:**
- Certificate ID already exists
- Smart contract validation failed
- Wallet not authorized
- Insufficient gas

**Solutions:**
1. Check error message carefully - it tells you what failed
2. For "already exists" - use unique certificate ID
3. For authorization - check `isAuthorizedIssuer()` in contract
4. Try with Sepolia (lower gas prices)
5. Check MetaMask gas setting (might be too low)

---

### Issue: Verification page says "Certificate not found"

**Symptoms:**
- Enter certificate ID
- Get "Certificate not found" error
- But certificate should exist

**Causes:**
- Certificate ID spelling incorrect
- Certificate hasn't been issued yet
- Wrong contract address in `.env`
- Using different network than where contract deployed

**Solutions:**
1. Check spelling of certificate ID (case-sensitive)
2. Verify certificate was actually issued
3. Verify `.env.local` has correct contract address
4. Verify wallet is on same network as contract
5. Check blockchain explorer for the contract and verify functions work

---

### Issue: "Insufficient gas" or "out of gas" error

**Symptoms:**
- Transaction fails
- Error mentions gas limit

**Causes:**
- Gas price too high
- Batch too large (too many certificates at once)
- Network congestion

**Solutions:**
1. Reduce batch size to <50 certificates
2. Use Sepolia testnet (much cheaper gas)
3. Check gas price on https://etherscan.io (gwei prices)
4. Try issuing single certificate first
5. Wait for network to calm down and retry

---

## Form & Validation Issues

### Issue: "Form won't submit"

**Symptoms:**
- Click submit button
- Nothing happens or page reloads

**Causes:**
- Validation errors (red text below fields)
- Wallet not connected
- Browser console errors

**Solutions:**
1. Check for red error messages below form fields
2. Ensure all required fields filled
3. Connect wallet first (admin forms need connection)
4. Open browser DevTools (F12) and check console for errors
5. Try refreshing page

---

### Issue: "Date field not working"

**Symptoms:**
- Date input field doesn't open calendar
- Can't select date

**Causes:**
- Browser doesn't support date input
- Input field cleared by form validation

**Solutions:**
1. Use modern browser (Chrome, Firefox, Safari)
2. Type date manually: `YYYY-MM-DD` format
3. Example: `2024-01-15` for January 15, 2024
4. Try date picker if available

---

### Issue: JSON import says "Invalid JSON"

**Symptoms:**
- Paste JSON into batch form
- Get "Invalid JSON format" error

**Causes:**
- JSON syntax error (missing comma, bracket, etc.)
- Extra/missing quotes
- Trailing commas

**Solutions:**
1. Validate JSON at https://jsonlint.com
2. Use template provided (download button)
3. Check format:
   - Must be array: `[...]`
   - Each object needs curly braces: `{...}`
   - Strings in double quotes: `"name"`
   - No trailing commas after last item
4. Example of correct format:
   ```json
   [
     {
       "certificateId": "CERT-001",
       "recipientName": "John Doe",
       "courseName": "Training",
       "completionDate": "2024-01-15"
     }
   ]
   ```

---

## UI/Display Issues

### Issue: Page shows blank screen

**Symptoms:**
- Page loads but nothing displays
- Just white/empty

**Causes:**
- JavaScript error preventing render
- CSS not loading
- Provider setup issue

**Solutions:**
1. Check browser console (F12 → Console tab)
2. Look for red error messages
3. Check network tab - are CSS files loading?
4. Restart dev server: `pnpm dev`
5. Clear browser cache: `Ctrl+Shift+Delete`
6. Try different browser

---

### Issue: Styling looks broken / misaligned

**Symptoms:**
- Components not properly aligned
- Colors look wrong
- Spacing is off

**Causes:**
- Tailwind CSS not compiled
- Global styles not loaded
- Theme provider not working

**Solutions:**
1. Check `app/globals.css` is imported in layout
2. Restart dev server
3. Clear browser cache (`Ctrl+Shift+Delete`)
4. Check `tailwind.config.ts` file exists
5. Rebuild: `pnpm build`

---

### Issue: Dark mode not working

**Symptoms:**
- Toggle dark mode but colors don't change
- Always shows light mode

**Causes:**
- System preference not detected
- Dark mode class not applied to html tag
- Tailwind dark mode not configured

**Solutions:**
1. Check `app/layout.tsx` has `dark:` classes
2. Verify `html` tag in layout has dark mode support
3. Check tailwind.config.ts has darkMode enabled
4. Try: `<html className="dark">` to force dark mode
5. System must prefer dark in OS settings

---

## Performance Issues

### Issue: Page loads slowly

**Symptoms:**
- Page takes >5 seconds to load
- Slow on certificate verification

**Causes:**
- RPC endpoint slow
- Too many blockchain calls
- Large batch processing

**Solutions:**
1. Check RPC endpoint (configure in wagmi.ts)
2. Use Alchemy or Infura free tiers (faster than public endpoints)
3. Add caching with TanStack Query
4. Reduce batch size
5. Check network tab (F12) for slow requests

---

### Issue: Form submission is slow

**Symptoms:**
- Click submit and long wait
- Finally see "Processing..." message

**Causes:**
- Gas estimation taking time
- RPC slow
- Browser needs optimization

**Solutions:**
1. This is normal (blockchain calls take time)
2. Add timeout to user: button should show "Processing..."
3. Use faster RPC (Alchemy, Infura)
4. Check gas prices - if very high, wait for network to calm down
5. On mainnet, this can take 10-30 seconds

---

## Browser Compatibility

### Issue: App doesn't work in Safari/Firefox

**Symptoms:**
- Works in Chrome but not other browsers
- Buttons not responding
- Wallet connection fails

**Causes:**
- Browser doesn't support Web3 APIs
- Wallet extension not available
- JavaScript compatibility issue

**Solutions:**
1. Install MetaMask/wallet in your browser
2. Use latest version of browser
3. Check console for errors (F12)
4. Try Chrome first to confirm app works
5. Report browser-specific issues

---

## Deployment Issues

### Issue: App works locally but not on Vercel

**Symptoms:**
- `pnpm dev` works fine
- Deploy to Vercel, get errors
- Env variables missing

**Causes:**
- Environment variables not set in Vercel
- Build environment different from local
- Environment variables marked as private

**Solutions:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_PROJECT_ID`
3. Add `NEXT_PUBLIC_CONTRACT_ADDRESS`
4. **Important**: `NEXT_PUBLIC_` prefix is required for client-side access
5. Redeploy after adding env vars
6. Check Vercel build logs for errors

---

### Issue: "Cannot connect to blockchain" on deployed version

**Symptoms:**
- App loads on Vercel
- Verification returns errors
- Admin shows connection issues

**Causes:**
- RPC endpoint blocked in browser
- Contract address wrong for that environment
- CORS issues

**Solutions:**
1. Use public RPC that allows CORS
2. Or deploy RPC proxy (use Alchemy/Infura)
3. Verify contract is deployed to specified network
4. Check Vercel build logs
5. Try from different network/VPN

---

## Getting Help

### Debug Steps (try these first)

1. **Open browser DevTools** (F12 or Cmd+Option+I)
2. **Check Console tab** for red error messages
3. **Check Network tab** to see failed requests
4. **Look for error messages** on the page itself
5. **Check `.env.local`** for correct values
6. **Restart dev server** (stop with Ctrl+C, run `pnpm dev`)
7. **Clear cache** (Ctrl+Shift+Delete) and hard refresh (Ctrl+Shift+R)

### Create Minimal Reproduction

If none above work:
1. Note exact error message/screenshot
2. Note steps to reproduce
3. Check which page: `/`, `/verify`, or `/admin`
4. Check which action: loading, form submit, wallet connection
5. Share with team

### Resources

- **Local Error?** Check [QUICKSTART.md](./QUICKSTART.md)
- **Setup Help?** Check [README.md](./README.md)
- **Contract Error?** Check [SMART_CONTRACT_INTERFACE.md](./SMART_CONTRACT_INTERFACE.md)
- **Form Error?** Check [COMPONENTS_REFERENCE.md](./COMPONENTS_REFERENCE.md)
- **Hook Error?** Check [API_HOOKS.md](./API_HOOKS.md)

### Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| `projectId is not defined` | WalletConnect ID missing | Add to `.env.local` |
| `Contract address is invalid` | Contract address wrong format | Check it's `0x...` with 42 chars |
| `Not authorized to issue certificates` | Wallet not in `authorizedIssuers` | Add address to contract |
| `Certificate already exists` | ID already issued | Use different ID |
| `No certificate found` | Doesn't exist on blockchain | Check spelling and network |
| `Cannot find module` | Missing dependency | Run `pnpm install` |
| `Wallet not connected` | Need to connect MetaMask | Click "Connect Wallet" |
| `Network mismatch` | Wallet on wrong chain | Switch to correct network in wallet |

---

## Still Stuck?

1. ✅ Check you've read [QUICKSTART.md](./QUICKSTART.md)
2. ✅ Verify all `.env` variables are set
3. ✅ Confirm wallet is connected and authorized
4. ✅ Check browser console for errors (F12)
5. ✅ Try same action in different browser
6. ✅ Verify smart contract is deployed
7. ✅ Check RPC endpoint in wagmi.ts

If still stuck:
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) architecture
- Check [SMART_CONTRACT_INTERFACE.md](./SMART_CONTRACT_INTERFACE.md) contract spec
- Review [API_HOOKS.md](./API_HOOKS.md) for hook usage

---

**Last Updated**: May 2026
**Version**: 1.0.0
