using System;
using System.Runtime.InteropServices;

public class IdleService
{
    [StructLayout(LayoutKind.Sequential)]
    struct LASTINPUTINFO
    {
        public uint cbSize;
        public uint dwTime;
    }

    [DllImport("user32.dll")]
    static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

    public uint GetIdleTime()
    {
        LASTINPUTINFO lastInput = new LASTINPUTINFO();
        lastInput.cbSize = (uint)Marshal.SizeOf(lastInput);
        GetLastInputInfo(ref lastInput);
        return ((uint)Environment.TickCount - lastInput.dwTime);
    }

    public bool IsIdle()
    {
        return GetIdleTime() >= Config.IdleThresholdMs;
    }
}