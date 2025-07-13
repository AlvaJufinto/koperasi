interface Column<T> {
  label: string;
  accessor: keyof T | string;
  align?: "left" | "right" | "center";
  render?: (item: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export default function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <table className="min-w-full text-sm border border-gray-300">
      <thead className="bg-gray-100 text-left">
        <tr>
          {columns.map((col, i) => (
            <th
              key={i}
              className={`px-3 py-2 border text-${col.align ?? "left"}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50">
            {columns.map((col, colIndex) => (
              <td
                key={colIndex}
                className={`px-3 py-2 border text-${col.align ?? "left"}`}
              >
                {col.render
                  ? col.render(item, rowIndex)
                  : // @ts-ignore
                    item[col.accessor] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
