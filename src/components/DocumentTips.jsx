export default function DocumentTips() {
  const checks = [
    { text: "In high resolution and clearly visible from edge to edge", good: true },
    { text: "Any original digital or a scanned copy of the original physical document", good: true },
    { text: "Not written on or modified, cropped, and not a screenshot", good: false },
    { text: "No glare or shadows", good: false },
  ];

  return (
    <div className="mt-6 mb-10">
      <h3 className="font-semibold mb-2">Make sure the document is:</h3>
      <ul className="space-y-2">
        {checks.map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <span className={`${item.good ? "text-green-600" : "text-red-600"}`}>
              {item.good ? "✔" : "✖"}
            </span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
