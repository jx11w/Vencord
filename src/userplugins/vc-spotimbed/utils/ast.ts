/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { parseUrl } from "@utils/misc";
import { Parser } from "@webpack/common";

export type ParserNode = TextNode | LinkNode | BlockQuoteNode;

export interface LinkNode {
    type: "link";
    target: string;
    content: ParserNode[];
}

export interface BlockQuoteNode {
    type: "blockquote";
    content: ParserNode[];
}

export interface TextNode {
    type: "text";
    content: string;
}

export function walk<K extends string>(root: ParserNode[], collect: K) {
    const collected: ParserNode[] = [];

    for (const node of root) {
        if (node.type === collect)
            collected.push(node);
        if (Array.isArray(node.content))
            collected.push(...walk(node.content, collect));
    }

    return collected as Extract<ParserNode, { type: K; }>[];
}

export function isLinkEmbeddable(content: string, link: string) {
    for (const i of indexesOf(content, link)) {
        if ((content[i + link.length] ?? "").match(/\s|^$/)) return true;
    }
    return false;
}

export function getEmbeddableLinks(content: string, domain?: string) {
    const parser = Parser as typeof Parser & {
        parseToAST(content: string): ParserNode[];
    };
    const ast = parser.parseToAST(content) as ParserNode[];
    const links = walk(ast, "link").map(node => node.target);
    const embeddableLinks: string[] = [];

    new Set(links).forEach(link => {
        const isEmbeddable = isLinkEmbeddable(content, link);
        const isDomain = domain ? parseUrl(link)?.hostname === domain : true;

        if (isEmbeddable && isDomain) embeddableLinks.push(link);
    });

    return embeddableLinks;
}

export function createEmbedData(spotifyLink: string) {
    const url = new URL(spotifyLink);
    return {
        type: "link",
        id: "spotimbed://" + url.pathname,
        provider: { name: "Spotify" },
        url: spotifyLink,
    };
}

// All indexes of a substring in a string
export function* indexesOf(text: string, sub: string) {
    let i = -1;
    while ((i = text.indexOf(sub, i + 1)) !== -1) yield i;
}
