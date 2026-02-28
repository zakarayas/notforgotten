# 211 API & weather alerts (optional)

## Weather banner

When the app has permission to use the device’s location, it checks the National Weather Service for active **extreme cold, heat, or winter** alerts at that location. If any are active, a dismissible banner appears at the top of the page:

- **“Extreme weather in your area”** with the alert type and a short headline  
- **“211 updates with warming/cooling centers and shelter during extreme weather — call for current options.”**  
- Buttons: **Go to 211 & help** and **Dismiss**

The banner is shown once per session (dismissing hides it until the next visit). No location or alert data is stored.

## 211 API (optional)

To show **“Search shelters near me”** on the Find shelter page using 211’s data:

### Right after you sign up (logged in on the 211 API screen)

1. **Subscribe to the Search API (if you haven't)**  
   - In the portal menu, look for **Products** or **APIs** and open the **Search** or **Search V2** (or trial) product.  
   - Click **Subscribe** so you get a subscription key.

2. **Get your subscription key**  
   - Go to **Profile** (top-right) or **Subscriptions**.  
   - Find your subscription and click **Show** next to **Primary key** (or Secondary key).  
   - Copy the key — this is your `VITE_211_API_KEY`.

3. **Get the API base URL**  
   - Open the **Search** (or Search V2) API from the APIs list.  
   - On the API page, check **Overview** or **API reference** for the **Base URL** or **Gateway URL**.  
   - If there's a **Try it** or **Test** tab, open it; the request URL shown there is the base URL (without the path like `/search`).  
   - Copy that URL — this is your `VITE_211_API_BASE_URL`.

4. **Add both to your app's `.env`**  
   In your project root, open `.env` and add these two lines (use your real values):

   ```env
   VITE_211_API_BASE_URL=https://the-base-url-you-copied
   VITE_211_API_KEY=the-subscription-key-you-copied
   ```

   Do not add a trailing slash to the base URL. Do not commit `.env` to git.

5. **Restart the dev server**  
   Stop the app (Ctrl+C) and run `npm run dev` again so Vite picks up the new env vars.

6. **Check the Find shelter page**  
   Open Find shelter — the "From 211" card should now show "Search shelters near me". Tap it to search using your location.

If the 211 API uses a different path or query parameter names, update `src/lib/api211.js` to match what you see in the portal's "Try it" or docs.

### Env variable reference

- **VITE_211_API_BASE_URL** — From the Search API page: Base URL / Gateway URL, or the host part of the URL in "Try it".
- **VITE_211_API_KEY** — From Profile → Subscriptions → Show Primary key.

### Without 211 API  
   If these env vars are not set, the Find shelter page still shows:
   - Live availability (from your Supabase table)  
   - **From 211**: “211 has detailed shelter and warming/cooling center data. Call 211 for current options.” with a link to the 211 help page.
