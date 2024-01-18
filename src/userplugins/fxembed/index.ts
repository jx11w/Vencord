/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    addPreSendListener,
    MessageObject,
    removePreSendListener
} from "@api/MessageEvents";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "fxEmbed",
    description: "Implements usage of FixTweet/FixupX",
    authors: [Devs.Smug],
    dependencies: ["MessageEventsAPI"],

    onSend(msg: MessageObject) {
        if (msg.content.match(/http(s)?:\/\/twitter.com/))
            msg.content = msg.content.replace("twitter", "fxtwitter");
    },

    start() {
        this.preSend = addPreSendListener((_, msg) => this.onSend(msg));
    },

    stop() {
        removePreSendListener(this.preSend);
    },
});
