export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-2">Access denied</h2>
        <p className="text-sm text-slate-600">You don't have permission to access this page.</p>
      </div>
    </div>
  );
}
