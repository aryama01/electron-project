using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;
using System.Threading;
using System.Windows.Forms;

class Program
{
    // =======================
    // Configuration
    // =======================
    static string employeeId = "123";
    static string backendUrl = "http://localhost:5000";
    static string currentStatus = "active";
    static readonly int IDLE_THRESHOLD = 3 * 1000; // 5 minutes
    static readonly int SCREENSHOT_INTERVAL = 3 * 1000; // 1 minute
    static readonly HttpClient client = new HttpClient();

    // =======================
    // Main
    // =======================
    static async Task Main(string[] args)
    {
        if (args.Length < 2)
        {
            Console.WriteLine("Usage: ActivityTracker.exe <employeeId> <backendUrl>");
            return;
        }

        employeeId = args[0];
        backendUrl = args[1];

        Console.WriteLine($"Activity Tracker started for Employee: {employeeId}");
        Console.WriteLine($"Backend URL: {backendUrl}");

        DateTime lastScreenshot = DateTime.MinValue;

        while (true)
        {
            try
            {
                uint idleTime = GetIdleTime();

                // -------------------
                // Status detection
                // -------------------
                if (idleTime >= IDLE_THRESHOLD)
                {
                    if (currentStatus != "idle")
                    {
                        currentStatus = "idle";
                        await SendStatus(currentStatus);
                    }
                }
                else
                {
                    if (currentStatus != "active")
                    {
                        currentStatus = "active";
                        await SendStatus(currentStatus);
                    }
                }

                // -------------------
                // Screenshot capture
                // -------------------
                if ((DateTime.Now - lastScreenshot).TotalMilliseconds >= SCREENSHOT_INTERVAL)
                {
                    lastScreenshot = DateTime.Now;
                    await CaptureAndSendScreenshot();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Tracker error: {ex.Message}");
            }

            await Task.Delay(5000); // check every 5 seconds
        }
    }

    // =======================
    // Get system idle time
    // =======================
    [StructLayout(LayoutKind.Sequential)]
    struct LASTINPUTINFO
    {
        public uint cbSize;
        public uint dwTime;
    }

    [DllImport("user32.dll")]
    static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

    static uint GetIdleTime()
    {
        LASTINPUTINFO lastInput = new LASTINPUTINFO();
        lastInput.cbSize = (uint)Marshal.SizeOf(lastInput);
        GetLastInputInfo(ref lastInput);

        return ((uint)Environment.TickCount - lastInput.dwTime);
    }

    // =======================
    // Send status to backend
    // =======================
    static async Task SendStatus(string status)
    {
        try
        {
            var payload = new { employeeId, status };
            await client.PostAsJsonAsync(backendUrl, payload);
            Console.WriteLine($"{DateTime.Now:HH:mm:ss} Status sent: {status}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send status: {ex.Message}");
        }
    }

    // =======================
    // Capture and send screenshot
    // =======================
    static async Task CaptureAndSendScreenshot()
    {
        try
        {
            Rectangle bounds = Screen.PrimaryScreen.Bounds;
            using Bitmap bmp = new Bitmap(bounds.Width, bounds.Height);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.CopyFromScreen(0, 0, 0, 0, bounds.Size);
            }

            // Save to memory stream
            using MemoryStream ms = new MemoryStream();
            bmp.Save(ms, ImageFormat.Png);
            ms.Seek(0, SeekOrigin.Begin);

            // Send screenshot via multipart/form-data
            using var content = new MultipartFormDataContent();
            content.Add(new StringContent(employeeId), "employeeId");
            content.Add(new ByteArrayContent(ms.ToArray()), "screenshot", $"screenshot_{DateTime.Now:yyyyMMdd_HHmmss}.png");

            var response = await client.PostAsync(backendUrl + "/screenshot", content);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine($"{DateTime.Now:HH:mm:ss} Screenshot sent");
            }
            else
            {
                Console.WriteLine($"{DateTime.Now:HH:mm:ss} Screenshot failed: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Screenshot error: {ex.Message}");
        }
    }
}
