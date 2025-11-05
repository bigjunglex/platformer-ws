import kaplay from 'kaplay';

const ctx = document.getElementById("game") as HTMLCanvasElement

function initKaplay() {
    return kaplay({
        width: 18 * 64,
        height: 10 * 64,
        global: false,
        canvas: ctx,
        debug: true,
        debugKey: 'f2',
        background: '#ececec',
    });
}

const k = initKaplay();

export default k;