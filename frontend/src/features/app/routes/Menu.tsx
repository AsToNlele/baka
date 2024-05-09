// Author: Alexandr Celakovsky - xcelak00
import { Button } from "@nextui-org/react"
import { Link } from "react-router-dom"

export const Menu = () => {
    return (
        <>
            <div>Menu</div>
            <Button as={Link} color="primary" to="/app/profile">
                Profile
            </Button>
        </>
    )
}
