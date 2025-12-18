export default function Section({ title, children }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">{title}</h1>
      {children}
    </div>
  )
}
