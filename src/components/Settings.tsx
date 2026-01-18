import React, { useEffect, useState } from "react";
import { Save, ArrowLeft, Eye, EyeOff, ChevronDown } from "lucide-react";

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [apiKey, setApiKey] = useState("");

  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash-exp");
  const [language, setLanguage] = useState("en");
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false);

  useEffect(() => {
    // Load settings from storage
    chrome.storage.local.get(
      [
        "apiKey",
        "elevenLabsKey",
        "baseUrl",
        "model",
        "language",
        "selectedDeviceId",
      ],
      (result) => {
        setApiKey(
          (result.apiKey as string) || import.meta.env.VITE_API_KEY || "",
        );
        setElevenLabsKey(
          (result.elevenLabsKey as string) ||
            import.meta.env.VITE_ELEVENLABS_API_KEY ||
            "",
        );
        setBaseUrl(
          (result.baseUrl as string) || import.meta.env.VITE_BASE_URL || "",
        );
        setModel(
          (result.model as string) ||
            import.meta.env.VITE_MODEL ||
            "gemini-3-flash",
        );
        setLanguage(
          (result.language as string) || import.meta.env.VITE_LANGUAGE || "en",
        );
        setSelectedDeviceId((result.selectedDeviceId as string) || "");
      },
    );

    // Load available audio devices
    const loadDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput",
        );
        setAudioDevices(audioInputs);
      } catch (error) {
        console.error("Failed to enumerate devices:", error);
      }
    };
    loadDevices();
  }, []);

  const handleSave = () => {
    chrome.storage.local.set(
      { apiKey, elevenLabsKey, baseUrl, model, language, selectedDeviceId },
      () => {
        onBack();
      },
    );
  };

  return (
    <div className="settings-page" style={{ padding: "20px" }}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            padding: 0,
            marginRight: "10px",
          }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2>Settings</h2>
      </div>

      {/* General Section */}
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--primary-color)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          General
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: "16px",
            alignItems: "center",
            paddingRight: "8px",
          }}
        >
          <label
            style={{
              fontWeight: "500",
              color: "var(--text-color)",
              fontSize: "14px",
            }}
          >
            Language
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "none",
                background: "var(--input-bg)",
                color: "inherit",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            >
              <option value="en">English</option>
              <option value="zh">Chinese (Simplified)</option>
            </select>
            <ChevronDown
              size={16}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                opacity: 0.5,
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          height: "1px",
          background: "var(--border-color)",
          marginBottom: "24px",
          opacity: 0.3,
        }}
      />

      {/* AI Services Section */}
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--primary-color)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          AI Services
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              alignItems: "center",
              paddingRight: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "500",
                color: "var(--text-color)",
                fontSize: "14px",
              }}
            >
              API Key
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API Key"
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--input-bg)",
                  color: "inherit",
                  outline: "none",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  color: "var(--text-color)",
                  opacity: 0.5,
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              alignItems: "center",
              paddingRight: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "500",
                color: "var(--text-color)",
                fontSize: "14px",
              }}
            >
              Base URL
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--input-bg)",
                  color: "inherit",
                  outline: "none",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              alignItems: "center",
              paddingRight: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "500",
                color: "var(--text-color)",
                fontSize: "14px",
              }}
            >
              Model Name
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gemini-2.0-flash-exp"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--input-bg)",
                  color: "inherit",
                  outline: "none",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "1px",
          background: "var(--border-color)",
          marginBottom: "24px",
          opacity: 0.3,
        }}
      />

      {/* Voice & Speech Section */}
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--primary-color)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Voice & Speech
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              alignItems: "center",
              paddingRight: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "500",
                color: "var(--text-color)",
                fontSize: "14px",
              }}
            >
              ElevenLabs Key
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showElevenLabsKey ? "text" : "password"}
                value={elevenLabsKey}
                onChange={(e) => setElevenLabsKey(e.target.value)}
                placeholder="Enter your ElevenLabs API Key"
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--input-bg)",
                  color: "inherit",
                  outline: "none",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => setShowElevenLabsKey(!showElevenLabsKey)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  color: "var(--text-color)",
                  opacity: 0.5,
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showElevenLabsKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              alignItems: "center",
              paddingRight: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "500",
                color: "var(--text-color)",
                fontSize: "14px",
              }}
            >
              Microphone
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--input-bg)",
                  color: "inherit",
                  outline: "none",
                  appearance: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Default</option>
                {audioDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Device ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "var(--primary-color)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          fontWeight: "bold",
        }}
      >
        <Save size={18} />
        Save Settings
      </button>
    </div>
  );
};
