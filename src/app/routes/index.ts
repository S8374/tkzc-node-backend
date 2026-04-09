import { Router } from "express"
import { AuthRoutes } from "../modules/auth/auth.route"
import { UserRoutes } from "../modules/user/user.route"
import { SliderRoutes } from "../modules/slider/slider.route"
import { sliderTypeRoutes } from "../modules/sliderType/slider.Type.route"
import { marqueeRoutes } from "../modules/marquees/marquee.route"
import { depositRouter } from "../modules/deposite/deposite.route"
import { inputRoutes } from "../modules/input/input.route"
import { AdminRoutes } from "../modules/admin/admin.route"
import { PromotionRoutes } from "../modules/promotion/promotion.route"
import { DepositRequestRoutes } from "../modules/depositRequest/depositRequest.route"
import { PartnerRoutes } from "../modules/partner/partner.route"
import { CryptoExchangeRoutes } from "../modules/cryptoExchange/cryptoExchange.route"
import { SupportRoutes } from "../modules/support/support.route"
import { WithdrawRequestRoutes } from "../modules/withdrawRequest/withdrawRequest.route"
import { AutoDepositRoutes } from "../modules/auto-deposite/auto-deposite.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/slider",
        route: SliderRoutes
    },
    {
        path: "/slider-type",
        route: sliderTypeRoutes
    },
    {
        path: "/marquee",
        route: marqueeRoutes
    },

    {
        path: "/payment-methods",
        route: depositRouter
    },
    {
        path: "/input",
        route: inputRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/promotions",
        route: PromotionRoutes
    },
    {
        path: "/deposit-requests",
        route: DepositRequestRoutes
    },
    {
        path: "/deposit-requests",
        route: DepositRequestRoutes
    },
    {
        path: "/withdraw-requests",
        route: WithdrawRequestRoutes
    },
    {
        path: "/partners",
        route: PartnerRoutes
    },
    {
        path: "/crypto-exchanges",
        route: CryptoExchangeRoutes
    },
    {
        path: "/supports",
        route: SupportRoutes
    },
    {
        path: "/auto-deposits",
        route: AutoDepositRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

