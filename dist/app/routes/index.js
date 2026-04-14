"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const slider_route_1 = require("../modules/slider/slider.route");
const slider_Type_route_1 = require("../modules/sliderType/slider.Type.route");
const marquee_route_1 = require("../modules/marquees/marquee.route");
const deposite_route_1 = require("../modules/deposite/deposite.route");
const input_route_1 = require("../modules/input/input.route");
const admin_route_1 = require("../modules/admin/admin.route");
const promotion_route_1 = require("../modules/promotion/promotion.route");
const depositRequest_route_1 = require("../modules/depositRequest/depositRequest.route");
const partner_route_1 = require("../modules/partner/partner.route");
const cryptoExchange_route_1 = require("../modules/cryptoExchange/cryptoExchange.route");
const support_route_1 = require("../modules/support/support.route");
const withdrawRequest_route_1 = require("../modules/withdrawRequest/withdrawRequest.route");
const auto_deposite_route_1 = require("../modules/auto-deposite/auto-deposite.route");
const downloadApp_route_1 = require("../modules/downloadApp/downloadApp.route");
const game_route_1 = require("../modules/game/game.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/slider",
        route: slider_route_1.SliderRoutes
    },
    {
        path: "/slider-type",
        route: slider_Type_route_1.sliderTypeRoutes
    },
    {
        path: "/marquee",
        route: marquee_route_1.marqueeRoutes
    },
    {
        path: "/payment-methods",
        route: deposite_route_1.depositRouter
    },
    {
        path: "/input",
        route: input_route_1.inputRoutes
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes
    },
    {
        path: "/promotions",
        route: promotion_route_1.PromotionRoutes
    },
    {
        path: "/deposit-requests",
        route: depositRequest_route_1.DepositRequestRoutes
    },
    {
        path: "/deposit-requests",
        route: depositRequest_route_1.DepositRequestRoutes
    },
    {
        path: "/withdraw-requests",
        route: withdrawRequest_route_1.WithdrawRequestRoutes
    },
    {
        path: "/partners",
        route: partner_route_1.PartnerRoutes
    },
    {
        path: "/crypto-exchanges",
        route: cryptoExchange_route_1.CryptoExchangeRoutes
    },
    {
        path: "/supports",
        route: support_route_1.SupportRoutes
    },
    {
        path: "/auto-deposits",
        route: auto_deposite_route_1.AutoDepositRoutes
    },
    {
        path: "/download-apps",
        route: downloadApp_route_1.DownloadAppRoutes
    },
    {
        path: "/game",
        route: game_route_1.GameRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
