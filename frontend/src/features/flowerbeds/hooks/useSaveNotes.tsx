import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { LocalNote } from "@/features/flowerbeds/components/Diary"

const saveNotes = ({
    id,
    notes,
}: {
    id: number | string
    notes: Array<LocalNote>
}) => {
    const newNotes = notes.map((note) => ({
        id: note.id,
        date: note.date,
        note: note.note,
    }))

    return api.put(`/flowerbeds/${id}/set_notes/`, {
        notes: newNotes,
    })
}

export const useSaveNotes = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: saveNotes,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["userFlowerbed", data.data.id],
            })
        },
    })
    return mutation
}
