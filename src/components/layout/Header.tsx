import { Bot } from "lucide-react";

interface HeaderProps {
  breadcrumbs: string[];
  children?: React.ReactNode;
}

export function Header({ breadcrumbs, children }: HeaderProps) {
  return (
    <header className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Bot className="h-5 w-5 text-primary" />
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <span className={index === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""}>
                  {crumb}
                </span>
                {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </header>
  );
}