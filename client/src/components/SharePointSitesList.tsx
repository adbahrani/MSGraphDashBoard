import { ColDef, GetRowIdFunc, GetRowIdParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { useCallback, useMemo, useRef } from "react"
import { SiteActivity } from "../services/share-point"
import { TableLoader } from "./shared/Loaders/TableLoader"

interface SharePointSitesListProps {
    sites: Array<any>
    width: string,
    height: string,
    columnDefs: ColDef[],
    isLoading?: boolean,
    handleRowClick: (site: SiteActivity) => void
}

export const SharePointSitesList = ({ sites, height, width, columnDefs, isLoading = false, handleRowClick }: SharePointSitesListProps) => {
    const gridRef = useRef<AgGridReact>(null)


    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.siteId
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    const onRowClicked = useCallback(({ data }: { data: SiteActivity }) => {
        handleRowClick(data)
    }, [])

    return (
        <div className="ag-theme-alpine" style={{ height, width, margin: '8px' }}>
            {isLoading ? <TableLoader width={width} height={height} headers={columnDefs.map((columDef) => columDef.headerName || '')} rowsNum={6} /> : <AgGridReact
                ref={gridRef}
                rowData={sites}
                columnDefs={columnDefs}
                getRowId={getRowId}
                onFirstDataRendered={onFirstDataRendered}
                onRowClicked={onRowClicked}
                defaultColDef={{ resizable: true, sortable: true }}
            ></AgGridReact>}
        </div>
    )
}