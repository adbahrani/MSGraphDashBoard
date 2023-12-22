import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { TeamActivity } from '../services/teams'
import { useNavigate } from 'react-router-dom'
import { defaultColDef } from '../utils/agGridSettings'
import { Team } from '@microsoft/microsoft-graph-types'

interface TeamsListProps {
    teams: Array<Team & TeamActivity>
}

export const TeamsList = ({ teams }: TeamsListProps) => {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)
    const columnDefs: ColDef[] = [
        { field: 'displayName', headerName: 'Team Name' },
        { field: 'summary.ownersCount', headerName: 'Owners' },
        { field: 'summary.membersCount', headerName: 'Members' },
        { field: 'summary.guestsCount', headerName: 'Guests' },
        {
            valueGetter: ({ data }) => {
                const { postMessages, replyMessages, urgentMessages, channelMessages } = data.details[0]
                return postMessages + replyMessages + urgentMessages + channelMessages
            },
            headerName: 'Messages',
        },
        {
            valueGetter: ({ data }) => data.details[0].meetingsOrganized,
            headerName: 'Meetings',
        },
        {
            valueGetter: ({ data }) => data.details[0].mentions,
            headerName: 'Mentions',
        },
        {
            valueGetter: ({ data }) => data.details[0].reactions,
            headerName: 'Reactions',
        },
    ]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.id
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    const onRowClicked = useCallback(({ data }: { data: Team }) => {
        navigate(`/group?id=${data.id}`)
    }, [])

    return (
        <div className="ag-theme-alpine" style={{ width: 'calc(100%)', height: 'calc(100% - 16px)' }}>
            <AgGridReact
                ref={gridRef}
                rowData={teams}
                columnDefs={columnDefs}
                getRowId={getRowId}
                onFirstDataRendered={onFirstDataRendered}
                onRowClicked={onRowClicked}
                defaultColDef={defaultColDef}
            ></AgGridReact>
        </div>
    )
}
