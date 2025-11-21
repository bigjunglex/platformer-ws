import type { Anchor } from "kaplay";

type Vec = {x: number, y: number}
export type ItemOffset = {
    vec: Vec;
    anchor: Anchor;
    angle: number;
}

type Offsets = {
    [key: string]: {
        [key: string]: ItemOffset 
    }
}

type Hitboxes = {
    [key: string]: {
        [key: string]:{
           vec: Vec,
           width: number,
           height: number
        }
    }
}

type Frames = {
    [key: string]: { [key: string]: number }
}


export const GRAVITY = 1400;

export const ITEM_OFFSETS: Offsets = {
    armor: {
        helmet_flat: {
            vec: { x: 0, y: 2 },
            anchor: 'bot',
            angle: 0
        }
    },
    weapons: {
        sword: {
            vec: { x: 0, y: 10 },
            anchor: 'botleft',
            angle: 15
        },
        gun: {
            vec: { x: 0, y: 40 },
            anchor: 'botleft',
            angle: 0
        },
        pistol: {
            vec: { x: 0, y: 40 },
            anchor: 'center',
            angle: 0
        }
    }
}


export const FRAMES: Frames = {
    characters: {
        yellowSquare: 9,
        redSquare: 20,
        purpleSquare: 31,
        greenSquare: 42,

        yellowCircle: 53,
        redCircle: 64,
        purpleCircle: 75,
        greenCircle: 86,
    },
    weapons: {
        sword: 7,
        gun: 19,
        bow: 30,
        pistol: 41,
    },
    armor: {
        helmet_flat: 8
    },
    projectile: {
        bullet: 44
    }
}

export const HITBOXES: Hitboxes = {
    weapons: {
        sword: {
            vec: {
                x: 15, y: 0
            },
            width: 32,
            height: 64,
        },
        gun: {
            vec: {
                x: 0, y: 0
            },
            width: 32,
            height: 32
        },
        pistol: {
            vec: {
                x: 0, y: 0
            },
            width: 32,
            height: 32
        }
    },

    projectiles: {
        bullet: {
            vec: {
                x: 0, y: 10
            },
            width: 16,
            height: 16
        }
    }
}

export const GENERAL_WEAPON_TAGS = [
    'ranged',
    'item',
    'weapon',
    '*'
]