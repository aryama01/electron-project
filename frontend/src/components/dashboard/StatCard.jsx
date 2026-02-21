import { cn } from "../../lib/utils"; // adjust if needed

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary/5 border-primary/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
  info: "bg-info/5 border-info/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }) {
  return (
      <div className={cn("stat-card animate-fade-in", variantStyles[variant])}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>

            {trend && (
                <p
                    className={cn(
                        "text-sm mt-2 font-medium",
                        trend.isPositive ? "text-success" : "text-destructive"
                    )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}% from last month
                </p>
            )}
          </div>

          <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
            <Icon size={24} />
          </div>
        </div>
      </div>
  );
}
