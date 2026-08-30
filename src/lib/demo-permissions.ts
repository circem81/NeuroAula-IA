import type { DemoRole } from "@/lib/demo-auth";

const roleRoutes: Record<DemoRole, readonly string[]> = {
  teacher: [
    "/demo/alumnado",
    "/demo/alumno",
    "/demo/adaptativo",
    "/demo/actividades",
    "/demo/informes",
    "/demo/alertas",
  ],
  guidance: ["/demo/alumnado", "/demo/alumno", "/demo/gemelo", "/demo/informes", "/demo/alertas"],
  management: ["/demo/informes", "/demo/config"],
  family: ["/demo/alumno/lucia-fernandez"],
};

export function canAccessDemoPath(role: DemoRole, pathname: string) {
  if (pathname === "/demo") return true;

  return roleRoutes[role].some((route) => {
    if (role === "family") return pathname === route;
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function canSeeDemoSection(role: DemoRole, route: string) {
  return canAccessDemoPath(role, route);
}
