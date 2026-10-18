# AOuii Pocket Assistant

A personal finance tracker for students, built with plain HTML, CSS and JavaScript (no frameworks).

- **Theme:** Student Finance Tracker
- **Live site (GitHub Pages):** `TODO: paste your Pages URL here`
- **Demo video (unlisted):** `TODO: paste your video link here`
- **Contact:** [github.com/bigiraneza-car](https://github.com/bigiraneza-car) · b.igiraneza@alustudent.com

## Features

- **Dashboard:** total records, total spent, top category, a last-7-days bar chart, and the total converted into RWF and KES.
- **Weekly cap:** set a limit; a polite message shows what is remaining, an assertive one shows when you are over.
- **Records table:** sort by date, description or amount; live regex search with a case toggle and `<mark>` highlighting; inline edit and delete (delete asks for confirmation). The table becomes scrollable on small screens.
- **Add form:** every field is validated with regular expressions, with messages that say what to fix.
- **Settings:** manual exchange rates, a category list you can add to, JSON export and JSON import with full validation.
- **Saving:** everything is saved in `localStorage` automatically (records, cap, rates, categories).
- **Accessibility:** skip link, landmarks, labelled inputs, visible focus, ARIA live regions, keyboard-only use.

## Data model

```json
{ "id": "rec_0001", "description": "Lunch at cafeteria", "amount": 12.5, "category": "Food",
  "date": "2026-10-16", "createdAt": "2026-10-16T09:15:00.000Z", "updatedAt": "2026-10-16T09:15:00.000Z" }
```

## Regex catalog

Patterns come from section C of the assignment brief unless noted.

| Where | Pattern | What it means | Passes | Fails |
|---|---|---|---|---|
| Description | `^\S(?:.*\S)?$` | Starts and ends with a non-space character | `Lunch at cafeteria` | ` Lunch`, `Lunch ` |
| Description (doubles) | `\s{2,}` (rejects) | Two or more spaces in a row | `Lunch today` | `Lunch  today` |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `0` or a number without leading zeros, up to 2 decimals | `12.50`, `0`, `4550` | `007`, `12.345`, `-5` |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `YYYY-MM-DD`, month 01-12, day 01-31 | `2026-10-16` | `2026-13-01`, `16-10-2026` |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | Letters, with single spaces or hyphens between words | `Fast-food`, `Eating out` | `Food2`, `-Food`, `Food ` |
| **Advanced (back-reference)** | `\b(\w+)\s+\1\b` (case-insensitive) | The same word twice in a row; `\1` repeats what `(\w+)` captured | `the theatre` | `the the coffee` |
| Exchange rate | the amount pattern, plus a check that the value is above 0 | A rate of 0 would break every conversion | `3.9` | `0`, `abc` |

Search examples to try in the Records section: `(coffee\|tea)`, `\.\d{2}\b` (amounts shown with cents), `\b(\w+)\s+\1\b` (repeated words), and the invalid patterns `(` and `[`.

## Decisions

- **Dates:** the pattern checks the shape only, so a second check confirms the day really exists (`2026-02-31` is rejected).
- **Top category:** the category with the most money (not the most entries). A tie goes to the first one alphabetically.
- **"Last 7 days":** today and the 6 days before it, using the local date. Older and future-dated records are left out of the chart.
- **Weekly cap:** compared with the spending of those 7 days. An empty cap means no cap; a cap of 0 is allowed.
- **Exchange rates:** a rate means "how many BIF equal 1 unit of the other currency", so converting BIF into RWF divides by the rate (1000 BIF at 3.9 is 256.41 RWF). A rate must be above 0.
- **Categories:** you can add categories (a duplicate is rejected, ignoring capitals). There is no remove button, to keep the app simple.
- **Import:** the whole file is rejected if any record is invalid (the existing data is never touched), and the message names the record number and field. The repeated-word rule is a typing aid, so it is not applied to imported text. Categories in the file that are not in the list are added to it. Extra fields are ignored. A confirm prompt appears before the data is replaced.
- **Export:** the records array only, so an exported file can be imported again.
- **Search and edit:** changing the search or sort while a row is being edited cancels that edit.

## Keyboard map

| Keys | What happens |
|---|---|
| `Tab` / `Shift+Tab` | Move forward / backward through links, fields and buttons |
| `Tab` (first press on a page) | Reaches the **Skip to main content** link |
| `Enter` in a form | Submits it; errors are announced and focus moves to the first invalid field |
| `Enter` in the cap box | Applies the cap |
| `Enter` in an edit row | Saves the row |
| `Esc` in an edit row | Cancels the edit |
| `Esc` / `Enter` in the browser's confirm prompt | `Esc` cancels, `Enter` confirms (used for delete and import) |
| `Space` | Presses the focused button or toggles the checkbox |

## Accessibility notes

- Landmarks (`header`, `nav`, `main`, `footer`), one `h1`, and headings that do not skip levels.
- Every input has a `label`; errors are linked with `aria-describedby` and `aria-invalid`, and are written in words ("Error" text), not only red.
- Live regions: a polite `role="status"` for results and an assertive `role="alert"` for the over-cap warning and field errors. Search results are announced after the user stops typing.
- Focus is managed after delete and after an edit is saved or cancelled. Delete and import use the browser's own confirm prompt, which handles focus itself.
- Visible focus outlines, `prefers-reduced-motion` respected, text contrast checked in DevTools. `TODO: record your Lighthouse and axe results here.`

## How to run

1. Open the folder in VS Code and start **Live Server** (modules and `fetch` need a server, not a double-click).
2. Open `index.html` for the app, or `tests.html` for the test page (it prints how many assertions passed).

## Files

`index.html`, `tests.html`, `seed.json`, `styles/`, and five scripts in `scripts/`:

- `main.js`: starts the app and connects the page to the data (events, forms, export and import)
- `state.js`: the records, categories and rates, plus the calculations (totals, top category, last 7 days, cap, conversion)
- `storage.js`: saving and loading with `localStorage`
- `validator.js`: every validation rule, the import check, and the safe regex compiler for search
- `ui.js`: everything drawn on the page (dashboard, table, highlighting, announcements, form helpers)

## Credits

- Starter snippets (safe regex compiler, highlight, persistent state) and the regex patterns: the assignment brief. Highlighting was changed to escape text first.
- MDN Web Docs for `Intl`, `Blob`, `URL.createObjectURL` and `localStorage`.

## Use of AI

`TODO: write this section yourself and honestly. Say which parts AI helped with (for example explanations, seed data, review, or code), and follow your course's rule on how to disclose it.`