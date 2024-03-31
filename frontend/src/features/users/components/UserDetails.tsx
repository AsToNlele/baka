import { EditUserModal } from "@/features/users/components/EditUserModal"
import { UserType } from "@/utils/types"
import { Button, useDisclosure } from "@nextui-org/react"
import { FaEdit } from "react-icons/fa"

type UserDetailProps = {
    data: UserType
}

export const UserDetails = ({ data }: UserDetailProps) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    return (
        <div>
            <div className="mb-8 flex items-center gap-2">
                <h2 className="text-2xl font-bold">User Detail</h2>
                <Button color="secondary" isIconOnly onPress={onOpen}>
                    <FaEdit />
                </Button>
            </div>
            <div className="flex gap-4">
                <div>
                    <p>Username: {data.username}</p>
                    <p>Email: {data.email}</p>
                </div>
                <div>
                    <p>First name: {data.first_name}</p>
                    <p>Last name: {data.last_name}</p>
                </div>
            </div>
            <EditUserModal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} />
        </div>
    )
}
