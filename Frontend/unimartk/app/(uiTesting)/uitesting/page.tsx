"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";

// TypeScript type definitions for shadcn colors
type ShadcnColorVariable =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "border"
  | "input"
  | "ring"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5";

type ShadcnBackgroundClass = `bg-${ShadcnColorVariable}`;
type ShadcnTextClass = `text-${ShadcnColorVariable}`;
type ShadcnBorderClass = `border-${ShadcnColorVariable}`;

// Union type for all possible shadcn color classes
type ShadcnColorClass =
  | ShadcnBackgroundClass
  | ShadcnTextClass
  | ShadcnBorderClass;

// Interface for color configuration
interface ColorConfig {
  colorClass: ShadcnColorClass;
  label: string;
  type?: "background" | "text" | "border";
}

interface ColorSection {
  title: string;
  colors: ColorConfig[];
}

interface ColorBlockProps extends ColorConfig {}

const ColorBlock: React.FC<ColorBlockProps> = ({
  colorClass,
  label,
  type = "background",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { setTheme, theme } = useTheme();

  const getDisplayClass = () => {
    if (type === "background") return colorClass;
    if (type === "text") return `${colorClass} bg-background`;
    if (type === "border") return `border-4 ${colorClass} bg-background`;
  };

  const getTooltipText = () => {
    return colorClass;
  };

  return (
    <div className="relative">
      <div
        className={`w-16 h-16 rounded-lg cursor-pointer transition-transform hover:scale-105 ${getDisplayClass()}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {type === "text" && (
          <div className="flex items-center justify-center h-full text-sm font-medium">
            Aa
          </div>
        )}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg border whitespace-nowrap z-10">
          {getTooltipText()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
        </div>
      )}

      <div className="text-xs text-center mt-1 text-muted-foreground">
        {label}
      </div>
    </div>
  );
};

const ColorSection: React.FC<ColorSection> = ({ title, colors }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
        {colors.map((color, index) => (
          <ColorBlock key={index} {...color} />
        ))}
      </div>
    </div>
  );
};

export default function ShadcnColorPalette() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const colorTypes = [
    {
      title: "Color Types Reference",
      items: [
        {
          name: "background",
          description: "Main background color",
          usage: "bg-background",
        },
        {
          name: "foreground",
          description: "Main text color",
          usage: "text-foreground",
        },
        { name: "card", description: "Card background", usage: "bg-card" },
        {
          name: "card-foreground",
          description: "Text on card",
          usage: "text-card-foreground",
        },
        {
          name: "popover",
          description: "Popover background",
          usage: "bg-popover",
        },
        {
          name: "popover-foreground",
          description: "Text on popover",
          usage: "text-popover-foreground",
        },
        {
          name: "primary",
          description: "Primary action color",
          usage: "bg-primary",
        },
        {
          name: "primary-foreground",
          description: "Text on primary",
          usage: "text-primary-foreground",
        },
        {
          name: "secondary",
          description: "Secondary action color",
          usage: "bg-secondary",
        },
        {
          name: "secondary-foreground",
          description: "Text on secondary",
          usage: "text-secondary-foreground",
        },
        { name: "muted", description: "Muted background", usage: "bg-muted" },
        {
          name: "muted-foreground",
          description: "Muted text",
          usage: "text-muted-foreground",
        },
        { name: "accent", description: "Accent color", usage: "bg-accent" },
        {
          name: "accent-foreground",
          description: "Text on accent",
          usage: "text-accent-foreground",
        },
        {
          name: "destructive",
          description: "Error/danger color",
          usage: "bg-destructive",
        },
        {
          name: "destructive-foreground",
          description: "Text on destructive",
          usage: "text-destructive-foreground",
        },
        {
          name: "border",
          description: "Default border color",
          usage: "border-border",
        },
        {
          name: "input",
          description: "Input border color",
          usage: "border-input",
        },
        { name: "ring", description: "Focus ring color", usage: "ring-ring" },
      ],
    },
  ];
  const colorSections: ColorSection[] = [
    {
      title: "Background Colors",
      colors: [
        { colorClass: "bg-background" as const, label: "background" },
        { colorClass: "bg-foreground" as const, label: "foreground" },
        { colorClass: "bg-card" as const, label: "card" },
        { colorClass: "bg-card-foreground" as const, label: "card-fg" },
        { colorClass: "bg-popover" as const, label: "popover" },
        { colorClass: "bg-popover-foreground" as const, label: "popover-fg" },
        { colorClass: "bg-primary" as const, label: "primary" },
        { colorClass: "bg-primary-foreground" as const, label: "primary-fg" },
        { colorClass: "bg-secondary" as const, label: "secondary" },
        {
          colorClass: "bg-secondary-foreground" as const,
          label: "secondary-fg",
        },
        { colorClass: "bg-muted" as const, label: "muted" },
        { colorClass: "bg-muted-foreground" as const, label: "muted-fg" },
        { colorClass: "bg-accent" as const, label: "accent" },
        { colorClass: "bg-accent-foreground" as const, label: "accent-fg" },
        { colorClass: "bg-destructive" as const, label: "destructive" },
        {
          colorClass: "bg-destructive-foreground" as const,
          label: "destructive-fg",
        },
        { colorClass: "bg-border" as const, label: "border" },
        { colorClass: "bg-input" as const, label: "input" },
        { colorClass: "bg-ring" as const, label: "ring" },
        { colorClass: "bg-chart-1" as const, label: "chart-1" },
        { colorClass: "bg-chart-2" as const, label: "chart-2" },
        { colorClass: "bg-chart-3" as const, label: "chart-3" },
        { colorClass: "bg-chart-4" as const, label: "chart-4" },
        { colorClass: "bg-chart-5" as const, label: "chart-5" },
      ],
    },
    {
      title: "Text Colors",
      colors: [
        {
          colorClass: "text-background" as const,
          label: "background",
          type: "text" as const,
        },
        {
          colorClass: "text-foreground" as const,
          label: "foreground",
          type: "text" as const,
        },
        {
          colorClass: "text-card" as const,
          label: "card",
          type: "text" as const,
        },
        {
          colorClass: "text-card-foreground" as const,
          label: "card-fg",
          type: "text" as const,
        },
        {
          colorClass: "text-popover" as const,
          label: "popover",
          type: "text" as const,
        },
        {
          colorClass: "text-popover-foreground" as const,
          label: "popover-fg",
          type: "text" as const,
        },
        {
          colorClass: "text-primary" as const,
          label: "primary",
          type: "text" as const,
        },
        {
          colorClass: "text-primary-foreground" as const,
          label: "primary-fg",
          type: "text" as const,
        },
        {
          colorClass: "text-secondary" as const,
          label: "secondary",
          type: "text" as const,
        },
        {
          colorClass: "text-secondary-foreground" as const,
          label: "secondary-fg",
          type: "text" as const,
        },
        {
          colorClass: "text-muted" as const,
          label: "muted",
          type: "text" as const,
        },
        {
          colorClass: "text-muted-foreground" as const,
          label: "muted-fg",
          type: "text" as const,
        },
        {
          colorClass: "text-accent" as const,
          label: "accent",
          type: "text" as const,
        },
        {
          colorClass: "text-accent-foreground" as const,
          label: "accent-fg",
          type: "text" as const,
        },
        {
          colorClass: "text-destructive" as const,
          label: "destructive",
          type: "text" as const,
        },
        {
          colorClass: "text-destructive-foreground" as const,
          label: "destructive-fg",
          type: "text" as const,
        },
        {
          colorClass: "text-border" as const,
          label: "border",
          type: "text" as const,
        },
        {
          colorClass: "text-input" as const,
          label: "input",
          type: "text" as const,
        },
        {
          colorClass: "text-ring" as const,
          label: "ring",
          type: "text" as const,
        },
        {
          colorClass: "text-chart-1" as const,
          label: "chart-1",
          type: "text" as const,
        },
        {
          colorClass: "text-chart-2" as const,
          label: "chart-2",
          type: "text" as const,
        },
        {
          colorClass: "text-chart-3" as const,
          label: "chart-3",
          type: "text" as const,
        },
        {
          colorClass: "text-chart-4" as const,
          label: "chart-4",
          type: "text" as const,
        },
        {
          colorClass: "text-chart-5" as const,
          label: "chart-5",
          type: "text" as const,
        },
      ],
    },
    {
      title: "Border Colors",
      colors: [
        {
          colorClass: "border-background" as const,
          label: "background",
          type: "border" as const,
        },
        {
          colorClass: "border-foreground" as const,
          label: "foreground",
          type: "border" as const,
        },
        {
          colorClass: "border-card" as const,
          label: "card",
          type: "border" as const,
        },
        {
          colorClass: "border-card-foreground" as const,
          label: "card-fg",
          type: "border" as const,
        },
        {
          colorClass: "border-popover" as const,
          label: "popover",
          type: "border" as const,
        },
        {
          colorClass: "border-popover-foreground" as const,
          label: "popover-fg",
          type: "border" as const,
        },
        {
          colorClass: "border-primary" as const,
          label: "primary",
          type: "border" as const,
        },
        {
          colorClass: "border-primary-foreground" as const,
          label: "primary-fg",
          type: "border" as const,
        },
        {
          colorClass: "border-secondary" as const,
          label: "secondary",
          type: "border" as const,
        },
        {
          colorClass: "border-secondary-foreground" as const,
          label: "secondary-fg",
          type: "border" as const,
        },
        {
          colorClass: "border-muted" as const,
          label: "muted",
          type: "border" as const,
        },
        {
          colorClass: "border-muted-foreground" as const,
          label: "muted-fg",
          type: "border" as const,
        },
        {
          colorClass: "border-accent" as const,
          label: "accent",
          type: "border" as const,
        },
        {
          colorClass: "border-accent-foreground" as const,
          label: "accent-fg",
          type: "border" as const,
        },
        {
          colorClass: "border-destructive" as const,
          label: "destructive",
          type: "border" as const,
        },
        {
          colorClass: "border-destructive-foreground" as const,
          label: "destructive-fg",
          type: "border" as const,
        },
        {
          colorClass: "border-border" as const,
          label: "border",
          type: "border" as const,
        },
        {
          colorClass: "border-input" as const,
          label: "input",
          type: "border" as const,
        },
        {
          colorClass: "border-ring" as const,
          label: "ring",
          type: "border" as const,
        },
        {
          colorClass: "border-chart-1" as const,
          label: "chart-1",
          type: "border" as const,
        },
        {
          colorClass: "border-chart-2" as const,
          label: "chart-2",
          type: "border" as const,
        },
        {
          colorClass: "border-chart-3" as const,
          label: "chart-3",
          type: "border" as const,
        },
        {
          colorClass: "border-chart-4" as const,
          label: "chart-4",
          type: "border" as const,
        },
        {
          colorClass: "border-chart-5" as const,
          label: "chart-5",
          type: "border" as const,
        },
      ],
    },
  ];

  return (
    <div className={`min-h-screen bg-background p-6 ${theme}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Shadcn Color Palette
              </h1>
              <p className="text-muted-foreground">
                Hover over any color block to see the Tailwind class name.
                Switch themes to see color variations.
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* TypeScript Types Reference */}
        <div className="mb-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            TypeScript Types
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-md">
              <h3 className="font-medium text-sm mb-2 text-foreground">
                Color Variable Types
              </h3>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto text-foreground">
                {`type ShadcnColorVariable = 
  | 'background' | 'foreground'
  | 'card' | 'card-foreground'
  | 'popover' | 'popover-foreground'
  | 'primary' | 'primary-foreground'
  | 'secondary' | 'secondary-foreground'
  | 'muted' | 'muted-foreground'
  | 'accent' | 'accent-foreground'
  | 'destructive' | 'destructive-foreground'
  | 'border' | 'input' | 'ring'
  | 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5';`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-md">
                <h3 className="font-medium text-sm mb-2 text-foreground">
                  Background Classes
                </h3>
                <pre className="text-xs bg-background p-3 rounded overflow-x-auto text-foreground">
                  {`type ShadcnBackgroundClass = 
  \`bg-\${ShadcnColorVariable}\`;

// Examples:
// 'bg-primary'
// 'bg-accent-foreground'`}
                </pre>
              </div>

              <div className="p-4 bg-muted/30 rounded-md">
                <h3 className="font-medium text-sm mb-2 text-foreground">
                  Text Classes
                </h3>
                <pre className="text-xs bg-background p-3 rounded overflow-x-auto text-foreground">
                  {`type ShadcnTextClass = 
  \`text-\${ShadcnColorVariable}\`;

// Examples:
// 'text-primary'
// 'text-muted-foreground'`}
                </pre>
              </div>

              <div className="p-4 bg-muted/30 rounded-md">
                <h3 className="font-medium text-sm mb-2 text-foreground">
                  Border Classes
                </h3>
                <pre className="text-xs bg-background p-3 rounded overflow-x-auto text-foreground">
                  {`type ShadcnBorderClass = 
  \`border-\${ShadcnColorVariable}\`;

// Examples:
// 'border-primary'
// 'border-input'`}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-md">
              <h3 className="font-medium text-sm mb-2 text-foreground">
                Union Type for All Color Classes
              </h3>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto text-foreground">
                {`type ShadcnColorClass = ShadcnBackgroundClass | ShadcnTextClass | ShadcnBorderClass;

// Usage in components:
interface ButtonProps {
  variant?: ShadcnBackgroundClass;
  textColor?: ShadcnTextClass;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'bg-primary', textColor = 'text-primary-foreground' }) => {
  return <button className={\`\${variant} \${textColor} px-4 py-2 rounded\`}>Click me</button>;
};`}
              </pre>
            </div>
          </div>
        </div>

        {/* Color Types Reference */}
        <div className="mb-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Color Types Reference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorTypes[0].items.map((item, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">
                    {item.name}
                  </span>
                  <code className="text-xs bg-background px-2 py-1 rounded text-muted-foreground">
                    {item.usage}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {colorSections.map((section, index) => (
          <ColorSection
            key={index}
            title={section.title}
            colors={section.colors}
          />
        ))}

        <div className="mt-12 p-4 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">
            Usage Examples
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <code className="bg-muted px-2 py-1 rounded">bg-primary</code> -
              Primary background color
            </div>
            <div>
              <code className="bg-muted px-2 py-1 rounded">
                text-primary-foreground
              </code>{" "}
              - Text color that contrasts with primary
            </div>
            <div>
              <code className="bg-muted px-2 py-1 rounded">border-accent</code>{" "}
              - Accent border color
            </div>
            <div>
              <code className="bg-muted px-2 py-1 rounded">
                hover:bg-secondary
              </code>{" "}
              - Secondary background on hover
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
