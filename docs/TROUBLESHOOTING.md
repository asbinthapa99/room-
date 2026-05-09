# Troubleshooting & Error Codes

This document outlines common errors you might encounter when using or developing RoomRent, along with debugging steps.

## Common Error Codes

### 404: NOT_FOUND
**Example Error Context:**
```json
{
  "status": 404,
  "code": "NOT_FOUND",
  "id": "lhr1::x24hh-1778244411049-65980c36419f",
  "message": "The requested resource could not be found."
}
```

**Description:**
This error occurs when the requested resource (such as a room listing, user profile, or API endpoint) does not exist on the server. In the context of room listings, this often means the room was already rented out, the landlord deleted the listing, or the URL contains a typo.

**Resolution Steps:**
1. Check the URL for any typos or missing characters.
2. If accessing a listing, return to the search page to verify the room is still available.
3. For developers: Ensure that the API route being requested exists and is correctly defined in the Next.js `app/api` directory.
4. **Read our API documentation** (coming soon) to learn more about valid endpoints and required parameters.

---

### Additional Supabase Errors
If you run into backend errors related to Supabase (e.g., authentication or database connection issues), refer to the [Supabase Troubleshooting Guide](https://supabase.com/docs/guides/getting-started/troubleshooting).

## Reporting Scams or Issues
If you encounter suspicious listings or landlords, please use the **Report Scam** button on the listing page. Admin moderators will review the report and take appropriate action to protect the community.

If you find a reproducible bug on the platform, please open an issue in our GitHub repository following the guidelines in `CONTRIBUTING.md`.
