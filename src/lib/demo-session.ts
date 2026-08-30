import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

export type DemoRole = "teacher" | "guidance" | "management" | "family";

export type DemoMembership = {
  organizationId: string;
  organizationName: string;
  role: DemoRole;
};

export type DemoSession = {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  organizationName: string;
  role: DemoRole;
  memberships: DemoMembership[];
};

type MembershipRow = {
  organization_id: string;
  role: string;
  organizations: { name: string } | Array<{ name: string }> | null;
};

export const demoProfiles: Record<DemoRole, { name: string; label: string; description: string }> =
  {
    teacher: {
      name: "Docente",
      label: "Docente",
      description: "Seguimiento del grupo, actividades y aprendizaje adaptativo.",
    },
    guidance: {
      name: "Orientación",
      label: "Orientación",
      description: "Alertas, perfiles educativos e informes de apoyo.",
    },
    management: {
      name: "Dirección",
      label: "Dirección",
      description: "Visión general, informes y configuración del centro.",
    },
    family: {
      name: "Familia",
      label: "Familia",
      description: "Vista limitada del progreso de una estudiante simulada.",
    },
  };

function mapOrganizationRole(role: string | null | undefined): DemoRole | null {
  if (role === "organization_admin") return "management";
  if (role === "teacher") return "teacher";
  if (role === "orientation" || role === "pt") return "guidance";
  if (role === "student") return "family";
  return null;
}

function organizationName(row: MembershipRow) {
  const organization = Array.isArray(row.organizations) ? row.organizations[0] : row.organizations;
  return organization?.name?.trim() || "Organización";
}

export async function loadDemoSession(
  client: SupabaseClient,
  auth: Session | User | null,
  preferredOrganizationId?: string | null,
): Promise<DemoSession | null> {
  const user = auth && "user" in auth ? auth.user : auth;
  if (!user) return null;

  const [{ data: membershipRows, error: membershipError }, { data: profile }] = await Promise.all([
    client
      .from("organization_memberships")
      .select("organization_id, role, organizations(name)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true }),
    client.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
  ]);

  if (membershipError) return null;

  const memberships = ((membershipRows ?? []) as MembershipRow[]).flatMap((row) => {
    const role = mapOrganizationRole(row.role);
    return role
      ? [{ organizationId: row.organization_id, organizationName: organizationName(row), role }]
      : [];
  });
  if (!memberships.length) return null;

  const activeMembership =
    memberships.find(({ organizationId }) => organizationId === preferredOrganizationId) ??
    memberships[0];
  const fallbackName = user.email ?? demoProfiles[activeMembership.role].name;
  const metadataName =
    typeof user.user_metadata.name === "string" ? user.user_metadata.name.trim() : "";
  const profileName = typeof profile?.display_name === "string" ? profile.display_name.trim() : "";

  return {
    id: user.id,
    email: user.email ?? "",
    name: profileName || metadataName || fallbackName,
    organizationId: activeMembership.organizationId,
    organizationName: activeMembership.organizationName,
    role: activeMembership.role,
    memberships,
  };
}

export function selectDemoOrganization(session: DemoSession, organizationId: string): DemoSession {
  const membership = session.memberships.find((item) => item.organizationId === organizationId);
  if (!membership) return session;
  return { ...session, ...membership };
}
