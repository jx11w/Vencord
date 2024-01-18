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

import { DisplayResource, ResourceType } from "../types";
import { cl } from "../utils/misc";
import { formatReleaseDate, getAlbumType } from "../utils/spotify";
import { formatDuration } from "../utils/time";
import { AttributionLine, Byline, ResourceLink } from "./common";

const PlaceholderBody = () => <>
    <div><span className={cl("placeholder", "blinking")}>movies for guys</span></div>
    <div><span className={cl("placeholder", "blinking")}>by Jane Remover</span></div>
    <div><span className={cl("placeholder", "blinking")}>on Frailty</span></div>
</>;

export interface InfoProps {
    resource: DisplayResource | null;
}

export function Info({ resource }: InfoProps) {
    return <div className={cl("info")}>
        {InfoBody(resource)}
    </div>;
}

function InfoBody(resource: InfoProps["resource"]) {
    if (!resource) return PlaceholderBody();

    const fields = getInfoFields(resource);

    return <>
        <div className={cl("titleline")}>
            <ResourceLink resource={resource} className={cl("title")} />
            <div className={cl("title-spacer")} />
            {fields.tags?.map((tag, i) => (
                <span key={i} className={cl("title-tag", "mono")}>
                    {tag}
                </span>
            ))}
        </div>
        {fields.infolines?.map((line, i) => (
            <div key={i} className={cl("infoline-wrap")}>
                {line}
            </div>
        ))}
        {fields.secondaryLines?.map((line, i) => (
            <div key={i} className={cl("infoline", "infoline-secondary")}>
                {line}
            </div>
        ))}
    </>;
}

interface InfoFields {
    tags?: string[];
    infolines?: React.ReactNode[];
    secondaryLines?: React.ReactNode[];
}
// eslint-disable-next-line consistent-return
function getInfoFields(resource: DisplayResource): InfoFields {
    switch (resource.type) {
        case ResourceType.Track: return {
            tags: [formatDuration(resource.duration_ms)],
            infolines: [
                <Byline people={resource.artists} />,
                <AttributionLine prep="on">
                    <ResourceLink resource={resource.album} className={cl("track-album")} />
                </AttributionLine>
            ],
        };
        case ResourceType.Album: {
            const secondaryInfo = [formatReleaseDate(resource.release_date)];
            if (resource.tracks.total > 1)
                secondaryInfo.push(`${resource.tracks.total} songs`);
            return {
                tags: [getAlbumType(resource)],
                infolines: [<Byline people={resource.artists} />],
                secondaryLines: [secondaryInfo.join(" \u2022 ")]
            };
        }
        case ResourceType.Artist: return {
            tags: resource.genres.slice(0, 1),
            infolines: [`${resource.followers.total} followers`],
            secondaryLines: ["Top Tracks"]
        };
        case ResourceType.Playlist: {
            const totalDuration = resource.tracks.items
                .map(({ track }) => track?.duration_ms ?? 0)
                .reduce((a, b) => a + b, 0);
            let duration = formatDuration(totalDuration);
            if (resource.tracks.total > resource.tracks.items.length)
                duration += "+";

            const secondaryLines = [`${resource.tracks.total} songs`];
            if (resource.followers.total) secondaryLines[0] += (` \u2022 ${resource.followers.total} followers`);
            if (resource.description) secondaryLines.push(resource.description);

            return {
                tags: [duration],
                infolines: [<Byline people={[resource.owner]} />],
                secondaryLines,
            };
        }
        case ResourceType.User: return {
            tags: [resource.id],
            infolines: [`${resource.followers.total} followers`],
        };
    }
}
