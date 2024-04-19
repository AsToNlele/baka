import { useSaveNotes } from "@/features/flowerbeds/hooks/useSaveNotes"
import { FlowerbedNoteType } from "@/utils/types"
import { parseIsoAndFormat } from "@/utils/utils"
import {
    Button,
    Card,
    CardBody,
    Listbox,
    ListboxItem,
    ScrollShadow,
    Selection,
    Textarea,
} from "@nextui-org/react"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { toast } from "sonner"

type DiaryProps = {
    notes: Array<FlowerbedNoteType>
    flowerbedId?: number
}

export type LocalNote = {
    id?: number | undefined
    date?: string | null | undefined
    note?: string | null | undefined
    user_flowerbed?: number | null | undefined
}
export const Diary = ({ notes, flowerbedId }: DiaryProps) => {
    const saveNotes = useSaveNotes()
    const [selectedNote, setSelectedNote] = useState<Selection>(new Set(["-1"]))
    const [localNotes, setLocalNotes] = useState<Array<LocalNote>>([])
    const selectedNoteId: string | null =
        selectedNote !== "all" ? selectedNote.values().next().value : null
    const selectedNoteObj = localNotes.find(
        (note) => note.id?.toString() === selectedNoteId,
    )

    const save = () => {
        saveNotes.mutate(
            {
                id: flowerbedId!,
                notes: localNotes,
            },
            {
                onSuccess: () => {
                    toast.success("Notes saved successfully")
                },
            },
        )
    }

    const remove = () => {
        const newNotes = localNotes.filter(
            (note) => note.id?.toString() !== selectedNoteId,
        )
        setLocalNotes(newNotes)
        setSelectedNote(new Set([newNotes[0]?.id!.toString()]))
    }

    const addNewNote = () => {
        const newNote = {
            id: Math.floor(Math.random() * -1000),
            date: new Date().toISOString(),
            note: "",
        }
        setLocalNotes([...localNotes, newNote])
        setSelectedNote(new Set([newNote.id.toString()]))
    }

    useEffect(() => {
        if (notes && notes.length > 0) {
            setLocalNotes(notes)
            setSelectedNote(new Set([notes[0].id!.toString()]))
        }
    }, [notes])

    const changeNote = (id: string | null, value: string) => {
        const newNotes = localNotes.map((note) => {
            if (note.id?.toString() === id) {
                return { ...note, note: value }
            }
            return note
        })
        setLocalNotes(newNotes)
    }

    if (
        selectedNote !== "all" &&
        selectedNote.has("-1") &&
        notes &&
        notes.length > 0 &&
        localNotes.length === 0
    ) {
        setSelectedNote(new Set([localNotes[0]?.id!.toString()]))
    }

    return (
        <div className="flex size-full h-full max-h-80 min-h-80 flex-col gap-2">
            <h1 className="mb-2 text-lg font-semibold">Diary</h1>
            <Card
                classNames={{
                    base: "h-full flex-1",
                }}
            >
                <CardBody className="h-full">
                    {" "}
                    <div className="flex size-full gap-1">
                        <div>
                            <ScrollShadow className="max-h-56">
                                <Listbox
                                    selectionMode="single"
                                    selectedKeys={selectedNote}
                                    onSelectionChange={setSelectedNote}
                                    label="Select a note"
                                    disallowEmptySelection
                                >
                                    {localNotes.map((note) => (
                                        <ListboxItem
                                            classNames={{
                                                selectedIcon: "text-secondary",
                                            }}
                                            key={note?.id?.toString() ?? "-1"}
                                            value={note?.id!.toString()}
                                        >
                                            {parseIsoAndFormat(
                                                note?.date ?? "",
                                            )}
                                        </ListboxItem>
                                    ))}
                                </Listbox>
                            </ScrollShadow>
                            <div className="mt-4 flex justify-center gap-2">
                                <Button
                                    isIconOnly
                                    color="primary"
                                    onPress={addNewNote}
                                >
                                    <FaPlus />
                                </Button>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-1 flex-col gap-2">
                            <Textarea
                                placeholder="Write a note..."
                                className="h-full"
                                value={selectedNoteObj?.note ?? ""}
                                onValueChange={(value) => {
                                    changeNote(selectedNoteId, value)
                                }}
                            />
                            <div className="flex justify-around gap-8">
                                <Button
                                    color="secondary"
                                    onPress={save}
                                    isLoading={saveNotes.isPending}
                                >
                                    Save
                                </Button>
                                <Button color="danger" onPress={remove}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
