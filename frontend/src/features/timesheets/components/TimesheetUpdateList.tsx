// Author: Alexandr Celakovsky - xcelak00
import { TimesheetStatus } from "@/features/timesheets/components/TimesheetStatus"
import { TimesheetUpdateType } from "@/utils/types"
import { parseIsoAndFormatDateTime } from "@/utils/utils"
import { Card, CardBody } from "@nextui-org/react"

type TimesheetUpdateListProps = {
    data: Array<TimesheetUpdateType>
}
export const TimesheetUpdateList = ({ data }: TimesheetUpdateListProps) => {
    console.log(data)
    return (
        <div>
            <h4 className="mb-2 mt-4 text-center text-xl">History</h4>
            <div className="flex flex-col gap-4">
                {data.map((update, index) => (
                    <TimesheetUpdate key={index} data={update} />
                ))}
            </div>
        </div>
    )
}

const TimesheetUpdate = ({ data }: { data: TimesheetUpdateType }) => {
    return (
        <Card>
            <CardBody>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap justify-around gap-2">
                        <p>{parseIsoAndFormatDateTime(data.created_at!)}</p>
                        <div>
                            <TimesheetStatus status={data.status!} size="sm" />
                        </div>
                        <p>{data.author.user}</p>
                    </div>
                    {data.message && <p className="text-center">Message: {data.message}</p>}
                    <div className="flex flex-col flex-wrap md:flex-row md:justify-around">
                        {data?.working_hours?.length > 0 && (
                            <div>
                                <p className="text-center">Time worked</p>
                                {data?.working_hours?.map((workingHour, index) => (
                                    <div key={index} className="text-center">
                                        <p className="text-sm">
                                            {parseIsoAndFormatDateTime(
                                                workingHour.start!,
                                            )}{" "}
                                            -{" "}
                                            {parseIsoAndFormatDateTime(
                                                workingHour.end!,
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data?.items?.length > 0 && (
                            <div>
                                <p className="text-center">Jobs</p>
                                {data?.items?.map((timesheetItem, index) => (
                                    <div key={index} className="text-center">
                                        <p className="text-sm">
                                            {timesheetItem.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data?.pay && (
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p>Pay requested</p>
                                <h5 className="text-lg">{data.pay}</h5>
                            </div>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
