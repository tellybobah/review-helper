export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Add sidebar navigation */}
      <aside className="hidden w-64 border-r bg-muted/30 lg:block">
        <div className="p-6 font-bold">ReviewBoost</div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
