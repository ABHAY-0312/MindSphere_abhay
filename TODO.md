# Deployment Fix TODO

## Approved Plan Breakdown
✅ **Step 1**: Create TODO.md to track progress (current).

**Step 2**: Fix `server/src/services/geminiService.js`:
   - Remove malformed code at end (incomplete `generateLessons`, `makeAICall`, illegal top-level return).
   - Add proper `generateLessons` export using existing helpers.
   - Use `edit_file` or full rewrite if needed.

**Step 3**: Local test:
   - `cd server && npm install`
   - `node src/index.js` (verify no SyntaxError).

**Step 4**: Commit/push for Render redeploy.

**Step 5**: Verify deployment logs (no crash on `npm start`).

**Step 6**: attempt_completion.

