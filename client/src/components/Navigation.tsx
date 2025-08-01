import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Language } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
export default function Navigation() {
  const { language, setLanguage } = useLanguage();
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Favorites", icon: Heart },
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/admin", label: "Admin", icon: Settings },
  ];

  const languageOptions = [
    { code: "en" as Language, flag: "🇺🇸", label: "EN" },

    { code: "ko" as Language, flag: "🇰🇷", label: "KO" },
    { code: "es" as Language, flag: "🇪🇸", label: "ES" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary">My Youtube </h1>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="language-selector"
            >
              {languageOptions.map(({ code, flag, label }) => (
                <option key={code} value={code}>
                  {flag} {label}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2",
                      isActive && "bg-primary text-primary-foreground",
                    )}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex space-x-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "p-2",
                    isActive && "bg-primary text-primary-foreground",
                  )}
                  data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
