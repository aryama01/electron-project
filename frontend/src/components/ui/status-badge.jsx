import { cn } from "../../lib/utils";

const statusConfig = {
  completed: { class: "status-completed", defaultLabel: "Completed" },
  pending: { class: "status-pending", defaultLabel: "Pending" },
  overdue: { class: "status-overdue", defaultLabel: "Overdue" },
  active: { class: "status-active", defaultLabel: "Active" },
  inactive: { class: "bg-muted text-muted-foreground", defaultLabel: "Inactive" },
};

export function StatusBadge({ status, label }) {
  const config = statusConfig[status];

  return (
      <span className={cn("status-badge", config.class)}>
      <span
          className={cn(
              "w-1.5 h-1.5 rounded-full",
              status === "completed" && "bg-success",
              status === "pending" && "bg-warning",
              status === "overdue" && "bg-destructive",
              status === "active" && "bg-info",
              status === "inactive" && "bg-muted-foreground"
          )}
      />
        {label || config.defaultLabel}
    </span>
  );
}
