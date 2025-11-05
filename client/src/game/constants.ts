type Offsets = {
    [key: string]: { [key: string]: {x: number, y: number}}
}

export const GRAVITY = 1400;

export const ITEM_OFFSETS: Offsets = {
    armor: {
        helmet: {x: 0, y: 10}
    },
    weapons: {
        sword: {x:0, y: 0}
    }
}


export const FRAMES = {
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
        helmet: 8
    }       
}
