import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Check, X, Settings, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { TooltipIconButton } from "../thread/tooltip-icon-button";

export default function MCPConfigPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Record<string, any>>({
    enso_basic: {
      transport: "sse",
      url: "https://mcp.enso.sh/sse"
    },
    enso_rag: {
      transport: "sse",
      url: "https://mcp-sse-o98o.onrender.com/sse"
    }
  });
  const [configText, setConfigText] = useState("");
  const [error, setError] = useState("");
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("mcp");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        setConfigText(JSON.stringify(parsedConfig, null, 2));
      } else {
        // Use default config
        setConfigText(JSON.stringify(config, null, 2));
      }
    } catch (err) {
      console.error("Error loading MCP config:", err);
      // Use default config
      setConfigText(JSON.stringify(config, null, 2));
    }
  }, []);
  
  const handleSave = () => {
    try {
      const newConfig = JSON.parse(configText);
      localStorage.setItem("mcp", JSON.stringify(newConfig));
      setConfig(newConfig);
      setError("");
      setIsOpen(false);
      toast.success("MCP configuration saved successfully");
    } catch (err) {
      setError("Invalid JSON format");
    }
  };
  
  const handleReset = () => {
    localStorage.removeItem("mcp");
    setConfig({
      enso_basic: {
        transport: "sse",
        url: "https://mcp.enso.sh/sse"
      },
      enso_rag: {
        transport: "sse",
        url: "https://mcp-sse-o98o.onrender.com/sse"
      }
    });
    setConfigText(JSON.stringify({
      enso_basic: {
        transport: "sse",
        url: "https://mcp.enso.sh/sse"
      },
      enso_rag: {
        transport: "sse",
        url: "https://mcp-sse-o98o.onrender.com/sse"
      }
    }, null, 2));
    setError("");
    setIsOpen(false);
    toast.success("MCP configuration has been reset to defaults");
  };
  
  return (
    <div className="relative">
      <TooltipIconButton
        tooltip="MCP Configuration"
        onClick={() => setIsOpen(!isOpen)}
				className="mt-3"
      >
        <Settings className="w-4 h-4" />
      </TooltipIconButton>
      
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-80 bg-white border rounded-md shadow-lg p-3 z-20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">MCP Configuration</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          
          <div className="mb-3">
            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              className="w-full h-40 p-2 text-xs font-mono border rounded resize-none"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}