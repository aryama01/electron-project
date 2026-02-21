using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Windows.Forms;

public class ScreenshotService
{
    public ScreenshotService()
    {
        Directory.CreateDirectory(Config.ScreenshotFolder);
    }

    public void CaptureAllScreens(string reason)
    {
        try
        {
            string timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");

            foreach (var screen in Screen.AllScreens)
            {
                Rectangle bounds = screen.Bounds;

                using Bitmap bmp = new Bitmap(bounds.Width, bounds.Height);
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.CopyFromScreen(bounds.X, bounds.Y, 0, 0, bounds.Size);
                }

                string fileName = $"screenshot_{reason}_{timestamp}_{screen.DeviceName.Replace("\\", "")}.png";
                string path = Path.Combine(Config.ScreenshotFolder, fileName);

                bmp.Save(path, ImageFormat.Png);
                Console.WriteLine($"📸 Screenshot saved: {fileName}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Screenshot error: {ex.Message}");
        }
    }
}