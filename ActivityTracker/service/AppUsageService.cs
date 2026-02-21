using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

public class AppUsageService
{
    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    private static extern int GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

    public string GetActiveApplication()
    {
        try
        {
            IntPtr handle = GetForegroundWindow();
            GetWindowThreadProcessId(handle, out uint processId);

            var process = Process.GetProcessById((int)processId);
            return process.ProcessName;
        }
        catch
        {
            return "Unknown";
        }
    }
}