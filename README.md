# Franchise PDF Downloader

This Apify Actor scrapes Wisconsin DFI franchise pages, clicks the download button using Puppeteer, and saves the PDF files to Apify's key-value store.

## Input

```json
{
  "startUrls": [
    {
      "url": "https://apps.dfi.wi.gov/apps/FranchiseSearch/details.aspx?id=637375&hash=1758030309&search=external&type=GENERAL"
    }
  ]
}
```

## Output

Each PDF is saved to the key-value store with its original filename.
