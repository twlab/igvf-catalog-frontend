'use client';

import { NodeType } from "@/lib/services/NodeService";
import TableService from "@/lib/services/TableService";
import {
    createColumnHelper,
    getCoreRowModel,
    flexRender,
    useReactTable,
} from "@tanstack/react-table"
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import LoadingSpinner from "./LoadingSpinner";

const columnHelper = createColumnHelper<any>();

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
    const [hasMore, setHasMore] = useState(false);

    const table = useReactTable<any>({
        data,
        columns: Object.keys(data[0] || {}).map((key) => (
            columnHelper.accessor(key, {
                cell: info => info.getValue(),
                header: () => <span>{TableService.lookupName(key)}</span>,
            })
        )),
        getCoreRowModel: getCoreRowModel(),
    });

    const fetchMore = async () => {
        try {
            const newRows = await TableService.getTableData(baseType, baseId, tableType, data.length);
            if (newRows.length === 0) {
                setHasMore(false);
                return;
            }
            setData([...data, ...newRows, ...newRows]);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchMore();
    }, []);

    if (data.length === 0) return <LoadingSpinner />;

    return (
        <div className="p-2">
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} style={{ width: 30 }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} style={{ width: 30 }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                {/* <tfoot>
                    {table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot> */}
            </table>
        </div>
    )
}
