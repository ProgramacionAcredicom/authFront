import { 
  Monitor
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiApple,
  SiLinux,
  SiAndroid,
  SiGooglechrome,
  SiFirefox,
  SiOpera,
  SiBrave,
  SiSafari,
  SiPostman,
} from "react-icons/si";
import { FaWindows, FaEdge } from "react-icons/fa";

export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (sessionDate.getTime() === today.getTime()) {
    // Hoy
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `Última actividad hoy a las ${hours}:${minutes}`;
  } else if (sessionDate.getTime() === yesterday.getTime()) {
    // Ayer
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `Última actividad ayer a las ${hours}:${minutes}`;
  } else {
    // Fecha específica
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `Última actividad ${day} de ${month}, ${hours}:${minutes}`;
  }
}

export type DeviceType = {
  os: "macos" | "ios" | "windows" | "linux" | "android" | "postman" | "other";
  browser: "chrome" | "firefox" | "edge" | "brave" | "opera" | "safari" | "other";
};

export function detectDeviceType(deviceInfo: string): DeviceType {
  const lowerInfo = deviceInfo.toLowerCase();
  
  // Detectar sistema operativo
  let os: DeviceType["os"] = "other";
  if (lowerInfo.includes("mac os") || lowerInfo.includes("macos") || (lowerInfo.includes("mac") && !lowerInfo.includes("macintosh"))) {
    os = "macos";
  } else if (lowerInfo.includes("ios") || lowerInfo.includes("iphone") || lowerInfo.includes("ipad")) {
    os = "ios";
  } else if (lowerInfo.includes("windows") || lowerInfo.includes("win32") || lowerInfo.includes("win64") || lowerInfo.includes("win ")) {
    os = "windows";
  } else if (lowerInfo.includes("linux") || lowerInfo.includes("ubuntu") || lowerInfo.includes("debian") || lowerInfo.includes("fedora") || lowerInfo.includes("centos")) {
    os = "linux";
  } else if (lowerInfo.includes("android")) {
    os = "android";
  } else if (lowerInfo.includes("postman")) {
    os = "postman";
  }

  // Detectar navegador (debe verificarse después del SO para evitar falsos positivos)
  let browser: DeviceType["browser"] = "other";
  if (lowerInfo.includes("chrome") && !lowerInfo.includes("edg") && !lowerInfo.includes("chromium")) {
    // Chrome puede estar en Edge, así que verificamos que no sea Edge
    if (!lowerInfo.includes("edg/")) {
      browser = "chrome";
    }
  } else if (lowerInfo.includes("firefox") || lowerInfo.includes("fxios")) {
    browser = "firefox";
  } else if (lowerInfo.includes("edg") || lowerInfo.includes("edge") || lowerInfo.includes("edgios") || lowerInfo.includes("edga")) {
    browser = "edge";
  } else if (lowerInfo.includes("brave")) {
    browser = "brave";
  } else if (lowerInfo.includes("opera") || lowerInfo.includes("opr/") || lowerInfo.includes("opios")) {
    browser = "opera";
  } else if (lowerInfo.includes("safari") && !lowerInfo.includes("chrome") && !lowerInfo.includes("crios")) {
    browser = "safari";
  }

  return { os, browser };
}

export function getDeviceIcon(deviceInfo: string): IconType | LucideIcon {
  const { os, browser } = detectDeviceType(deviceInfo);
  
  // Iconos de sistemas operativos
  if (os === "macos" || os === "ios") {
    return SiApple;
  } else if (os === "windows") {
    return FaWindows;
  } else if (os === "linux") {
    return SiLinux;
  } else if (os === "android") {
    return SiAndroid;
  } else if (os === "postman") {
    return SiPostman;
  }
  
  // Iconos de navegadores (si no se detectó SO específico)
  if (browser === "chrome") {
    return SiGooglechrome;
  } else if (browser === "firefox") {
    return SiFirefox;
  } else if (browser === "edge") {
    return FaEdge;
  } else if (browser === "opera") {
    return SiOpera;
  } else if (browser === "brave") {
    return SiBrave;
  } else if (browser === "safari") {
    return SiSafari;
  }
  
  // Por defecto
  return Monitor;
}

export function getDeviceColor(deviceInfo: string): string {
  const { os, browser } = detectDeviceType(deviceInfo);
  
  // Colores basados en sistema operativo (prioridad)
  if (os === "macos") {
    return "bg-gray-700";
  } else if (os === "ios") {
    return "bg-gray-600";
  } else if (os === "windows") {
    return "bg-blue-600";
  } else if (os === "linux") {
    return "bg-orange-600";
  } else if (os === "android") {
    return "bg-green-600";
  } else if (os === "postman") {
    return "bg-orange-500";
  }
  
  // Colores basados en navegador si no se detectó SO específico
  if (browser === "chrome") {
    return "bg-yellow-500";
  } else if (browser === "firefox") {
    return "bg-orange-500";
  } else if (browser === "edge") {
    return "bg-blue-500";
  } else if (browser === "brave") {
    return "bg-orange-400";
  } else if (browser === "opera") {
    return "bg-red-500";
  } else if (browser === "safari") {
    return "bg-blue-400";
  }
  
  // Color por defecto
  return "bg-gray-500";
}
