import { TimesheetUpdateType } from "@/utils/types"

type UpdateListProps = {
    data: Array<TimesheetUpdateType>
}

export const UpdateList = ({ data }: UpdateListProps) => {
    return (
        <div>
            {data.map((update, index) => (
                <Update key={index} data={update} />
            ))}
        </div>
    )
}

type UpdateProps = {
    data: TimesheetUpdateType
}

export const Update = ({ data }: UpdateProps) => {
    return (
        <div className="flex gap-4">
            <div>{data.title}</div>
            <div>{data.description}</div>
        </div>
    )
}
    
