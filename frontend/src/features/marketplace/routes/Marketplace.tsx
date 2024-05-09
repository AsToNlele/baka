// Author: Alexandr Celakovsky - xcelak00
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Link,
    Select,
    SelectItem,
    useDisclosure,
} from "@nextui-org/react"
import { PageTitle } from "@/features/app/components/PageTitle"
import { ProductType } from "@/utils/types"
import { useProductList } from "@/features/marketplace/hooks/useProductList"
import { FaPlus, FaSave, FaShoppingCart } from "react-icons/fa"
import { CreateSharedProductModal } from "@/features/marketplace/components/CreateSharedProductModal"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
import { useSetPrimaryGreenhouse } from "@/features/marketplace/hooks/useSetPrimaryGreenhouse"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { useGreenhouseList } from "@/features/greenhouses/hooks/useGreenhouseList"
import { useState } from "react"
import { useIsAdmin } from "@/hooks/isAdmin"
import { ProductImage } from "@/features/marketplace/components/ProductImage"

export const Marketplace = () => {
    const { data: products } = useProductList()
    const isAdmin = useIsAdmin()

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    return (
        <div className="flex flex-col gap-4">
            <PageTitle title="Marketplace" />

            <PreferredGreenhouse />

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Products</h2>
                    {isAdmin && (
                        <>
                            <Button
                                isIconOnly
                                color="primary"
                                size="sm"
                                onPress={onOpen}
                            >
                                <FaPlus />
                            </Button>
                            <CreateSharedProductModal
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                                onClose={onClose}
                            />
                        </>
                    )}
                </div>
                {products && <ProductList products={products} />}
            </div>
        </div>
    )
}

const Product = ({ product }: { product: ProductType }) => {
    const { addItem } = useShoppingCartStore()
    return (
        <Card shadow="sm">
            <CardBody
                className="overflow-visible p-0"
                as={Link}
                href={`/app/marketplace/products/${product.id}`}
            >
                <ProductImage
                    id={product.id}
                    image={product.image}
                    title={product.name}
                />
            </CardBody>
            <CardFooter className="justify-between text-small">
                <b>{product.name}</b>
                <Button
                    isIconOnly
                    color="primary"
                    onPress={() => {
                        addItem({ product: product.id!, quantity: 1 })
                    }}
                >
                    <FaShoppingCart />
                </Button>
            </CardFooter>
        </Card>
    )
}

const ProductList = ({ products }: { products: ProductType[] }) => {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
                <Product key={index} product={product} />
            ))}
        </div>
    )
}

export const PreferredGreenhouse = () => {
    const { mutate } = useSetPrimaryGreenhouse()
    const { data: profileData } = useProfile()
    const { data: greenhousesData } = useGreenhouseList()
    const [selectedGreenhouse, setSelectedGreenhouse] = useState<
        number | string | null
    >(null)
    return (
        <div>
            <h2 className="text-xl">Preferred greenhouse</h2>
            <div className="flex gap-2">
                {greenhousesData && profileData && (
                    <Select
                        aria-label="Preferred greenhouse"
                        defaultSelectedKeys={
                            profileData?.profile?.primary_greenhouseId !== null
                                ? profileData?.profile?.primary_greenhouseId?.toString()
                                : undefined
                        }
                        classNames={{
                            base: "w-1/2",
                        }}
                        value={selectedGreenhouse!}
                        onChange={(e) => {
                            setSelectedGreenhouse(e.target.value)
                        }}
                    >
                        {greenhousesData ? (
                            greenhousesData?.map((greenhouse) => {
                                return greenhouse ? (
                                    <SelectItem
                                        key={greenhouse.id!.toString()}
                                        value={greenhouse.id}
                                    >
                                        {greenhouse.title}
                                    </SelectItem>
                                ) : (
                                    <SelectItem key={0} value={0}>
                                        No Greenhouse
                                    </SelectItem>
                                )
                            })
                        ) : (
                            <SelectItem key={-1} value={-1}>
                                No Greenhouses
                            </SelectItem>
                        )}
                    </Select>
                )}
                <div>
                    <Button
                        onPress={() =>
                            mutate({
                                greenhouseId: selectedGreenhouse as number,
                            })
                        }
                        isIconOnly
                        className="h-full"
                    >
                        <FaSave />
                    </Button>
                </div>
            </div>
        </div>
    )
}
