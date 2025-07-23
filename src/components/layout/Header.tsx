import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  breadcrumbs: string[];
  children?: React.ReactNode;
}

export function Header({ breadcrumbs, children }: HeaderProps) {
  const navigate = useNavigate();

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      // Workspace
      navigate("/");
    }
    // For agent names, we don't navigate since we're already on that page
  };

  const handleLogoClick = () => {
    alert("No homepage available");
  };

  return (
    <header className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Bot 
                className="h-5 w-5 text-primary cursor-pointer" 
                onClick={handleLogoClick}
              />
              <span className="mx-2">/</span>
            </div>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <span 
                  className={`${
                    index === breadcrumbs.length - 1 
                      ? "text-foreground font-medium" 
                      : "cursor-pointer hover:text-foreground transition-colors"
                  }`}
                  onClick={() => index < breadcrumbs.length - 1 && handleBreadcrumbClick(index)}
                >
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