'use client';

import { NodeType } from "@/lib/services/NodeService";
import TableService from "@/lib/services/TableService";
import {
    createColumnHelper,
    getCoreRowModel,
    flexRender,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react";
import Papa from 'papaparse';
import LoadingSpinner from "../LoadingSpinner";
import './table.css'
import classNames from "classnames";

const columnHelper = createColumnHelper<any>();

type LoadingState = 'loading' | 'loaded' | 'error';

export default function NodeEdgesTable({
    baseType,
    baseId,
    tableType
}: {
    baseType: NodeType,
    baseId: string,
    tableType: NodeType
}) {
    const [data, setData] = useState<any>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>('loading');
    const [searchTerm, setSearchTerm] = useState("");

    const columns = useMemo(
        () => Object.keys(data[0] || {}).map((key) => (
            columnHelper.accessor(key, {
                cell: info => info.getValue(),
                header: () => <span>{TableService.lookupName(key)}</span>,
            })
        )),
        [data]
    );

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((row: any) => {
            return Object.values(row).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [data, searchTerm]);

    const table = useReactTable<any>({
        data: filteredData,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: 'onChange'
    });

    const fetchData = async () => {
        try {
            const newRows = await TableService.getTableData(baseType, baseId, tableType);
            setData([...data, ...newRows]);
            setLoadingState('loaded');
        } catch (error) {
            setLoadingState('error');
            console.error(error);
        }
    }

    const exportToCSV = () => {
        const csv = Papa.unparse(data);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();

        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loadingState === 'loading') return <LoadingSpinner />;
    if (loadingState === 'error') return <p className="w-full text-center p-8">Something went wrong! Table view might not be supported here yet.</p>;

    if (data.length === 0) return <p className="w-full text-center p-8">No data to display. Table view might not be supported here yet.</p>;

    return (
        <div className="p-4 w-full overflow-x-scroll">
            <div className="mb-4 flex flex-row items-center justify-between">
                <button onClick={exportToCSV} className="mb-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
                    Export to CSV
                </button>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="p-2 pl-10 border rounded"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 absolute top-1/2 left-2.5 transform -translate-y-1/2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
            </div>
            <table
                {...{
                    style: {
                        width: table.getCenterTotalSize(),
                        tableLayout: "fixed",

                    },
                }}
            >
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    {...{
                                        key: header.id,
                                        colSpan: header.colSpan,
                                        style: {
                                            width: header.getSize(),
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                        },
                                    }}
                                    className="p-2 cursor-pointer"
                                >
                                    <div
                                        className={classNames(
                                            { 'cursor-pointer select-none': header.column.getCanSort() }
                                        )}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {{
                                            asc: '🔼 ',
                                            desc: '🔽 ',
                                        }[header.column.getIsSorted() as string] ?? null}
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                    </div>
                                    <div
                                        {...{
                                            onMouseDown: header.getResizeHandler(),
                                            onTouchStart: header.getResizeHandler(),
                                            className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                                                }`,
                                        }}
                                    />
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td
                                    {...{
                                        key: cell.id,
                                        style: {
                                            width: cell.column.getSize(),
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                        },
                                    }}
                                    className="p-2"
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
