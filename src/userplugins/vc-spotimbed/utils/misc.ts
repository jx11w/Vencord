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

import { classNameFactory } from "@api/Styles";

export const cl = classNameFactory("vc-spotimbed-");

export const sortBy = <T, R extends number>(valueFn: (elem: T) => R) => (a: T, b: T) => {
    return valueFn(a) - valueFn(b);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpList = (a: number[], b: number[], t: number) => a.map((v, i) => lerp(v, b[i], t));

export function intersperse<T, S>(array: T[], separator: S): (T | S)[] {
    return array.flatMap((a, i) => i > 0 ? [separator, a] : [a]);
}
