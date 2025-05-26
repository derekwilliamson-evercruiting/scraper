const Apify = require('apify');
const fs = require('fs');
const path = require('path');

Apify.main(async () => {
    const { startUrls } = await Apify.getInput();

    const browser = await Apify.launchPuppeteer({ headless: true });
    const page = await browser.newPage();

    for (const { url } of startUrls) {
        console.log(`🔍 Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Enable downloads to /tmp
        const client = await page.target().createCDPSession();
        const downloadPath = '/tmp';
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath
        });

        // Click the download button
        const [downloadInfo] = await Promise.all([
            new Promise(resolve => {
                client.on('Page.downloadWillBegin', resolve);
            }),
            page.click('#upload_downloadFile')
        ]);

        const filename = downloadInfo.suggestedFilename;
        const fullPath = path.join(downloadPath, filename);

        // Wait a bit for the download to finish
        await page.waitForTimeout(5000);

        const buffer = fs.readFileSync(fullPath);
        await Apify.setValue(filename, buffer, { contentType: 'application/pdf' });

        await Apify.pushData({
            url,
            fileName: filename,
            downloadSuccess: true
        });

        console.log(`✅ Saved ${filename}`);
    }

    await browser.close();
});
