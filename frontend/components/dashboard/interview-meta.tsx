import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TypeBadge({ type }: { type: string }) {
  let badgeVariant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline" = "default";

  switch (type) {
    case "Technical":
      badgeVariant = "default";
      break;

    case "HR":
      badgeVariant = "secondary";
      break;

    case "Aptitude":
      badgeVariant = "outline";
      break;

    case "Full":
      badgeVariant = "default";
      break;

    default:
      badgeVariant = "outline";
  }

  return <Badge variant={badgeVariant}>{type}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  let color = "";

  switch (status) {
    case "Completed":
      color = "bg-green-500";
      break;

    case "In Progress":
      color = "bg-blue-500";
      break;

    case "Not Started":
      color = "bg-gray-500";
      break;

    default:
      color = "bg-gray-500";
  }

  return (
    <Badge variant="outline">
      <span className={cn("mr-2 h-2 w-2 rounded-full", color)} />
      {status}
    </Badge>
  );
}

export function ScoreText({ score }: { score: number }) {
  let color = "";

  if (score >= 85) {
    color = "text-green-600";
  } else if (score >= 70) {
    color = "text-blue-600";
  } else {
    color = "text-orange-500";
  }

  return <span className={cn("font-semibold", color)}>{score}%</span>;
}