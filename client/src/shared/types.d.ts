type Position = {
    x: number;
    y: number;
}

type PlayerStore = {
    pos: Position;
    direction: 'right' | 'left';
    health: number;
    sprite: string;
    isAttacking: boolean;    
}

type Loot = {
    pos: Position;
    sprite: string;
    tags: string[];
}

type GameState = {
    players: { [key: string]: PlayerStore };
    loot: Loot[];
}


const emptyState: GameState = {
    players: [],
    items: []
}