# Security Specification for La Isla

## Data Invariants
1. A villa must have a number (1-48), type (2 BHK, 3 BHK, 4 BHK), and status (Available, Sold, Reserved).
2. Users can read all villa data (public catalog).
3. Only admins can create/update/delete villa data.
4. Users can create enquiries.
5. Users can only see their own enquiries (based on email).
6. Admins can see all enquiries.
7. Users can read and update their own profile.
8. Admins are defined in a separate `admins` collection or by a special field (we'll use a `users/{userId}` check).

## The Dirty Dozen Payloads (to be blocked)
1. **Unauthenticated Villa Edit**: Attempting to update a villa price without being logged in.
2. **Identity Spoofing in Enquiry**: Creating an enquiry with a `userName` that doesn't match the authenticated user (though users can be anonymous/non-logged for enquiries sometimes, but if logged, identity should match).
3. **Ghost Field in Villa**: Adding `isPromoted: true` to a villa document.
4. **Illegal ID in Enquiry**: Creating an enquiry with a 2KB junk string as ID.
5. **Enquiry PII Leak**: A user reading all enquiries from other users.
6. **Self-Promotion to Admin**: A user updating their own profile to `role: 'admin'`.
7. **Orphaned Enquiry**: Creating an enquiry for a non-existent villa ID.
8. **Negative Price**: Updating a villa price to `-5000000`.
9. **Terminal State Bypass**: Updating a villa marked as "Sold" back to "Available" (only admin should).
10. **Resource Exhaustion (Enquiry Message)**: Sending a 10MB string as the enquiry message.
11. **Spoofed Timestamp**: Sending a client-side `createdAt` date from 2020.
12. **Unverified Email Edit**: A user with an unverified email updating sensitive profile info.

## Test Runner (Mock)
A `firestore.rules.test.ts` will be implemented to verify these constraints.
