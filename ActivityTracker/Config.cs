using System;
using System.IO;

public static class Config
{
    public static string EmployeeId = "123";

    // Testing values (change later for production)
    public static readonly int IdleThresholdMs = 3 * 1000;
    public static readonly int ScreenshotIntervalMs = 10 * 1000;
    public static readonly int LoopDelayMs = 5000;

    public static readonly string BaseFolder =
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), "ActivityLogs");

    public static readonly string ScreenshotFolder =
        Path.Combine(BaseFolder, "Screenshots");

    public static readonly string LogFolder =
        Path.Combine(BaseFolder, "Logs");
}