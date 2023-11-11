import { useEffect, useState } from 'react'
import { Menu } from '../components/Menu'
import { Team, TeamActivity, TeamsService } from '../services/teams'
import { Block } from '../components/shared/Block'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { TeamsList } from '../components/TeamsList'
import Chip from '@mui/material/Chip'
import { AgChartsReact } from 'ag-charts-react'
import { UsersService } from '../services/users'

export const Teams = () => {
    const [teams, setTeams] = useState<Array<Team>>([])
    const [teamsActivity, setTeamsActivity] = useState<Array<TeamActivity>>([])
    const [activeTeamsCount, setActiveTeamsCount] = useState(0)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const periods = [
        { label: 'Last 30 days', value: 30 },
        { label: 'Last 90 days', value: 90 },
    ] as const

    const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30)
    const boxStyle = { display: 'flex', flex: 1, justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }

    const [reactionsData, setReactionsData] = useState<
        Array<{ teamName: string; mentions: number; messages: number; reactions: number; meetings: number }>
    >([])
    const reactionsOptions = {
        theme: {
            overrides: {
                column: {
                    axes: {
                        category: {
                            groupPaddingInner: 0,
                        },
                    },
                },
            },
        },
        title: {
            text: 'Mentions, Messages & Reactions by team',
        },
        series: [
            {
                type: 'column' as const,
                xKey: 'teamName',
                yKey: 'mentions',
                yName: 'Mentions',
            },
            {
                type: 'column' as const,
                xKey: 'teamName',
                yKey: 'messages',
                yName: 'Messages',
            },
            {
                type: 'column' as const,
                xKey: 'teamName',
                yKey: 'reactions',
                yName: 'Reactions',
            },
            {
                type: 'column' as const,
                xKey: 'teamName',
                yKey: 'meetings',
                yName: 'meetings',
            },
        ],
    }

    const [influencersData, setInfluencersData] = useState<
        Array<{ userName: string; messages: number; calls: number; meetings: number }>
    >([])
    const influencersOptions = {
        title: {
            text: 'Top 5 influencers',
        },
        series: [
            {
                type: 'column' as const,
                xKey: 'userName',
                yKey: 'messages',
                yName: 'Messages',
                stacked: true,
            },
            {
                type: 'column' as const,
                xKey: 'userName',
                yKey: 'calls',
                yName: 'Calls',
                stacked: true,
            },
            {
                type: 'column' as const,
                xKey: 'userName',
                yKey: 'meetings',
                yName: 'Meetings',
                stacked: true,
            },
        ],
    }

    useEffect(() => {
        TeamsService.getAll().then(setTeams)
    }, [])

    useEffect(() => {
        TeamsService.getActivity(selectedPeriod).then(teamsActivity => {
            setTeamsActivity(teamsActivity)

            const minDate = new Date()
            minDate.setDate(minDate.getDate() - selectedPeriod)
            let activeTeams = 0
            for (const activity of teamsActivity) {
                if (new Date(activity.lastActivityDate) >= minDate) {
                    activeTeams++
                }
            }
            setActiveTeamsCount(activeTeams)

            setReactionsData(
                teamsActivity.map(activity => {
                    const {
                        mentions,
                        postMessages,
                        replyMessages,
                        urgentMessages,
                        channelMessages,
                        reactions,
                        meetingsOrganized,
                    } = activity.details[0]
                    return {
                        teamName: activity.teamName,
                        mentions,
                        messages: postMessages + replyMessages + urgentMessages + channelMessages,
                        reactions,
                        meetings: meetingsOrganized,
                    }
                })
            )
        })

        UsersService.getActivity(selectedPeriod).then(usersActivity => {
            setInfluencersData(
                usersActivity
                    .map(activity => {
                        const {
                            userPrincipalName,
                            postMessages,
                            replyMessages,
                            urgentMessages,
                            teamChatMessageCount,
                            privateChatMessageCount,
                            callCount,
                            meetingCount,
                        } = activity
                        return {
                            userName: userPrincipalName,
                            messages:
                                postMessages +
                                replyMessages +
                                urgentMessages +
                                teamChatMessageCount +
                                privateChatMessageCount,
                            calls: callCount,
                            meetings: meetingCount,
                        }
                    })
                    .sort((a1, a2) => a2.messages + a2.calls + a2.meetings - (a1.messages + a1.calls + a1.meetings))
                    .slice(0, 5)
            )
        })
    }, [selectedPeriod])

    return (
        <>
            <div style={{ padding: '80px 64px 0' }}>
                <Block title="Teams count" onClick={() => setIsDrawerOpen(true)}>
                    <Box component="span" sx={boxStyle}>
                        {teams.length}
                    </Box>
                </Block>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {periods.map(period => (
                        <Chip
                            key={period.value}
                            label={period.label}
                            variant={selectedPeriod === period.value ? 'filled' : 'outlined'}
                            onClick={() => setSelectedPeriod(period.value)}
                        />
                    ))}
                </div>
                <Box component="div" sx={{ display: 'flex', gap: '8px' }}>
                    <Block title="Active teams">
                        <Box component="span" sx={boxStyle}>
                            {activeTeamsCount} ({Math.round((100 * activeTeamsCount) / teams.length)} %)
                        </Box>
                    </Block>
                    <Block title="Inactive teams">
                        <Box component="span" sx={boxStyle}>
                            {teams.length - activeTeamsCount} (
                            {100 - Math.round((100 * activeTeamsCount) / teams.length)} %)
                        </Box>
                    </Block>
                </Box>
                <AgChartsReact options={{ ...reactionsOptions, data: reactionsData }} />
                <AgChartsReact options={{ ...influencersOptions, data: influencersData }} />
            </div>
            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div style={{ width: '50vw', height: '100vh' }}>
                    <TeamsList teams={teams} />
                </div>
            </Drawer>
        </>
    )
}
