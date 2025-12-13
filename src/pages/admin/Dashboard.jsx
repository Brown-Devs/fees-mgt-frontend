export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">Total Students<br/><div className="text-xl font-bold">—</div></div>
        <div className="bg-white p-4 rounded-lg shadow">Total Teachers<br/><div className="text-xl font-bold">—</div></div>
        <div className="bg-white p-4 rounded-lg shadow">Pending Fees<br/><div className="text-xl font-bold">—</div></div>
        <div className="bg-white p-4 rounded-lg shadow">Active Branches<br/><div className="text-xl font-bold">—</div></div>
      </div>
    </div>
  );
}
