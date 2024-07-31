import {
  // Core
  useReactTable,
  getCoreRowModel,
  flexRender,
  // Pagination
  getPaginationRowModel,
  // Sorting
  getSortedRowModel,
  // Filtering
  getFilteredRowModel
} from "@tanstack/react-table";
import mData from "../MOCK_DATA.json";
import { useMemo, useState } from "react";
import { DateTime } from "luxon";

function BasicTable() {
  // create instance of our data next
  const data = useMemo(() => mData, []);

  // create instance to define our columns
  /**  @type import('@tanstack/react-table').ColumnDef<any> */
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      footer: "ID",
    },
    // (3) Header groups with child columns
    {
      header: "Name",
      columns: [
        {
          header: "First Name",
          accessorKey: "first_name",
          footer: "First Name",
        },
        {
          header: "Last Name",
          accessorKey: "last_name",
          footer: "Last Name",
        },
      ],
    },
    //  (2) Using accessorFn
    // You can also combine data in rows by using accessorFn (accessor function)
    // {header: "Name", accessorFn: row => `${row.first_name} ${row.last_name}`},

    // (1) Basic table
    // {
    //   header: "First Name",
    //   accessorKey: "first_name",
    //   footer: "First Name",
    // },
    // {
    //   header: "Last Name",
    //   accessorKey: "last_name",
    //   footer: "Last Name",
    // },
    {
      header: "Email",
      accessorKey: "email",
      footer: "Email",
    },
    {
      header: "Gender",
      accessorKey: "gender",
      footer: "Gender",
    },
    {
      header: "Date of Birth",
      accessorKey: "dob",
      footer: "Date of Birth",
      cell: (info) =>
        DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
    },
  ];

  const [ sorting, setSorting ] = useState([]);
  const [ filtering, setFiltering ] = useState('');

  // create instance of our table first
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="w3-container">
      <input
        type='text'
        value={filtering}
        onChange={e => setFiltering(e.target.value)}
      />
      <table className="w3-table-all">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {/* (3) We will check whether there is a placeholder header for each row i.e. Name
                  If none, then, null. If "Name" is the placeholder header for first-name and last-name, it'll render above it */}
                  {header.isPlaceholder
                    ? null
                    : <div>
                        {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {
                        {
                          asc: '🔼', desc: '🔽'
                        } [header.column.getIsSorted() ?? null]
                      }
                      </div>
                      }
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {/* 
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            // (3)
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
        */}
      </table>
      <div>
        {/* <button onClick={() => table.setPageIndex(0)}>First</button>
        <button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Prev</button>
        <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next</button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Last</button> */}
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export default BasicTable;
