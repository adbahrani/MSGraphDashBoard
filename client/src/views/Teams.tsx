import { useCallback, useEffect, useState } from 'react'
import { TeamActivity, TeamsService } from '../services/teams'
import { Block } from '../components/shared/Block'
import Box from '@mui/material/Box'
import { TeamsList } from '../components/TeamsList'
import Chip from '@mui/material/Chip'
import { AgChartsReact } from 'ag-charts-react'
import { UsersService } from '../services/users'
import { InfluencersList } from '../components/InfluencersList'
import { TeamsFilesList } from '../components/TeamsFilesList'
import { Team } from '@microsoft/microsoft-graph-types-beta'

export const Teams = () => {
    const [teams, setTeams] = useState<Array<Team & TeamActivity>>([])
    const [filesActivies, setFilesActivies] = useState<Array<any>>()
    const [teamsStats, setTeamsStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        orphaned: 0,
        public: 0,
        private: 0,
        calls: 0,
        meetings: 0,
        messages: 0,
        activeMembers: 0,
        guestEnabled: 0,
    })

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

    const getFileActivitiesByTeams = useCallback(async () => {
        try {
            const data = await TeamsService.getFileActivitiesByTeams()
            setFilesActivies(data)
        } catch (error: any) {
            console.error('Error fetching file activities:', error.message)
        }
    }, [])

    // const FileActivitiesByTeamsWaited = async () => await
    useEffect(() => {
        const minDate = new Date()
        minDate.setDate(minDate.getDate() - selectedPeriod)
        getFileActivitiesByTeams()

        TeamsService.getActivity(selectedPeriod).then(teams => {
            setTeams(teams)
            const stats = {
                active: 0,
                public: 0,
                guestEnabled: 0,
                messages: 0,
                meetings: 0,
                orphaned: 0,
            }
            for (const activity of teams) {
                const { guests, postMessages, replyMessages, urgentMessages, channelMessages, meetingsOrganized } =
                    activity.details[0]
                stats.active += new Date(activity.lastActivityDate) >= minDate ? 1 : 0
                stats.public += activity.teamType === 'Public' ? 1 : 0
                stats.guestEnabled += guests ? 1 : 0
                stats.messages += postMessages + replyMessages + urgentMessages + channelMessages
                stats.meetings += meetingsOrganized
                stats.orphaned += activity.summary?.ownersCount === 0 ? 1 : 0
            }
            setTeamsStats(currStats => ({
                ...currStats,
                total: teams.length,
                active: stats.active,
                inactive: teams.length - stats.active,
                public: stats.public,
                private: teams.length - stats.public,
                meetings: stats.meetings,
                messages: stats.messages,
                guestEnabled: stats.guestEnabled,
                orphaned: stats.orphaned,
            }))

            setReactionsData(
                teams.map(activity => {
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
            const stats = {
                activeMembers: 0,
                calls: 0,
            }
            for (const activity of usersActivity) {
                stats.activeMembers += new Date(activity.lastActivityDate) >= minDate ? 1 : 0
                stats.calls += activity.callCount
            }
            setTeamsStats(currStats => ({
                ...currStats,
                activeMembers: stats.activeMembers,
                calls: stats.calls,
            }))

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

    const Stat = (props: { title: string; property: keyof typeof teamsStats }) => (
        <Block title={props.title}>
            <Box component="span" sx={boxStyle}>
                {teamsStats[props.property]}
            </Box>
        </Block>
    )

    return (
        <div style={{}}>
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

            <Box component="div" sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 0.5fr 0.5fr' }}>
                <Stat title="Teams count" property="total" />
                <Stat title="Active Teams" property="active" />
                <Stat title="Inactive Teams" property="inactive" />
                <Stat title="Orphaned Teams" property="orphaned" />
                <Stat title="Public" property="public" />
                <Stat title="Private" property="private" />
            </Box>

            <Box component="div" sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
                <Stat title="Calls" property="calls" />
                <Stat title="Meetings" property="meetings" />
                <Stat title="Messages" property="messages" />
                <Stat title="Active Member" property="activeMembers" />
                <Stat title="Guest-Enabled" property="guestEnabled" />
            </Box>

            <Block title="Teams Activity">
                <div style={{ height: '30vh' }}>
                    <TeamsList teams={teams} />
                </div>
            </Block>

            <Box component="div" sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <Block title="File collaboration">
                    <TeamsFilesList FilesByTeams={filesActivies} />
                </Block>
                <Block title="Top influencers">
                    <div style={{ height: '280px' }}>
                        <InfluencersList users={influencersData} />
                    </div>
                </Block>
            </Box>

            <AgChartsReact options={{ ...reactionsOptions, data: reactionsData }} />
            <AgChartsReact options={{ ...influencersOptions, data: influencersData }} />
        </div>
    )
}
