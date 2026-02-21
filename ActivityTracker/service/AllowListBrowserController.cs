using System;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

public class AllowListBrowserController
{
    private readonly string[] allowedKeywords =
    {
        "localhost",
        "github",
        "stackoverflow",
        "yourcompany",
        "dashboard"
    };

    private readonly string[] browserProcesses =
    {
        "chrome",
        "msedge",
        "brave",
        "firefox",
        "opera"
    };

    private DateTime trackerStartTime = DateTime.Now;
    private DateTime lastKillTime = DateTime.MinValue;

    private readonly int startupGraceSeconds = 15;
    private readonly int killCooldownSeconds = 8;

    public void Enforce(string windowTitle)
    {
        if (string.IsNullOrWhiteSpace(windowTitle))
            return;

        string title = windowTitle.ToLower();

        Console.WriteLine($"[ACTIVE WINDOW] {windowTitle}");

        if ((DateTime.Now - trackerStartTime).TotalSeconds < startupGraceSeconds)
        {
            Console.WriteLine("⏳ In grace period");
            return;
        }

        if (!IsForegroundBrowser())
        {
            Console.WriteLine("❌ Not a browser");
            return;
        }

        if (IsGenericTitle(title))
        {
            Console.WriteLine("⚪ Generic tab ignored");
            return;
        }

        bool allowed = allowedKeywords.Any(k => title.Contains(k));

        Console.WriteLine($"Allowed Match: {allowed}");

        if (allowed)
        {
            Console.WriteLine("✅ Allowed site detected");
            return;
        }

        if ((DateTime.Now - lastKillTime).TotalSeconds < killCooldownSeconds)
        {
            Console.WriteLine("⏱ Cooldown active");
            return;
        }

        lastKillTime = DateTime.Now;

        Console.WriteLine("🚫 Restricted site detected → Closing browser");
        KillForegroundBrowser();
    }

    private bool IsForegroundBrowser()
    {
        IntPtr hwnd = GetForegroundWindow();
        GetWindowThreadProcessId(hwnd, out uint pid);

        try
        {
            var process = Process.GetProcessById((int)pid);
            string name = process.ProcessName.ToLower();

            return browserProcesses.Contains(name);
        }
        catch
        {
            return false;
        }
    }

        private bool IsGenericTitle(string title)
        {
            return title.Contains("new tab") ||
                   title.Contains("about:blank") ||
                   title.Equals("google chrome") ||
                   title.Equals("chrome");
        }

    private void KillForegroundBrowser()
    {
        IntPtr hwnd = GetForegroundWindow();
        GetWindowThreadProcessId(hwnd, out uint pid);

        try
        {
            var process = Process.GetProcessById((int)pid);
            process.Kill();
            Console.WriteLine($"🔴 Closed {process.ProcessName}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Kill failed: {ex.Message}");
        }
    }

    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}