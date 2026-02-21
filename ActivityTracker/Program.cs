using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

class Program
{
    static string currentStatus = "active";
    static DateTime idleStartTime = DateTime.MinValue;
    static DateTime lastScreenshot = DateTime.MinValue;
    static DateTime lastAppLog = DateTime.MinValue;
    static bool isRunning = true;

    [STAThread]
    static async Task Main(string[] args)
    {
        Console.WriteLine("=== Advanced Activity Tracker Started ===");

        var idleService = new IdleService();
        var screenshotService = new ScreenshotService();
        var logService = new LogService();
        var appUsageService = new AppUsageService();
        var keystrokeService = new KeystrokeService();
        var allowListController = new AllowListBrowserController();

        // Start keyboard hook
        keystrokeService.Start();

        Console.CancelKeyPress += (sender, e) =>
        {
            isRunning = false;
            logService.Write("Application Stopped");
            e.Cancel = true;
        };

        while (isRunning)
        {
            try
            {
                bool isIdle = idleService.IsIdle();
                string activeApp = appUsageService.GetActiveApplication();

                            // ⭐ STARTS WEBSITE CONTROL SERVICE HERE
                            allowListController.Enforce(activeApp);

                            Console.WriteLine("Active Window: " + activeApp);

                // ---------- Idle / Active Detection ----------
                if (isIdle)
                {
                    if (currentStatus != "idle")
                    {
                        currentStatus = "idle";
                        idleStartTime = DateTime.Now;

                        Console.WriteLine("🟡 IDLE");
                        logService.LogStatus("IDLE");

                        screenshotService.CaptureAllScreens("IDLE");
                    }

                    TimeSpan idleDuration = DateTime.Now - idleStartTime;
                    logService.LogIdle(idleDuration);
                }
                else
                {
                    if (currentStatus != "active")
                    {
                        currentStatus = "active";
                        Console.WriteLine("🟢 ACTIVE");
                        logService.LogStatus("ACTIVE");

                        screenshotService.CaptureAllScreens("BACK_ACTIVE");
                    }
                }

                // ---------- App Usage + Keystroke Logging (Every 30s) ----------
                if ((DateTime.Now - lastAppLog).TotalSeconds >= 30)
                {
                    lastAppLog = DateTime.Now;

                    int keys = keystrokeService.KeyCount;
                    logService.LogAppUsage(activeApp, keys);

                    Console.WriteLine($"App: {activeApp} | Keys: {keys}");

                    keystrokeService.ResetCounter();
                }

                // ---------- Periodic Screenshot ----------
                if ((DateTime.Now - lastScreenshot).TotalMilliseconds >= Config.ScreenshotIntervalMs)
                {
                    lastScreenshot = DateTime.Now;
                    screenshotService.CaptureAllScreens("PERIODIC");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Tracker error: {ex.Message}");
            }

            await Task.Delay(Config.LoopDelayMs);
            Application.DoEvents(); // Required for keyboard hook
        }
    }
}