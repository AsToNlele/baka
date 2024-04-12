import { SmallLoading } from "@/components/Loading"
import { PageTitle } from "@/features/app/components/PageTitle"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { ApproveRejectTimesheet } from "@/features/timesheets/components/ApproveRejectTimesheet"
import { ResubmitOrCloseTimesheet } from "@/features/timesheets/components/ResubmitOrCloseTimesheet"
import { TimesheetItemList } from "@/features/timesheets/components/TimesheetItemList"
import { TimesheetStatus } from "@/features/timesheets/components/TimesheetStatus"
import { TimesheetUpdateList } from "@/features/timesheets/components/TimesheetUpdateList"
import { WorkingHourList } from "@/features/timesheets/components/WorkingHourList"
import { useTimesheetDetail } from "@/features/timesheets/hooks/useTimesheetDetail"
import { inSameTimePeriod, parseIsoAndFormatDateTime } from "@/utils/utils"
import { Card, CardBody } from "@nextui-org/react"
import { useParams } from "react-router-dom"

export const TimesheetDetail = () => {
    const { id } = useParams()
    const timesheetId = id ? parseInt(id) : null
    const { data, isLoading } = useTimesheetDetail(timesheetId)
    const { data: user } = useProfile()

    const isAuthor =
        data?.author.id === user?.profile.id || user?.profile.superuser
    const isOwner =
        data?.greenhouse.owner === user?.profile.id || user?.profile.superuser

    console.log({ isAuthor })

    return (
        <div className="flex flex-col gap-4">
            {isLoading || !data ? (
                <SmallLoading />
            ) : (
                <div>
                    <PageTitle title={`Timesheet ${data.title}`} />
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            {/* <div>Status:</div> */}
                            {/* <div>{upperCaseFirstLetter(data.status ?? "")}</div> */}
                            <TimesheetStatus status={data.status!} />
                            <div className="flex gap-4">
                                <div>Author:</div>
                                <div>{data?.author.user}</div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div>Greenhouse:</div>
                            <div>{data?.greenhouse.title}</div>
                        </div>
                        <div className="flex gap-4">
                            <div>Created:</div>
                            <div>
                                {parseIsoAndFormatDateTime(
                                    data?.created_at ?? "",
                                )}
                            </div>
                        </div>
                        {!inSameTimePeriod(
                            data.created_at!,
                            data.updated_at!,
                        ) && (
                                <div className="flex gap-4">
                                    <div>Updated:</div>
                                    <div>
                                        {parseIsoAndFormatDateTime(
                                            data?.updated_at ?? "",
                                        )}
                                    </div>
                                </div>
                            )}
                        {data?.description && (
                            <div>
                                <p>Description:</p>
                                <p>{data?.description}</p>
                            </div>
                        )}

                        <WorkingHourList data={data.working_hours} />
                        <TimesheetItemList data={data.items} />

                        <Card>
                            <CardBody>
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <p>Pay requested</p>
                                    <h5 className="text-lg text-primary">
                                        {data.pay}
                                    </h5>
                                </div>
                            </CardBody>
                        </Card>

                        {isOwner && data.status === "submitted" && (
                            <ApproveRejectTimesheet data={data} />
                        )}
                        {isAuthor && data.status === "submitted" && (
                            <div className="my-2 text-center text-lg">
                                Waiting for approval
                            </div>
                        )}
                        {isAuthor && data.status === "rejected" && (
                            <>
                                <div className="flex items-center justify-center gap-2">
                                    <TimesheetStatus
                                        status="rejected"
                                        size="lg"
                                    />
                                    Message: {data?.updates?.[data?.updates.length-1].message}
                                </div>
                                <div>
                                    <ResubmitOrCloseTimesheet data={data} />
                                </div>
                            </>
                        )}

                        <TimesheetUpdateList data={data.updates} />
                    </div>
                </div>
            )}
        </div>
    )
}
