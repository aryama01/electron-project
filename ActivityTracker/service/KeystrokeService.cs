using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

public class KeystrokeService
{
    private int keyCount = 0;
    private IntPtr _hookID = IntPtr.Zero;
    private LowLevelKeyboardProc _proc;
    private bool isRunning = false;

    public int KeyCount => keyCount;

    // Windows constant
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    private const int WM_SYSKEYDOWN = 0x0104;

    public void Start()
    {
        if (isRunning) return;

        _proc = HookCallback;

        // 🔥 IMPORTANT: Use IntPtr.Zero (faster & correct for global hook)
        _hookID = SetWindowsHookEx(WH_KEYBOARD_LL, _proc, IntPtr.Zero, 0);

        isRunning = true;
        Console.WriteLine("⌨️ Keystroke hook started (optimized)");
    }

    public void Stop()
    {
        if (!isRunning) return;

        UnhookWindowsHookEx(_hookID);
        isRunning = false;
        Console.WriteLine("⌨️ Keystroke hook stopped");
    }

    public void ResetCounter()
    {
        Interlocked.Exchange(ref keyCount, 0);
    }

    private IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        // ⚡ Only count real key down events (reduces overhead by ~50%)
        if (nCode >= 0 && (wParam == (IntPtr)WM_KEYDOWN || wParam == (IntPtr)WM_SYSKEYDOWN))
        {
            // Thread-safe increment (non-blocking)
            Interlocked.Increment(ref keyCount);
        }

        // VERY IMPORTANT: Always pass immediately to next hook
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }

    private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll")]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn,
        IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll")]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll")]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode,
        IntPtr wParam, IntPtr lParam);
}