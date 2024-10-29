const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    });
    const page = await browser.newPage();
    await page.goto('https://ticketbox.vn/lululola-show-trung-quan-23208?utm_medium=rcm-events&utm_source=tkb-event-details-page');

    let buttonClicked = false;

    const interval = setInterval(async () => {
        const buttonSelector = '#buynow-btn';
        try {
            const button = await page.$(buttonSelector);

            if (button && !buttonClicked) {
                const isDisabled = await page.evaluate(button => button.hasAttribute('disabled'), button);
                if (!isDisabled) {
                    console.log("Nút 'Book Now' đã xuất hiện, đang cuộn đến nút...");
                    await button.scrollIntoView();
                    await new Promise(resolve => setTimeout(resolve, 500));

                    console.log("Đang nhấp vào nút...");
                    await page.evaluate(button => button.click(), button);
                    buttonClicked = true;
                    console.log("Nút đã được nhấp, đang chờ điều hướng...");

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log("Chờ 1 giây để đảm bảo trang đã tải xong.");

                    const pageUrl = page.url();
                    console.log("URL hiện tại sau khi nhấp:", pageUrl);

                    const inputSelector = '#normal_login_username';
                    try {
                        console.log("Đang chờ ô nhập email xuất hiện...");
                        await page.waitForSelector(inputSelector, { timeout: 20000 });
                        console.log("Đã đợi ô nhập email xuất hiện.");

                        await page.type(inputSelector, 'namsieunhan.tn24@gmail.com');
                        console.log("Đã nhập email.");

                        const passwordSelector = '#normal_login_password';
                        console.log("Đang chờ ô nhập mật khẩu xuất hiện...");
                        await page.waitForSelector(passwordSelector, { timeout: 20000 });
                        console.log("Đã đợi ô nhập mật khẩu xuất hiện.");

                        await page.type(passwordSelector, 'nam24082003');
                        console.log("Đã nhập mật khẩu.");

                    } catch (inputError) {
                        console.error("Lỗi khi chờ hoặc điền vào ô nhập:", inputError);
                    }
                    const continueButtonSelector = 'button.ant-btn.ant-btn-primary.ant-btn-lg';
                    await page.waitForSelector(continueButtonSelector, { timeout: 20000 });
                    console.log("Đang chờ nút 'Tiếp tục' xuất hiện...");
                    await page.click(continueButtonSelector);
                    console.log("Đã nhấn nút 'Tiếp tục'.");

                    await page.waitForNavigation({ waitUntil: 'networkidle0' });
                    console.log("Đã hoàn thành điều hướng sau khi nhấn 'Tiếp tục'.");
                    clearInterval(interval);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await browser.close();
                } else {
                    console.log("Nút 'Book Now' chưa được kích hoạt, đang kiểm tra lại...");
                }
            } else if (buttonClicked) {
                clearInterval(interval);
            } else {
                console.log("Không tìm thấy nút 'Book Now', đang kiểm tra lại...");
            }
        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
            clearInterval(interval);
            await browser.close();
        }
    }, 800);

    setTimeout(() => {
        clearInterval(interval);
        browser.close();
    }, 3600000);
})();
