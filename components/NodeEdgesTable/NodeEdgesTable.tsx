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

    const columns = useMemo(
        () => Object.keys(data[0] || {}).map((key) => (
            columnHelper.accessor(key, {
                cell: info => info.getValue(),
                header: () => <span>{TableService.lookupName(key)}</span>,
            })
        )),
        [data]
    );

    const table = useReactTable<any>({
        data,
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

    useEffect(() => {
        fetchData();
    }, []);

    if (loadingState === 'loading') return <LoadingSpinner />;
    if (loadingState === 'error') return <p className="w-full text-center p-8">Something went wrong! Table view might not be supported here yet.</p>;

    if (data.length === 0) return <p className="w-full text-center p-8">No data to display. Table view might not be supported here yet.</p>;

    return (
        <div className="p-4 w-full overflow-x-scroll">
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
