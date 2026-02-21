using System;
using System.IO;

public class LogService
{
    public LogService()
    {
        Directory.CreateDirectory(Config.LogFolder);
    }

    private string GetTodayLogFile()
    {
        return Path.Combine(Config.LogFolder, $"activity_{DateTime.Now:yyyy-MM-dd}.txt");
    }

    public void Write(string message)
    {
        string log = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}{Environment.NewLine}";
        File.AppendAllText(GetTodayLogFile(), log);
    }

    public void LogAppUsage(string appName, int keyCount)
    {
        Write($"Active App: {appName} | Keystrokes: {keyCount}");
    }

    public void LogIdle(TimeSpan idleDuration)
    {
        Write($"User Idle - {idleDuration.TotalSeconds:F0}s");
    }

    public void LogStatus(string status)
    {
        Write($"Status: {status}");
    }
}