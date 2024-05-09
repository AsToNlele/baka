// Author: Alexandr Celakovsky - xcelak00
import { SmallLoading } from "@/components/Loading"
import { PageTitle } from "@/features/app/components/PageTitle"
import { useBadgeRarity } from "@/features/badges/hooks/useBadgeRarity"
import { useUserStats } from "@/features/badges/hooks/useUserStats"
import {
    emission_badges,
    flowerbed_badges,
    marketplace_badges,
    savings_badges,
    special_badges,
} from "@/features/badges/utils/badges"
import {
    BadgeRarityListResponse,
    BadgeTypeImage,
    UserStatsResponse,
} from "@/utils/types"
import {
    Image,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Progress,
} from "@nextui-org/react"

export const Badges = () => {
    // Statistiky uzivatele
    const { data: userStatsData, isLoading: userStatsLoading } = useUserStats()
    // Rarita odznaků
    const { data: badgeRarityData, isLoading: badgeRarityLoading } =
        useBadgeRarity()

    return (
        <div>
            <PageTitle title="Badges" />
            {!userStatsData ||
                !badgeRarityData ||
                userStatsLoading ||
                badgeRarityLoading ? (
                <SmallLoading />
            ) : (
                <div className="flex flex-col gap-4">
                    <LevelStats userStatsData={userStatsData} />
                    <BadgeList
                        userStatsData={userStatsData}
                        badgeRarityData={badgeRarityData}
                    />
                </div>
            )}
        </div>
    )
}

const LevelStats = ({
    userStatsData,
}: {
    userStatsData: UserStatsResponse
}) => {
    const diff =
        userStatsData.next_level !== null
            ? userStatsData.next_level.xp_required - userStatsData.xp_sum
            : 0
    const percentage =
        userStatsData.next_level !== null
            ? ((userStatsData.xp_sum -
                userStatsData.current_level.xp_required) /
                (userStatsData.next_level.xp_required -
                    userStatsData.current_level.xp_required)) *
            100
            : 100
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-xl">
                Current level:{" "}
                <span className="text-2xl font-bold">
                    {userStatsData.current_level.name}({userStatsData.current_level.level})
                </span>
            </h1>
            <Progress value={percentage} />
            {userStatsData.next_level === null ? (
                <p className="text-lg">You have reached the highest level!</p>
            ) : (
                    <>
                        <p className="text-lg">
                            {diff} XP needed to reach {userStatsData.next_level.name}
                        </p>
                        <p>
                            Your next reward is a {userStatsData.next_level.reward} discount
                        </p>
                    </>
            )}
        </div>
    )
}

const Badge = ({
    badge: { name, description, xp, image },
    unlocked,
    rarity,
}: {
    badge: {
        name: string
        description: string
        badge_type: string
        badge_level: number
        xp: number
        image: string
    }
    unlocked: boolean
    rarity: number | undefined
}) => {
    const toPercent = (rarity: number | undefined) => {
        if (!rarity) return 0
        return rarity * 100
    }

    return (
        <Popover>
            <PopoverTrigger>
                <div className={`${!unlocked ? "grayscale" : ""}`}>
                    <Image src={image} alt="flowerbed1" />
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="px-1 py-2">
                    <p className="text-small">{name}</p>
                    <p className="text-tiny">{description}</p>
                    <p className="text-tiny">XP: {xp}</p>
                    <p className="text-tiny">{toPercent(rarity)}% of users</p>
                    {!unlocked && <p className="text-tiny">Locked</p>}
                </div>
            </PopoverContent>
        </Popover>
    )
}

const BadgeList = ({
    userStatsData,
    badgeRarityData,
}: {
    userStatsData: UserStatsResponse
    badgeRarityData: BadgeRarityListResponse
}) => {
    return (
        <div className="flex flex-col gap-8">
            <FlowerbedBadges
                inputBadges={userStatsData.badges}
                badgeRarity={badgeRarityData}
            />
            <MarketplaceBadges
                inputBadges={userStatsData.badges}
                badgeRarity={badgeRarityData}
            />
            <EmissionBadges
                inputBadges={userStatsData.badges}
                badgeRarity={badgeRarityData}
            />
            <SavingsBadges
                inputBadges={userStatsData.badges}
                badgeRarity={badgeRarityData}
            />
            <SpecialBadges
                inputBadges={userStatsData.badges}
                badgeRarity={badgeRarityData}
            />
        </div>
    )
}

const BadgeSectionList = ({
    badgeList,
    inputBadges,
    badgeRarity,
}: {
    badgeList: Array<BadgeTypeImage>
    inputBadges: UserStatsResponse["badges"]
    badgeRarity: BadgeRarityListResponse
}) => {
    const emptyBadgeCount = 5 - badgeList?.length
    return (
        <div className="w-full md:max-w-[600px]">
            <div className="flex justify-evenly gap-2">
                {badgeList.map((badge) => {
                    const unlocked = inputBadges.some(
                        (inputBadge) =>
                            inputBadge.badge_type === badge.badge_type &&
                            inputBadge.badge_level === badge.badge_level,
                    )
                    const rarity = badgeRarity.find(
                        (rarity) =>
                            rarity.badge_type === badge.badge_type &&
                            rarity.badge_level === badge.badge_level,
                    )?.rarity
                    return (
                        <Badge
                            key={badge.badge_type + badge.badge_level}
                            badge={badge}
                            unlocked={unlocked}
                            rarity={rarity}
                        />
                    )
                })}
                {Array.from({ length: emptyBadgeCount }).map((_, index) => (
                    <div key={index} className="size-20"></div>
                ))}
            </div>
        </div>
    )
}

const FlowerbedBadges = ({
    inputBadges,
    badgeRarity,
}: {
    inputBadges: UserStatsResponse["badges"]
    badgeRarity: BadgeRarityListResponse
}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-center text-2xl">Flowerbeds</h2>
            <BadgeSectionList
                badgeList={flowerbed_badges}
                inputBadges={inputBadges}
                badgeRarity={badgeRarity}
            />
        </section>
    )
}

const MarketplaceBadges = ({
    inputBadges,
    badgeRarity,
}: {
    inputBadges: UserStatsResponse["badges"]
    badgeRarity: BadgeRarityListResponse
}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-center text-2xl">Product shopping</h2>
            <BadgeSectionList
                badgeList={marketplace_badges}
                inputBadges={inputBadges}
                badgeRarity={badgeRarity}
            />
        </section>
    )
}

const EmissionBadges = ({
    inputBadges,
    badgeRarity,
}: {
    inputBadges: UserStatsResponse["badges"]
    badgeRarity: BadgeRarityListResponse
}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-center text-2xl">Saved emissions</h2>
            <BadgeSectionList
                badgeList={emission_badges}
                inputBadges={inputBadges}
                badgeRarity={badgeRarity}
            />
        </section>
    )
}

const SavingsBadges = ({
    inputBadges,
    badgeRarity,
}: {
    inputBadges: UserStatsResponse["badges"]
    badgeRarity: BadgeRarityListResponse
}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-center text-2xl">Savings</h2>
            <BadgeSectionList
                badgeList={savings_badges}
                inputBadges={inputBadges}
                badgeRarity={badgeRarity}
            />
        </section>
    )
}

const SpecialBadges = ({
    inputBadges,
    badgeRarity,
}: {
    inputBadges: UserStatsResponse["badges"]
    badgeRarity: BadgeRarityListResponse
}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-center text-2xl">Special</h2>
            <BadgeSectionList
                badgeList={special_badges}
                inputBadges={inputBadges}
                badgeRarity={badgeRarity}
            />
        </section>
    )
}
